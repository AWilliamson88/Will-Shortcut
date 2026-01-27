// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod storage;
mod window_detection;
mod defaults;

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
    let mut apps = storage::load_applications()?;
    
    if let Some(index) = apps.iter().position(|a| a.id == app.id) {
        apps[index] = app;
    } else {
        apps.push(app);
    }
    
    storage::save_applications(&apps)
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
    let apps = storage::load_applications()?;
    
    // Only initialize if no data exists
    if lists.is_empty() && apps.is_empty() {
        let (default_apps, default_lists) = defaults::create_default_data();
        storage::save_applications(&default_apps)?;
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
                use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutEvent};
                
                // Register global hotkey
                let handle = app.handle().clone();
                app.global_shortcut().on_shortcut("CommandOrControl+Shift+K", move |_app, _shortcut, event| {
                    // Only trigger on key press, not release
                    if event.state == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        if let Some(window) = handle.get_webview_window("main") {
                            // Toggle window visibility directly
                            if let Ok(is_visible) = window.is_visible() {
                                if is_visible {
                                    let _ = window.hide();
                                } else {
                                    // Position and show
                                    if let Some(monitor) = window.current_monitor().ok().flatten() {
                                        let screen_size = monitor.size();
                                        if let Ok(window_size) = window.outer_size() {
                                            let x = screen_size.width as i32 - window_size.width as i32 - 20;
                                            let y = screen_size.height as i32 - window_size.height as i32 - 20;
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
