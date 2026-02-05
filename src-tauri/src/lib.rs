// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod storage;
mod window_detection;
mod defaults;

use tauri::Emitter;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Get the currently active application
#[tauri::command]
fn get_active_application() -> Result<String, String> {
    window_detection::get_active_application()
}

// Get all shortcut lists
#[tauri::command]
fn get_all_lists() -> Result<Vec<storage::ShortcutList>, String> {
    storage::load_lists()
}

// Save a shortcut list
#[tauri::command]
fn save_list(list: storage::ShortcutList) -> Result<(), String> {
    let mut lists = storage::load_lists()?;
    
    // Find and update existing list, or add new one
    if let Some(index) = lists.iter().position(|l| l.id == list.id) {
        lists[index] = list;
    } else {
        lists.push(list);
    }
    
    storage::save_lists(&lists)
}

// Delete a shortcut list
#[tauri::command]
fn delete_list(list_id: String) -> Result<(), String> {
    let mut lists = storage::load_lists()?;
    lists.retain(|l| l.id != list_id);
    storage::save_lists(&lists)
}

// Get all applications
#[tauri::command]
fn get_all_applications() -> Result<Vec<storage::Application>, String> {
    storage::load_applications()
}

// Save an application
#[tauri::command]
fn save_application(app: storage::Application) -> Result<(), String> {
    let mut user_apps = storage::load_user_applications()?;
    if let Some(index) = user_apps.iter().position(|a| a.id == app.id) {
        user_apps[index] = app;
    } else {
        user_apps.push(app);
    }
    storage::save_user_applications(&user_apps)
}

// Get settings
#[tauri::command]
fn get_settings() -> Result<storage::Settings, String> {
    storage::load_settings()
}

// Save settings
#[tauri::command]
fn save_settings(settings: storage::Settings) -> Result<(), String> {
    storage::save_settings(&settings)
}

// Initialize default data if none exists
#[tauri::command]
fn initialize_defaults() -> Result<(), String> {
    let lists = storage::load_lists()?;
    if lists.is_empty() {
        let (_default_apps, default_lists) = defaults::create_default_data();
        storage::save_lists(&default_lists)?;
    }
    Ok(())
}

use tauri::{Manager, PhysicalPosition};

// Toggle window visibility
#[tauri::command]
fn toggle_window(window: tauri::Window) -> Result<(), String> {
    if window.is_visible().map_err(|e| e.to_string())? {
        window.hide().map_err(|e| e.to_string())?;
    } else {
        // Position window in bottom-right before showing
        position_window_bottom_right(&window)?;
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// Position window in bottom-right corner
fn position_window_bottom_right(window: &tauri::Window) -> Result<(), String> {
    if let Some(monitor) = window.current_monitor().map_err(|e| e.to_string())? {
        let screen_size = monitor.size();
        let window_size = window.outer_size().map_err(|e| e.to_string())?;
        
        // Calculate position (20px margin from edges)
        let x = screen_size.width as i32 - window_size.width as i32 - 20;
        let y = screen_size.height as i32 - window_size.height as i32 - 20;
        
        window.set_position(PhysicalPosition::new(x, y))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_active_application,
            get_all_lists,
            save_list,
            delete_list,
            get_all_applications,
            save_application,
            get_settings,
            save_settings,
            initialize_defaults,
            toggle_window
            ])
            .setup(|app| {
                use tauri_plugin_global_shortcut::GlobalShortcutExt;
                use active_win_pos_rs::get_active_window;

                // Register global hotkey
                let handle = app.handle().clone();
                app.global_shortcut().on_shortcut("CommandOrControl+Shift+K", move |_app, _shortcut, event| {
                    // Only trigger on key press, not release
                    if event.state == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        if let Some(window) = handle.get_webview_window("main") {
                            // Toggle window visibility directly
                            if let Ok(is_visible) = window.is_visible() {
                               if is_visible {
                                    let _ = window.emit("popup-hidden", true);
                                    let _ = window.hide();
                                } else {
                                    // Get the active app BEFORE showing the window
                                    if let Ok(active_app_name) = crate::window_detection::get_active_application() {
                                        let _ = window.emit("active-app-detected", active_app_name);
                                    }

                                    // Get the monitor where the active window is located
                                    let target_monitor = if let Ok(active_win) = get_active_window() {
                                        // Get all monitors and find which one contains the active window
                                        if let Ok(monitors) = window.available_monitors() {
                                            monitors.into_iter().find(|monitor| {
                                                let pos = monitor.position();
                                                let size = monitor.size();
                                                let monitor_x = pos.x;
                                                let monitor_y = pos.y;
                                                let monitor_width = size.width as i32;
                                                let monitor_height = size.height as i32;

                                                // Check if active window center is within this monitor
                                                let active_center_x = (active_win.position.x + active_win.position.width / 2.0) as i32;
                                                let active_center_y = (active_win.position.y + active_win.position.height / 2.0) as i32;

                                                active_center_x >= monitor_x &&
                                                active_center_x < monitor_x + monitor_width &&
                                                active_center_y >= monitor_y &&
                                                active_center_y < monitor_y + monitor_height
                                            })
                                        } else {
                                            None
                                        }
                                    } else {
                                        None
                                    };

                                    // Use the detected monitor or fall back to current monitor
                                    let monitor = target_monitor.or_else(|| window.current_monitor().ok().flatten());

                                    // Position and show
                                    if let Some(monitor) = monitor {
                                        let monitor_pos = monitor.position();
                                        let screen_size = monitor.size();

                                        if let Ok(window_size) = window.outer_size() {
                                            // Position at right side of screen, bottom aligned flush with taskbar
                                            // Taskbar height on Windows is typically 40-48px
                                            let taskbar_height = 40;
                                            // Windows has an invisible border even on frameless windows (~8px)
                                            let border_offset = 8;

                                            // Right side, flush with edge (compensate for invisible border)
                                            let x = monitor_pos.x + screen_size.width as i32 - window_size.width as i32 + border_offset;
                                            // Bottom, flush with taskbar
                                            let y = monitor_pos.y + screen_size.height as i32 - window_size.height as i32 - taskbar_height;

                                            let _ = window.set_position(PhysicalPosition::new(x, y));
                                        }
                                    }
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                    }
                })?;

                Ok(())
            })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
