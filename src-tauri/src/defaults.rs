use crate::storage::{Application, Shortcut, ShortcutList};
use uuid::Uuid;

pub fn create_default_data() -> (Vec<Application>, Vec<ShortcutList>) {
    let mut applications = Vec::new();
    let mut lists = Vec::new();

    // VS Code
    let vscode_id = Uuid::new_v4().to_string();
    applications.push(Application {
        id: vscode_id.clone(),
        name: "Visual Studio Code".to_string(),
        process_name: "Code.exe".to_string(),
        icon: None,
        last_used_list_id: None,
    });

    let vscode_list_id = Uuid::new_v4().to_string();
    lists.push(ShortcutList {
        id: vscode_list_id,
        name: "General".to_string(),
        application_id: vscode_id.clone(),
        shortcuts: vec![
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+Shift+P".to_string(),
                description: "Command Palette".to_string(),
                order: 0,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+P".to_string(),
                description: "Quick Open File".to_string(),
                order: 1,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+`".to_string(),
                description: "Toggle Terminal".to_string(),
                order: 2,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+B".to_string(),
                description: "Toggle Sidebar".to_string(),
                order: 3,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+/".to_string(),
                description: "Toggle Comment".to_string(),
                order: 4,
            },
        ],
        created_at: "2025-01-01T00:00:00Z".to_string(),
        updated_at: "2025-01-01T00:00:00Z".to_string(),
    });

    // Chrome
    let chrome_id = Uuid::new_v4().to_string();
    applications.push(Application {
        id: chrome_id.clone(),
        name: "Google Chrome".to_string(),
        process_name: "chrome.exe".to_string(),
        icon: None,
        last_used_list_id: None,
    });

    let chrome_list_id = Uuid::new_v4().to_string();
    lists.push(ShortcutList {
        id: chrome_list_id,
        name: "Navigation".to_string(),
        application_id: chrome_id,
        shortcuts: vec![
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+T".to_string(),
                description: "New Tab".to_string(),
                order: 0,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+W".to_string(),
                description: "Close Tab".to_string(),
                order: 1,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+Tab".to_string(),
                description: "Next Tab".to_string(),
                order: 2,
            },
            Shortcut {
                id: Uuid::new_v4().to_string(),
                key_combo: "Ctrl+Shift+T".to_string(),
                description: "Reopen Closed Tab".to_string(),
                order: 3,
            },
        ],
        created_at: "2025-01-01T00:00:00Z".to_string(),
        updated_at: "2025-01-01T00:00:00Z".to_string(),
    });

    (applications, lists)
}