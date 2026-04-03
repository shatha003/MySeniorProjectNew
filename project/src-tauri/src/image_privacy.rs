use bytes::Bytes;
use chrono::{DateTime, Local};
use img_parts::{jpeg::Jpeg, png::Png, ImageEXIF};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::path::Path;

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GpsData {
    pub latitude: String,
    pub longitude: String,
    pub latitude_decimal: f64,
    pub longitude_decimal: f64,
    pub location: String,
    pub google_maps_url: String,
}

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CameraData {
    pub make: String,
    pub model: String,
    pub software: String,
}

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DatetimeData {
    pub original: String,
    pub digitized: String,
    pub modified: String,
    pub accessed: String,
    pub created: String,
}

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CameraSettings {
    pub aperture: String,
    pub exposure: String,
    pub iso: String,
    pub focal_length: String,
    pub flash: String,
    pub white_balance: String,
    pub orientation: String,
    pub x_resolution: String,
    pub y_resolution: String,
    pub resolution_unit: String,
}

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FileProperties {
    pub file_type: String,
    pub file_type_extension: String,
    pub mime_type: String,
    pub bit_depth: String,
    pub color_type: String,
    pub image_width: u32,
    pub image_height: u32,
    pub image_size: String,
    pub megapixels: String,
    pub file_size_bytes: u64,
    pub file_size_display: String,
}

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ImageMetadata {
    pub file_name: String,
    pub file_size: String,
    pub dimensions: String,
    pub gps: GpsData,
    pub camera: CameraData,
    pub datetime: DatetimeData,
    pub settings: CameraSettings,
    pub file_properties: FileProperties,
    pub has_exif: bool,
    pub exif_field_count: u32,
}

#[tauri::command]
pub fn scan_image_metadata(path: &str) -> Result<ImageMetadata, String> {
    let file_path = Path::new(path);
    let file = File::open(file_path).map_err(|e| format!("Failed to open file: {}", e))?;

    let fs_metadata = file
        .metadata()
        .map_err(|e| format!("Failed to read metadata: {}", e))?;

    let file_size_bytes = fs_metadata.len();
    let file_size_kb = file_size_bytes as f64 / 1024.0;
    let file_size_mb = file_size_bytes as f64 / (1024.0 * 1024.0);
    let file_size_display = if file_size_mb >= 1.0 {
        format!("{:.2} MB ({} bytes)", file_size_mb, file_size_bytes)
    } else {
        format!("{:.2} KB ({} bytes)", file_size_kb, file_size_bytes)
    };
    let file_size_short = if file_size_mb >= 1.0 {
        format!("{:.2} MB", file_size_mb)
    } else {
        format!("{:.2} KB", file_size_kb)
    };

    let file_name = file_path
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    // System timestamps
    let mut modified = "Unknown".to_string();
    let mut accessed = "Unknown".to_string();
    let mut created = "Unknown".to_string();

    if let Ok(mtime) = fs_metadata.modified() {
        let dt: DateTime<Local> = mtime.into();
        modified = dt.format("%Y-%m-%d %H:%M:%S").to_string();
    }
    if let Ok(atime) = fs_metadata.accessed() {
        let dt: DateTime<Local> = atime.into();
        accessed = dt.format("%Y-%m-%d %H:%M:%S").to_string();
    }
    if let Ok(ctime) = fs_metadata.created() {
        let dt: DateTime<Local> = ctime.into();
        created = dt.format("%Y-%m-%d %H:%M:%S").to_string();
    }

    let ext = file_path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("Unknown")
        .to_uppercase();
    let file_type = match ext.as_str() {
        "PNG" => "PNG",
        "JPG" | "JPEG" => "JPEG",
        "GIF" => "GIF",
        "WEBP" => "WebP",
        "BMP" => "BMP",
        _ => "Unknown",
    }
    .to_string();
    let mime_type = match ext.as_str() {
        "PNG" => "image/png",
        "JPG" | "JPEG" => "image/jpeg",
        "GIF" => "image/gif",
        "WEBP" => "image/webp",
        "BMP" => "image/bmp",
        _ => "image/unknown",
    }
    .to_string();

    let mut result = ImageMetadata {
        file_name,
        file_size: file_size_short.clone(),
        dimensions: "Unknown".to_string(),
        gps: GpsData::default(),
        camera: CameraData::default(),
        datetime: DatetimeData {
            original: "".to_string(),
            digitized: "".to_string(),
            modified,
            accessed,
            created,
        },
        settings: CameraSettings::default(),
        file_properties: FileProperties {
            file_type,
            file_type_extension: ext.clone(),
            mime_type,
            bit_depth: "Unknown".to_string(),
            color_type: "Unknown".to_string(),
            image_width: 0,
            image_height: 0,
            image_size: "Unknown".to_string(),
            megapixels: "Unknown".to_string(),
            file_size_bytes,
            file_size_display,
        },
        has_exif: false,
        exif_field_count: 0,
    };

    // Decode image to get dimensions, color type, bit depth
    if let Ok(reader) = image::io::Reader::open(file_path) {
        if let Ok(img) = reader.decode() {
            let w = img.width();
            let h = img.height();
            result.dimensions = format!("{} x {}", w, h);
            result.file_properties.image_width = w;
            result.file_properties.image_height = h;
            result.file_properties.image_size = format!("{}x{}", w, h);
            let mp = (w as f64 * h as f64) / 1_000_000.0;
            result.file_properties.megapixels = format!("{:.1}", mp);

            match img.color() {
                image::ColorType::L8 => {
                    result.file_properties.color_type = "Grayscale".to_string();
                    result.file_properties.bit_depth = "8".to_string();
                }
                image::ColorType::La8 => {
                    result.file_properties.color_type = "Grayscale+Alpha".to_string();
                    result.file_properties.bit_depth = "8".to_string();
                }
                image::ColorType::Rgb8 => {
                    result.file_properties.color_type = "RGB".to_string();
                    result.file_properties.bit_depth = "8".to_string();
                }
                image::ColorType::Rgba8 => {
                    result.file_properties.color_type = "RGBA".to_string();
                    result.file_properties.bit_depth = "8".to_string();
                }
                image::ColorType::L16 => {
                    result.file_properties.color_type = "Grayscale".to_string();
                    result.file_properties.bit_depth = "16".to_string();
                }
                image::ColorType::La16 => {
                    result.file_properties.color_type = "Grayscale+Alpha".to_string();
                    result.file_properties.bit_depth = "16".to_string();
                }
                image::ColorType::Rgb16 => {
                    result.file_properties.color_type = "RGB".to_string();
                    result.file_properties.bit_depth = "16".to_string();
                }
                image::ColorType::Rgba16 => {
                    result.file_properties.color_type = "RGBA".to_string();
                    result.file_properties.bit_depth = "16".to_string();
                }
                image::ColorType::Rgb32F => {
                    result.file_properties.color_type = "RGB (Float)".to_string();
                    result.file_properties.bit_depth = "32".to_string();
                }
                image::ColorType::Rgba32F => {
                    result.file_properties.color_type = "RGBA (Float)".to_string();
                    result.file_properties.bit_depth = "32".to_string();
                }
                _ => {
                    result.file_properties.color_type = "Other".to_string();
                    result.file_properties.bit_depth = "Unknown".to_string();
                }
            }
        }
    }

    // Read EXIF data
    let file_again = File::open(file_path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut buf_reader = std::io::BufReader::new(&file_again);
    let exif_reader = exif::Reader::new();
    let exif_data = exif_reader.read_from_container(&mut buf_reader);

    if let Ok(exif) = exif_data {
        result.has_exif = true;

        // Count all EXIF fields
        let mut field_count: u32 = 0;
        for _field in exif.fields() {
            field_count += 1;
        }
        result.exif_field_count = field_count;

        // Camera info
        if let Some(field) = exif.get_field(exif::Tag::Make, exif::In::PRIMARY) {
            result.camera.make = field.display_value().to_string().replace("\"", "");
        }
        if let Some(field) = exif.get_field(exif::Tag::Model, exif::In::PRIMARY) {
            result.camera.model = field.display_value().to_string().replace("\"", "");
        }
        if let Some(field) = exif.get_field(exif::Tag::Software, exif::In::PRIMARY) {
            result.camera.software = field.display_value().to_string().replace("\"", "");
        }

        // Timestamps from EXIF
        if let Some(field) = exif.get_field(exif::Tag::DateTimeOriginal, exif::In::PRIMARY) {
            result.datetime.original = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::DateTimeDigitized, exif::In::PRIMARY) {
            result.datetime.digitized = field.display_value().to_string();
        }

        // Camera settings
        if let Some(field) = exif.get_field(exif::Tag::FNumber, exif::In::PRIMARY) {
            result.settings.aperture = format!("f/{}", field.display_value());
        }
        if let Some(field) = exif.get_field(exif::Tag::ExposureTime, exif::In::PRIMARY) {
            result.settings.exposure = format!("{} s", field.display_value());
        }
        if let Some(field) = exif.get_field(exif::Tag::PhotographicSensitivity, exif::In::PRIMARY) {
            result.settings.iso = format!("ISO {}", field.display_value());
        }
        if let Some(field) = exif.get_field(exif::Tag::FocalLength, exif::In::PRIMARY) {
            result.settings.focal_length = format!("{} mm", field.display_value());
        }
        if let Some(field) = exif.get_field(exif::Tag::Flash, exif::In::PRIMARY) {
            result.settings.flash = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::WhiteBalance, exif::In::PRIMARY) {
            result.settings.white_balance = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::Orientation, exif::In::PRIMARY) {
            result.settings.orientation = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::XResolution, exif::In::PRIMARY) {
            result.settings.x_resolution = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::YResolution, exif::In::PRIMARY) {
            result.settings.y_resolution = field.display_value().to_string();
        }
        if let Some(field) = exif.get_field(exif::Tag::ResolutionUnit, exif::In::PRIMARY) {
            result.settings.resolution_unit = field.display_value().to_string();
        }

        // GPS
        let mut lat_decimal: Option<f64> = None;
        let mut lon_decimal: Option<f64> = None;

        if let Some(lat_field) = exif.get_field(exif::Tag::GPSLatitude, exif::In::PRIMARY) {
            let lat_ref = exif
                .get_field(exif::Tag::GPSLatitudeRef, exif::In::PRIMARY)
                .map(|f| f.display_value().to_string().replace("\"", ""))
                .unwrap_or_default();
            result.gps.latitude = format!("{} {}", lat_field.display_value(), lat_ref);
            result.gps.location = "GPS Location Found".to_string();

            // Convert DMS to decimal
            if let exif::Value::Rational(ref rats) = lat_field.value {
                if rats.len() >= 3 {
                    let deg = rats[0].to_f64();
                    let min = rats[1].to_f64();
                    let sec = rats[2].to_f64();
                    let mut dec = deg + min / 60.0 + sec / 3600.0;
                    if lat_ref.trim() == "S" {
                        dec = -dec;
                    }
                    lat_decimal = Some(dec);
                    result.gps.latitude_decimal = dec;
                }
            }
        }
        if let Some(lon_field) = exif.get_field(exif::Tag::GPSLongitude, exif::In::PRIMARY) {
            let lon_ref = exif
                .get_field(exif::Tag::GPSLongitudeRef, exif::In::PRIMARY)
                .map(|f| f.display_value().to_string().replace("\"", ""))
                .unwrap_or_default();
            result.gps.longitude = format!("{} {}", lon_field.display_value(), lon_ref);

            // Convert DMS to decimal
            if let exif::Value::Rational(ref rats) = lon_field.value {
                if rats.len() >= 3 {
                    let deg = rats[0].to_f64();
                    let min = rats[1].to_f64();
                    let sec = rats[2].to_f64();
                    let mut dec = deg + min / 60.0 + sec / 3600.0;
                    if lon_ref.trim() == "W" {
                        dec = -dec;
                    }
                    lon_decimal = Some(dec);
                    result.gps.longitude_decimal = dec;
                }
            }
        }

        // Build Google Maps URL if both coordinates exist
        if let (Some(lat), Some(lon)) = (lat_decimal, lon_decimal) {
            result.gps.google_maps_url = format!("https://www.google.com/maps?q={},{}", lat, lon);
        }
    }

    if result.gps.location.is_empty() {
        result.gps.location = "No GPS Location".to_string();
    }

    Ok(result)
}

#[tauri::command]
pub fn strip_image_metadata(path: &str, output_path: &str) -> Result<(), String> {
    let input = std::fs::read(path).map_err(|e| format!("Failed to read file: {}", e))?;
    let input_bytes = Bytes::from(input);

    let extension = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    if extension == "jpg" || extension == "jpeg" {
        if let Ok(mut jpeg) = Jpeg::from_bytes(input_bytes) {
            jpeg.set_exif(None);
            let mut out = File::create(output_path)
                .map_err(|e| format!("Failed to create output file: {}", e))?;
            jpeg.encoder()
                .write_to(&mut out)
                .map_err(|e| format!("Failed to write jpeg: {}", e))?;
            return Ok(());
        }
    } else if extension == "png" {
        if let Ok(mut png) = Png::from_bytes(input_bytes) {
            png.set_exif(None);
            let mut out = File::create(output_path)
                .map_err(|e| format!("Failed to create output file: {}", e))?;
            png.encoder()
                .write_to(&mut out)
                .map_err(|e| format!("Failed to write png: {}", e))?;
            return Ok(());
        }
    }

    Err(
        "Unsupported image format or failed to parse image. Ensure the image is JPEG or PNG."
            .to_string(),
    )
}
