use active_win_pos_rs::get_active_window;
use std::path::Path;

// Get the currently active application's process name
pub fn get_active_application() -> Result<String, String> {
    match get_active_window() {
        Ok(active_window) => {
            // Extract just the filename from the process path
            let process_path = active_window.process_path;
            if let Some(file_name) = Path::new(&process_path).file_name() {
                if let Some(name) = file_name.to_str() {
                    // Remove file extension (e.g., .exe)
                    let name_without_ext = name.trim_end_matches(".exe");
                    return Ok(name_without_ext.to_string());
                }
            }
            Ok(process_path.to_string_lossy().to_string())
        }
        Err(_) => Err("Failed to get active window".to_string()),
    }
}

// Get the currently active application's window title
pub fn get_active_window_title() -> Result<String, String> {
    match get_active_window() {
        Ok(active_window) => {
            Ok(active_window.title)
        }
        Err(_) => Err("Failed to get active window".to_string()),
    }
}