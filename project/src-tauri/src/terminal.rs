use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};

pub struct PtyState {
    pub writer: Arc<Mutex<Box<dyn Write + Send>>>,
}

#[tauri::command]
pub fn write_to_pty(state: tauri::State<'_, PtyState>, data: String) -> Result<(), String> {
    let mut writer = state.writer.lock().map_err(|e| e.to_string())?;
    writer
        .write_all(data.as_bytes())
        .map_err(|e| e.to_string())?;
    writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}

pub fn spawn_pty_reader(app_handle: AppHandle) -> PtyState {
    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .expect("Failed to create PTY");

    let shell = if cfg!(target_os = "windows") {
        "powershell.exe"
    } else {
        "bash"
    };

    let cmd = CommandBuilder::new(shell);
    let _child = pair
        .slave
        .spawn_command(cmd)
        .expect("Failed to spawn shell");

    let mut reader = pair
        .master
        .try_clone_reader()
        .expect("Failed to clone PTY reader");
    let writer = pair.master.take_writer().expect("Failed to get PTY writer");

    std::thread::spawn(move || {
        let mut buffer = [0u8; 4096];
        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(n) => {
                    let output = String::from_utf8_lossy(&buffer[..n]).to_string();
                    if let Err(e) = app_handle.emit("pty-output", output) {
                        eprintln!("Failed to emit PTY output: {}", e);
                    }
                }
                Err(e) => {
                    eprintln!("PTY read error: {}", e);
                    break;
                }
            }
        }
    });

    PtyState {
        writer: Arc::new(Mutex::new(writer)),
    }
}

#[tauri::command]
pub fn resize_pty(
    _state: tauri::State<'_, PtyState>,
    _rows: u16,
    _cols: u16,
) -> Result<(), String> {
    Ok(())
}
