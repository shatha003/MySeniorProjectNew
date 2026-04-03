mod ai_agent;
mod crypto;
mod diagram;
mod image_privacy;
mod terminal;
mod virustotal;

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let pty_state = terminal::spawn_pty_reader(app.handle().clone());
            app.manage(pty_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            crypto::encrypt_text,
            crypto::decrypt_text,
            image_privacy::scan_image_metadata,
            image_privacy::strip_image_metadata,
            virustotal::scan_url,
            virustotal::scan_file,
            ai_agent::chat_with_ai,
            diagram::save_diagram,
            terminal::write_to_pty,
            terminal::resize_pty
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
