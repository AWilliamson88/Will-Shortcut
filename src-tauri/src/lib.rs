// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod defaults;
mod storage;
mod window_detection;

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

// Get the currently active application's title
#[tauri::command]
fn get_active_window_title() -> Result<String, String> {
    window_detection::get_active_window_title()
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

// Debugging command to print merged applications
#[tauri::command]
fn debug_dump_applications() -> Result<Vec<storage::Application>, String> {
    let apps = storage::load_applications()?;
    println!("Merged applications: {:#?}", apps);
    Ok(apps)
}

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
    PhysicalPosition,
};

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

#[tauri::command]
fn refresh_global_hotkey(app: tauri::AppHandle) -> Result<(), String> {
    use tauri_plugin_global_shortcut::GlobalShortcutExt;

    let settings = crate::storage::load_settings().map_err(|e| e.to_string())?;

    app.global_shortcut()
        .unregister_all()
        .map_err(|e| e.to_string())?;

    register_global_hotkey(&app, settings.global_hotkey.as_str())
}

// Position window in bottom-right corner
fn position_window_bottom_right(window: &tauri::Window) -> Result<(), String> {
    if let Some(monitor) = window.current_monitor().map_err(|e| e.to_string())? {
        let screen_size = monitor.size();
        let window_size = window.outer_size().map_err(|e| e.to_string())?;

        // Calculate position (20px margin from edges)
        let x = screen_size.width as i32 - window_size.width as i32 - 20;
        let y = screen_size.height as i32 - window_size.height as i32 - 20;

        window
            .set_position(PhysicalPosition::new(x, y))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        //.plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_active_application,
            get_active_window_title,
            get_all_lists,
            save_list,
            delete_list,
            get_all_applications,
            save_application,
            get_settings,
            save_settings,
            initialize_defaults,
            toggle_window,
            debug_dump_applications,
            refresh_global_hotkey
        ])
	        .setup(|app| {
	            #[cfg(desktop)]
	            app.handle().plugin(tauri_plugin_autostart::init(
	                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
	                None,
	            ));

	            // Create a system tray icon with:
	            // - Open Settings
	            // - Quit Will-Shortcut
	            #[cfg(desktop)]
	            {
	                let open_settings_item =
	                    MenuItem::with_id(app, "open_settings", "Open Settings", true, None::<&str>)
	                        .expect("failed to create tray Open Settings menu item");
	                let quit_item =
	                    MenuItem::with_id(app, "quit", "Quit Will-Shortcut", true, None::<&str>)
	                        .expect("failed to create tray Quit menu item");
	                let menu = Menu::with_items(app, &[&open_settings_item, &quit_item])
	                    .expect("failed to create tray menu");

	                // Use the app icon as the tray icon
	                let _tray = TrayIconBuilder::new()
	                    .icon(app.default_window_icon().unwrap().clone())
	                    .menu(&menu)
	                    .menu_on_left_click(true)
	                    .on_menu_event(|app, event| match event.id.as_ref() {
	                        "open_settings" => {
	                            if let Some(window) = app.get_webview_window("settings") {
	                                let _ = window.show();
	                                let _ = window.set_focus();
	                            }
	                        }
	                        "quit" => {
	                            app.exit(0);
	                        }
	                        _ => {
	                            println!("Unhandled tray menu item: {:?}", event.id);
	                        }
	                    })
	                    .build(app)
	                    .expect("failed to build tray icon");
	            }

	            use active_win_pos_rs::get_active_window;
	            use tauri_plugin_global_shortcut::GlobalShortcutExt;

	            // Load settings once at startup
	            let settings = crate::storage::load_settings().unwrap_or_else(|_| {
	                storage::Settings {
	                    // fallback if load fails
	                    global_hotkey: "CommandOrControl+Shift+Alt+K".into(),
	                    always_on_top: true,
	                    run_on_startup: true,
	                    keyboard_shortcuts: storage::KeyboardShortcuts {
	                        move_up: "Control+Up".into(),
	                        move_down: "Control+Down".into(),
	                        duplicate: "Control+D".into(),
	                        delete: "Delete".into(),
	                        add_new: "Control+N".into(),
	                    },
	                    window_position: "BottomRight".into(),
	                }
	            });

	            // Register global hotkey using helper
	            let app_handle = app.handle().clone();
	            if let Err(e) = register_global_hotkey(&app_handle, settings.global_hotkey.as_str()) {
	                eprintln!("Failed to register global hotkey on startup: {e}");
	            }

	            Ok(())
	        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn register_global_hotkey(app: &tauri::AppHandle, hotkey: &str) -> Result<(), String> {
    use active_win_pos_rs::get_active_window;
    use tauri_plugin_global_shortcut::GlobalShortcutExt;

    let handle = app.clone();

    app.global_shortcut()
        .on_shortcut(hotkey, move |_app, _shortcut, event| {
            // ⬅ paste your existing toggle logic here
            // Only trigger on key press, not release
            if event.state == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                if let Some(window) = handle.get_webview_window("main") {
                    // Toggle window visibility directly
                    if let Ok(is_visible) = window.is_visible() {
                        if is_visible {
                            if let Some(settings_window) = handle.get_webview_window("settings") {
                                let _ = settings_window.hide();
                            }
                            let _ = window.emit("popup-hidden", true);
                            let _ = window.hide();
                        } else {
                            // Get the active app BEFORE showing the window
                            if let Ok(active_app_name) =
                                crate::window_detection::get_active_application()
                            {
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
                                        let active_center_x = (active_win.position.x
                                            + active_win.position.width / 2.0)
                                            as i32;
                                        let active_center_y = (active_win.position.y
                                            + active_win.position.height / 2.0)
                                            as i32;

                                        active_center_x >= monitor_x
                                            && active_center_x < monitor_x + monitor_width
                                            && active_center_y >= monitor_y
                                            && active_center_y < monitor_y + monitor_height
                                    })
                                } else {
                                    None
                                }
                            } else {
                                None
                            };

                            // Use the detected monitor or fall back to current monitor
                            let monitor =
                                target_monitor.or_else(|| window.current_monitor().ok().flatten());

                            // Position and show
                            if let Some(monitor) = monitor {
                                let monitor_pos = monitor.position();
                                let screen_size = monitor.size();

                                if let Ok(window_size) = window.outer_size() {
                                    let taskbar_height = 40;
                                    let border_offset = 8;

                                    // Load settings to decide which corner to use
                                    let settings =
                                        crate::storage::load_settings().unwrap_or_else(|_| {
                                            storage::Settings {
                                                // simple fallback if load fails
                                                global_hotkey: "CommandOrControl+Shift+Alt+K".into(),
                                                always_on_top: true,
                                                run_on_startup: true,
                                                keyboard_shortcuts: storage::KeyboardShortcuts {
                                                    move_up: "Control+Up".into(),
                                                    move_down: "Control+Down".into(),
                                                    duplicate: "Control+D".into(),
                                                    delete: "Delete".into(),
                                                    add_new: "Control+N".into(),
                                                },
                                                window_position: "BottomRight".into(),
                                            }
                                        });

                                    let (x, y) = match settings.window_position.as_str() {
                                        "TopLeft" => (monitor_pos.x - border_offset, monitor_pos.y),
                                        "TopRight" => (
                                            monitor_pos.x + screen_size.width as i32
                                                - window_size.width as i32
                                                + border_offset,
                                            monitor_pos.y,
                                        ),
                                        "BottomLeft" => (
                                            monitor_pos.x - border_offset,
                                            monitor_pos.y + screen_size.height as i32
                                                - window_size.height as i32
                                                - taskbar_height,
                                        ),
                                        // default: BottomRight
                                        _ => (
                                            monitor_pos.x + screen_size.width as i32
                                                - window_size.width as i32
                                                + border_offset,
                                            monitor_pos.y + screen_size.height as i32
                                                - window_size.height as i32
                                                - taskbar_height,
                                        ),
                                    };

                                    let _ = window.set_position(PhysicalPosition::new(x, y));
                                }
                            }
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                }
            }
        })
        .map_err(|e| e.to_string())
}
