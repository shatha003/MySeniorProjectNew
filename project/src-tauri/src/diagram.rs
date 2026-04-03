use tauri_plugin_dialog::DialogExt;

/// Saves diagram content (base64-encoded) to a user-selected path via the native Save-As dialog.
/// Returns true if saved, false if the user cancelled.
#[tauri::command]
pub async fn save_diagram(
    app: tauri::AppHandle,
    file_name: String,
    content_base64: String,
) -> Result<bool, String> {
    use base64::Engine;

    let raw_bytes = base64::engine::general_purpose::STANDARD
        .decode(&content_base64)
        .map_err(|e| format!("base64 decode error: {}", e))?;

    // blocking_save_file is safe from a tauri command context (runs on the blocking pool)
    let path = app
        .dialog()
        .file()
        .set_file_name(&file_name)
        .add_filter("SVG Vector Image", &["svg"])
        .blocking_save_file();

    match path {
        Some(file_path) => {
            let path_buf = file_path
                .as_path()
                .ok_or_else(|| "Could not resolve file path".to_string())?;
            std::fs::write(path_buf, &raw_bytes)
                .map_err(|e| format!("Failed to write file: {}", e))?;
            Ok(true)
        }
        None => Ok(false), // user cancelled — not an error
    }
}
