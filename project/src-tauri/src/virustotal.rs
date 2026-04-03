use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::time::Duration;
use sha2::{Sha256, Digest};
use std::fs::File;
use std::io::{Read, BufReader};

const API_KEY: &str = "f0c0be10cd79cdbda397cc236c5bf064cf542558587cd653a9c75768f783478f";
const BASE_URL: &str = "https://www.virustotal.com/api/v3";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ScanResult {
    pub target: String,
    pub status: String,
    pub reputation: i64,
    pub categories: Vec<String>,
    pub detections: Vec<Detection>,
    pub scan_date: String,
    pub file_size: Option<u64>,
    pub file_hash: Option<String>,
    pub stats: ScanStats,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ScanStats {
    pub malicious: i64,
    pub suspicious: i64,
    pub harmless: i64,
    pub undetected: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Detection {
    pub engine: String,
    pub result: String,
    pub category: String,
}

fn create_client() -> Result<Client, String> {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(120))
        .build()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn scan_url(url: String) -> Result<ScanResult, String> {
    let client = create_client()?;

    // VirusTotal URL scan endpoint expects x-www-form-urlencoded body with "url" field
    let body = format!("url={}", urlencoding::encode(&url));

    let res = client.post(format!("{}/urls", BASE_URL))
        .header("x-apikey", API_KEY)
        .header("content-type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await
        .map_err(|e| format!("Failed to submit URL: {}", e))?;

    if !res.status().is_success() {
        let err_text = res.text().await.unwrap_or_default();
        return Err(format!("API error when submitting URL: {}", err_text));
    }

    let json: Value = res.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    let analysis_id = json["data"]["id"].as_str().ok_or("No analysis ID returned")?.to_string();

    poll_analysis(&client, &analysis_id, url, None, None).await
}

async fn poll_analysis(
    client: &Client,
    analysis_id: &str,
    target: String,
    file_size: Option<u64>,
    file_hash: Option<String>,
) -> Result<ScanResult, String> {
    let mut attempts = 0;
    loop {
        if attempts > 30 {
            return Err("Scan timeout. Please try again later.".into());
        }

        tokio::time::sleep(Duration::from_secs(4)).await;

        let res = client
            .get(format!("{}/analyses/{}", BASE_URL, analysis_id))
            .header("x-apikey", API_KEY)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            attempts += 1;
            continue;
        }

        let json: Value = res.json().await.map_err(|e| e.to_string())?;

        let status = json["data"]["attributes"]["status"]
            .as_str()
            .unwrap_or("queued");
        if status == "completed" {
            let attributes = &json["data"]["attributes"];
            let results = &attributes["results"];

            let stats_val = &attributes["stats"];
            let stats = ScanStats {
                malicious: stats_val["malicious"].as_i64().unwrap_or(0),
                suspicious: stats_val["suspicious"].as_i64().unwrap_or(0),
                harmless: stats_val["harmless"].as_i64().unwrap_or(0),
                undetected: stats_val["undetected"].as_i64().unwrap_or(0),
            };

            let mut detections = Vec::new();
            if let Some(res_obj) = results.as_object() {
                for (engine, info) in res_obj {
                    let category = info["category"]
                        .as_str()
                        .unwrap_or("undetected")
                        .to_string();
                    let result_str = info["result"].as_str().unwrap_or("clean").to_string();
                    detections.push(Detection {
                        engine: engine.clone(),
                        result: result_str,
                        category,
                    });
                }
            }

            let reputation = attributes
                .get("reputation")
                .and_then(|r| r.as_i64())
                .unwrap_or(0);

            return Ok(ScanResult {
                target,
                status: if stats.malicious > 0 {
                    "malicious".into()
                } else if stats.suspicious > 0 {
                    "suspicious".into()
                } else {
                    "clean".into()
                },
                reputation,
                categories: vec![],
                detections,
                scan_date: "Just now".into(),
                file_size,
                file_hash,
                stats,
            });
        }
        attempts += 1;
    }
}

fn hash_file(path: &str) -> std::io::Result<(String, u64)> {
    let file = File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 8192];
    let mut size: u64 = 0;

    loop {
        let n = reader.read(&mut buffer)?;
        if n == 0 {
            break;
        }
        size += n as u64;
        hasher.update(&buffer[..n]);
    }

    Ok((format!("{:x}", hasher.finalize()), size))
}

#[tauri::command]
pub async fn scan_file(file_path: String) -> Result<ScanResult, String> {
    // 1. Hash the file locally
    let path_clone = file_path.clone();
    let (hash, size) = tokio::task::spawn_blocking(move || hash_file(&path_clone))
        .await
        .map_err(|e| format!("Task join error: {}", e))?
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let client = create_client()?;

    // 2. Check if hash is already known to VirusTotal
    let res = client
        .get(format!("{}/files/{}", BASE_URL, hash))
        .header("x-apikey", API_KEY)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let json: Value = res
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        return parse_file_report(&json, hash, size);
    }

    // 3. File not in VT database — upload it
    let file_data = tokio::fs::read(&file_path)
        .await
        .map_err(|e| format!("Failed to read file for upload: {}", e))?;

    let file_name = std::path::Path::new(&file_path)
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "file".to_string());

    // Determine upload URL (large files > 32MB need a special URL)
    let upload_url = if size > 32 * 1024 * 1024 {
        let url_res = client
            .get(format!("{}/files/upload_url", BASE_URL))
            .header("x-apikey", API_KEY)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !url_res.status().is_success() {
            return Err("Failed to get upload URL for large file.".into());
        }
        let json: Value = url_res.json().await.map_err(|e| e.to_string())?;
        json["data"]
            .as_str()
            .ok_or("No upload URL returned")?
            .to_string()
    } else {
        format!("{}/files", BASE_URL)
    };

    // Build multipart form
    let part = reqwest::multipart::Part::bytes(file_data).file_name(file_name.clone());
    let form = reqwest::multipart::Form::new().part("file", part);

    let upload_res = client
        .post(&upload_url)
        .header("x-apikey", API_KEY)
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("Failed to upload file: {}", e))?;

    if !upload_res.status().is_success() {
        let err_text = upload_res.text().await.unwrap_or_default();
        return Err(format!("VirusTotal upload error: {}", err_text));
    }

    let json: Value = upload_res.json().await.map_err(|e| e.to_string())?;
    let analysis_id = json["data"]["id"]
        .as_str()
        .ok_or("No analysis ID returned")?
        .to_string();

    poll_analysis(&client, &analysis_id, file_name, Some(size), Some(hash)).await
}

fn parse_file_report(json: &Value, hash: String, size: u64) -> Result<ScanResult, String> {
    let attributes = &json["data"]["attributes"];

    let stats_val = &attributes["last_analysis_stats"];
    let stats = ScanStats {
        malicious: stats_val["malicious"].as_i64().unwrap_or(0),
        suspicious: stats_val["suspicious"].as_i64().unwrap_or(0),
        harmless: stats_val["harmless"].as_i64().unwrap_or(0),
        undetected: stats_val["undetected"].as_i64().unwrap_or(0),
    };

    let mut detections = Vec::new();
    if let Some(res_obj) = attributes["last_analysis_results"].as_object() {
        for (engine, info) in res_obj {
            let category = info["category"]
                .as_str()
                .unwrap_or("undetected")
                .to_string();
            let result_str = info["result"].as_str().unwrap_or("clean").to_string();
            detections.push(Detection {
                engine: engine.clone(),
                result: result_str,
                category,
            });
        }
    }

    let target_name = attributes["meaningful_name"]
        .as_str()
        .unwrap_or("Unknown File")
        .to_string();
    let size_attr = attributes["size"].as_u64().unwrap_or(size);
    let reputation = attributes["reputation"].as_i64().unwrap_or(0);

    Ok(ScanResult {
        target: target_name,
        status: if stats.malicious > 0 {
            "malicious".into()
        } else if stats.suspicious > 0 {
            "suspicious".into()
        } else {
            "clean".into()
        },
        reputation,
        categories: vec![],
        detections,
        scan_date: "Previously Scanned".into(),
        file_size: Some(size_attr),
        file_hash: Some(hash),
        stats,
    })
}
