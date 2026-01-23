// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod storage;
mod window_detection;

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
            save_settings
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
