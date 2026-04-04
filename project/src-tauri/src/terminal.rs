use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex, OnceLock};
use tauri::{AppHandle, Emitter};

static PTY_INSTANCE: OnceLock<Arc<Mutex<Option<PtyInstance>>>> = OnceLock::new();

pub struct PtyInstance {
    pub writer: Arc<Mutex<Box<dyn Write + Send>>>,
}

pub struct PtyState {
    pub app_handle: AppHandle,
}

fn get_or_init_pty(app_handle: &AppHandle) -> Result<Arc<Mutex<Option<PtyInstance>>>, String> {
    let pty = PTY_INSTANCE.get_or_init(|| {
        Arc::new(Mutex::new(None))
    });

    let mut guard = pty.lock().map_err(|e| e.to_string())?;
    if guard.is_some() {
        return Ok(pty.clone());
    }

    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| format!("Failed to create PTY: {}", e))?;

    let shell = if cfg!(target_os = "windows") {
        "powershell.exe"
    } else {
        "bash"
    };

    let cmd = CommandBuilder::new(shell);
    let _child = pair
        .slave
        .spawn_command(cmd)
        .map_err(|e| format!("Failed to spawn shell: {}", e))?;

    let mut reader = pair
        .master
        .try_clone_reader()
        .map_err(|e| format!("Failed to clone PTY reader: {}", e))?;
    let writer = pair.master.take_writer().map_err(|e| format!("Failed to get PTY writer: {}", e))?;

    let writer_arc = Arc::new(Mutex::new(writer));
    let writer_clone = writer_arc.clone();

    let app = app_handle.clone();
    std::thread::spawn(move || {
        let mut buffer = [0u8; 4096];
        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(n) => {
                    let output = String::from_utf8_lossy(&buffer[..n]).to_string();
                    if let Err(e) = app.emit("pty-output", output) {
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

    *guard = Some(PtyInstance { writer: writer_clone });
    Ok(pty.clone())
}

#[tauri::command]
pub fn write_to_pty(state: tauri::State<'_, PtyState>, data: String) -> Result<(), String> {
    let pty = get_or_init_pty(&state.app_handle)?;
    let guard = pty.lock().map_err(|e| e.to_string())?;
    let instance = guard.as_ref().ok_or("PTY not initialized")?;
    let mut writer = instance.writer.lock().map_err(|e| e.to_string())?;
    writer
        .write_all(data.as_bytes())
        .map_err(|e| e.to_string())?;
    writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn resize_pty(
    _state: tauri::State<'_, PtyState>,
    _rows: u16,
    _cols: u16,
) -> Result<(), String> {
    Ok(())
}
