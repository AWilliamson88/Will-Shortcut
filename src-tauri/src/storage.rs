use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use directories::ProjectDirs;

// Data structures matching our design
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Application {
    pub id: String,
    pub name: String,
    pub process_name: String,
    pub icon: Option<String>,
    pub last_used_list_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Shortcut {
    pub id: String,
    pub key_combo: String,
    pub description: String,
    pub order: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShortcutList {
    pub id: String,
    pub name: String,
    pub application_id: String,
    pub shortcuts: Vec<Shortcut>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeyboardShortcuts {
    pub move_up: String,
    pub move_down: String,
    pub duplicate: String,
    pub delete: String,
    pub add_new: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub global_hotkey: String,
    pub always_on_top: bool,
    pub run_on_startup: bool,
    pub keyboard_shortcuts: KeyboardShortcuts,
}

// Get the app data directory
pub fn get_data_dir() -> Result<PathBuf, String> {
    if let Some(proj_dirs) = ProjectDirs::from("com", "andre", "will-shortcut") {
        let data_dir = proj_dirs.data_dir().to_path_buf();
        fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
        Ok(data_dir)
    } else {
        Err("Could not determine data directory".to_string())
    }
}

// Load settings from file
pub fn load_settings() -> Result<Settings, String> {
    let data_dir = get_data_dir()?;
    let settings_path = data_dir.join("settings.json");
    
    if settings_path.exists() {
        let contents = fs::read_to_string(settings_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&contents).map_err(|e| e.to_string())
    } else {
        // Return default settings
        Ok(Settings {
            global_hotkey: "CommandOrControl+Shift+K".to_string(),
            always_on_top: true,
            run_on_startup: false,
            keyboard_shortcuts: KeyboardShortcuts {
                move_up: "Control+Up".to_string(),
                move_down: "Control+Down".to_string(),
                duplicate: "Control+D".to_string(),
                delete: "Delete".to_string(),
                add_new: "Control+N".to_string(),
            },
        })
    }
}

// Save settings to file
pub fn save_settings(settings: &Settings) -> Result<(), String> {
    let data_dir = get_data_dir()?;
    let settings_path = data_dir.join("settings.json");
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(settings_path, json).map_err(|e| e.to_string())
}

// Load all lists
pub fn load_lists() -> Result<Vec<ShortcutList>, String> {
    let data_dir = get_data_dir()?;
    let lists_path = data_dir.join("lists.json");
    
    if lists_path.exists() {
        let contents = fs::read_to_string(lists_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&contents).map_err(|e| e.to_string())
    } else {
        Ok(Vec::new())
    }
}

// Save all lists
pub fn save_lists(lists: &Vec<ShortcutList>) -> Result<(), String> {
    let data_dir = get_data_dir()?;
    let lists_path = data_dir.join("lists.json");
    let json = serde_json::to_string_pretty(lists).map_err(|e| e.to_string())?;
    fs::write(lists_path, json).map_err(|e| e.to_string())
}

// Load all applications
pub fn load_applications() -> Result<Vec<Application>, String> {
    let data_dir = get_data_dir()?;
    let apps_path = data_dir.join("applications.json");
    
    if apps_path.exists() {
        let contents = fs::read_to_string(apps_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&contents).map_err(|e| e.to_string())
    } else {
        Ok(Vec::new())
    }
}

// Save all applications
pub fn save_applications(apps: &Vec<Application>) -> Result<(), String> {
    let data_dir = get_data_dir()?;
    let apps_path = data_dir.join("applications.json");
    let json = serde_json::to_string_pretty(apps).map_err(|e| e.to_string())?;
    fs::write(apps_path, json).map_err(|e| e.to_string())
}