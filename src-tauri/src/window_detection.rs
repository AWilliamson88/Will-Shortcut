use active_win_pos_rs::get_active_window;

// Get the currently active application's name (from active_win_pos_rs)
pub fn get_active_application() -> Result<String, String> {
    match get_active_window() {
        Ok(active_window) => Ok(active_window.app_name),
        Err(_) => Err("Failed to get active window".to_string()),
    }
}

// Get the currently active application's window title
pub fn get_active_window_title() -> Result<String, String> {
    match get_active_window() {
        Ok(active_window) => Ok(active_window.app_name),
        Err(_) => Err("Failed to get active window".to_string()),
    }
}
