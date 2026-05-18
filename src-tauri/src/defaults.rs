use crate::storage::{Application, Shortcut, ShortcutList};
use uuid::Uuid;

const VSCODE_APP_ID: &str = "9e121cd1-9808-47b9-99c9-072699fbeff3";
const CHROME_APP_ID: &str = "658cf89a-1955-43b9-95b1-6bbc1673aac5";

// Small helpers to keep default data definitions concise
fn make_shortcut(order: i32, key_combo: &str, description: &str) -> Shortcut {
	    Shortcut {
	        id: Uuid::new_v4().to_string(),
	        key_combo: key_combo.to_string(),
	        description: description.to_string(),
	        order,
	    }
}

fn make_list(app_id: &str, name: &str, shortcuts: Vec<Shortcut>) -> ShortcutList {
	    ShortcutList {
	        id: Uuid::new_v4().to_string(),
	        name: name.to_string(),
	        application_id: app_id.to_string(),
	        shortcuts,
	        created_at: "2025-01-01T00:00:00Z".to_string(),
	        updated_at: "2025-01-01T00:00:00Z".to_string(),
	    }
}

// Category templates
fn code_editor_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Shift+P", "Show Command Palette"),
	        make_shortcut(1, "Ctrl+P", "Quick Open file"),
	        make_shortcut(2, "Ctrl+S", "Save file"),
	        make_shortcut(3, "Ctrl+/", "Toggle line comment"),
	        make_shortcut(4, "Ctrl+B", "Toggle sidebar visibility"),
	    ]
}

fn code_editor_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Tab", "Next editor tab"),
	        make_shortcut(1, "Ctrl+Shift+Tab", "Previous editor tab"),
	        make_shortcut(2, "Ctrl+G", "Go to line"),
	        make_shortcut(3, "Ctrl+Shift+O", "Go to symbol in file"),
	        make_shortcut(4, "Ctrl+`", "Toggle integrated terminal"),
	    ]
}

fn browser_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+T", "Open new tab"),
	        make_shortcut(1, "Ctrl+Shift+T", "Reopen last closed tab"),
	        make_shortcut(2, "Ctrl+N", "Open new window"),
	        make_shortcut(3, "Ctrl+L", "Focus address bar"),
	        make_shortcut(4, "Ctrl+D", "Bookmark current page"),
	        make_shortcut(5, "Ctrl+H", "Open browsing history"),
	        make_shortcut(6, "Ctrl+J", "Open downloads"),
	        make_shortcut(7, "F11", "Toggle full-screen mode"),
	        make_shortcut(8, "Ctrl+Shift+O", "Open bookmark manager"),
	        make_shortcut(9, "Ctrl+F", "Find on page"),
	        make_shortcut(10, "Ctrl+U", "View page source"),
	    ]
}

fn browser_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Tab", "Next tab"),
	        make_shortcut(1, "Ctrl+Shift+Tab", "Previous tab"),
	        make_shortcut(2, "Alt+Left", "Back"),
	        make_shortcut(3, "Alt+Right", "Forward"),
	        make_shortcut(4, "Ctrl+1", "Switch to first tab"),
	        make_shortcut(5, "Ctrl+Shift+T", "Reopen last closed tab"),
	        make_shortcut(6, "Ctrl+Click", "Open link in new tab"),
	        make_shortcut(7, "Ctrl+Shift+N", "Open private/incognito window"),
	        make_shortcut(8, "F5 or Ctrl+R", "Reload page"),
	        make_shortcut(9, "Ctrl+Shift+R or Ctrl+F5", "Hard refresh"),
	    ]
}

fn terminal_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Shift+T", "Open new tab"),
	        make_shortcut(1, "Ctrl+Shift+N", "Open new window"),
	        make_shortcut(2, "Ctrl+Shift+W", "Close tab"),
	        make_shortcut(3, "Ctrl++", "Zoom in"),
	        make_shortcut(4, "Ctrl+-", "Zoom out"),
	    ]
}

fn terminal_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+L", "Clear screen"),
	        make_shortcut(1, "Ctrl+Home", "Scroll to top"),
	        make_shortcut(2, "Ctrl+End", "Scroll to bottom"),
	        make_shortcut(3, "Shift+PageUp", "Scroll up one page"),
	        make_shortcut(4, "Shift+PageDown", "Scroll down one page"),
	    ]
}

fn file_manager_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "Open new window"),
	        make_shortcut(1, "Ctrl+Shift+N", "Create new folder"),
	        make_shortcut(2, "Ctrl+C", "Copy selected items"),
	        make_shortcut(3, "Ctrl+V", "Paste items"),
	        make_shortcut(4, "Delete", "Delete selected items"),
	    ]
}

fn file_manager_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Alt+Left", "Back"),
	        make_shortcut(1, "Alt+Right", "Forward"),
	        make_shortcut(2, "Alt+Up", "Go up one folder"),
	        make_shortcut(3, "Ctrl+L", "Focus address bar"),
	        make_shortcut(4, "Ctrl+Shift+1", "Toggle details view"),
	    ]
}

fn word_processor_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "Create new document"),
	        make_shortcut(1, "Ctrl+S", "Save document"),
	        make_shortcut(2, "Ctrl+Z", "Undo"),
	        make_shortcut(3, "Ctrl+Y", "Redo"),
	        make_shortcut(4, "Ctrl+B", "Bold selection"),
	    ]
}

fn word_processor_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Home", "Go to start of document"),
	        make_shortcut(1, "Ctrl+End", "Go to end of document"),
	        make_shortcut(2, "PageUp", "Move up one page"),
	        make_shortcut(3, "PageDown", "Move down one page"),
	        make_shortcut(4, "Ctrl+F", "Find text"),
	    ]
}

fn spreadsheet_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "Create new workbook"),
	        make_shortcut(1, "Ctrl+S", "Save workbook"),
	        make_shortcut(2, "Ctrl+Z", "Undo"),
	        make_shortcut(3, "Ctrl+C", "Copy selection"),
	        make_shortcut(4, "Ctrl+V", "Paste selection"),
	    ]
}

fn spreadsheet_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+ArrowRight", "Go to last cell in row"),
	        make_shortcut(1, "Ctrl+ArrowDown", "Go to last cell in column"),
	        make_shortcut(2, "Ctrl+Home", "Go to first cell"),
	        make_shortcut(3, "Ctrl+End", "Go to last used cell"),
	        make_shortcut(4, "Ctrl+PageDown", "Next worksheet"),
	    ]
}

fn presentation_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "Create new presentation"),
	        make_shortcut(1, "Ctrl+S", "Save presentation"),
	        make_shortcut(2, "Ctrl+M", "Insert new slide"),
	        make_shortcut(3, "Ctrl+C", "Copy selection"),
	        make_shortcut(4, "Ctrl+V", "Paste selection"),
	    ]
}

fn presentation_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "F5", "Start slideshow from beginning"),
	        make_shortcut(1, "Shift+F5", "Start slideshow from current slide"),
	        make_shortcut(2, "PageDown", "Next slide"),
	        make_shortcut(3, "PageUp", "Previous slide"),
	        make_shortcut(4, "Esc", "End slideshow"),
	    ]
}

fn email_client_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "New email"),
	        make_shortcut(1, "Ctrl+R", "Reply to email"),
	        make_shortcut(2, "Ctrl+Shift+R", "Reply all"),
	        make_shortcut(3, "Ctrl+F", "Forward email"),
	        make_shortcut(4, "Ctrl+Enter", "Send email"),
	    ]
}

fn email_client_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+1", "Go to Mail view"),
	        make_shortcut(1, "Ctrl+2", "Go to Calendar view"),
	        make_shortcut(2, "Ctrl+3", "Go to Contacts view"),
	        make_shortcut(3, "Ctrl+Y", "Open folder list"),
	        make_shortcut(4, "Ctrl+E", "Search mailbox"),
	    ]
}

fn chat_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "New direct message"),
	        make_shortcut(1, "Ctrl+K", "Open quick switcher"),
	        make_shortcut(2, "Ctrl+Shift+A", "Mark all as read"),
	        make_shortcut(3, "Ctrl+/", "Show keyboard shortcuts help"),
	        make_shortcut(4, "Ctrl+.", "Toggle sidebar"),
	    ]
}

fn chat_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Alt+Up", "Previous unread conversation"),
	        make_shortcut(1, "Alt+Down", "Next unread conversation"),
	        make_shortcut(2, "Ctrl+Tab", "Next channel or workspace"),
	        make_shortcut(3, "Ctrl+Shift+Tab", "Previous channel or workspace"),
	        make_shortcut(4, "Ctrl+Shift+M", "Open activity or mentions"),
	    ]
}

fn design_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "New file"),
	        make_shortcut(1, "Ctrl+S", "Save file"),
	        make_shortcut(2, "Ctrl+Z", "Undo"),
	        make_shortcut(3, "Ctrl+Shift+Z", "Redo"),
	        make_shortcut(4, "Ctrl+G", "Group selection"),
	    ]
}

fn design_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Space", "Pan canvas"),
	        make_shortcut(1, "Ctrl++", "Zoom in"),
	        make_shortcut(2, "Ctrl+-", "Zoom out"),
	        make_shortcut(3, "Ctrl+0", "Zoom to fit"),
	        make_shortcut(4, "Ctrl+1", "Zoom to 100%"),
	    ]
}

fn devtool_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "New item or request"),
	        make_shortcut(1, "Ctrl+S", "Save changes"),
	        make_shortcut(2, "Ctrl+Z", "Undo"),
	        make_shortcut(3, "Ctrl+F", "Find in current view"),
	        make_shortcut(4, "Ctrl+W", "Close current tab"),
	    ]
}

fn devtool_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Tab", "Next tab"),
	        make_shortcut(1, "Ctrl+Shift+Tab", "Previous tab"),
	        make_shortcut(2, "Ctrl+1", "Go to first sidebar section"),
	        make_shortcut(3, "Ctrl+2", "Go to second sidebar section"),
	        make_shortcut(4, "Ctrl+L", "Focus URL or request bar"),
	    ]
	}

fn note_app_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+N", "New note or page"),
	        make_shortcut(1, "Ctrl+S", "Save note"),
	        make_shortcut(2, "Ctrl+B", "Bold selection"),
	        make_shortcut(3, "Ctrl+I", "Italic selection"),
	        make_shortcut(4, "Ctrl+K", "Insert link"),
	    ]
}

fn note_app_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+P", "Quick open or command palette"),
	        make_shortcut(1, "Ctrl+Tab", "Next open page or tab"),
	        make_shortcut(2, "Ctrl+Shift+Tab", "Previous open page or tab"),
	        make_shortcut(3, "Ctrl+F", "Search within page"),
	        make_shortcut(4, "Ctrl+Shift+F", "Search across notes"),
	    ]
}

// IntelliJ IDEA specific lists
fn intellij_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Shift+Shift", "Search Everywhere (double-tap Shift)"),
	        make_shortcut(1, "Ctrl+Alt+Shift+T", "Refactor This"),
	        make_shortcut(2, "Alt+F7", "Find Usages"),
	        make_shortcut(3, "Alt+Enter", "Show Intention Actions"),
	        make_shortcut(4, "Ctrl+Shift+A", "Find Action"),
	        make_shortcut(5, "Ctrl+Alt+L", "Reformat Code"),
	        make_shortcut(6, "Ctrl+Alt+S", "Open Settings"),
	        make_shortcut(7, "Alt+1", "Toggle Project View"),
	        make_shortcut(8, "Esc", "Focus Editor"),
	        make_shortcut(9, "Ctrl+Shift+F12", "Hide All Tool Windows"),
	    ]
}

fn intellij_editing() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Space", "Basic Code Completion"),
	        make_shortcut(1, "Ctrl+Shift+Space", "Smart Code Completion"),
	        make_shortcut(2, "Ctrl+Shift+Enter", "Complete Statement"),
	        make_shortcut(3, "Ctrl+D", "Duplicate Line/Block"),
	        make_shortcut(4, "Ctrl+Y", "Delete Line"),
	        make_shortcut(5, "Ctrl+/", "Comment/Uncomment Line"),
	        make_shortcut(6, "Ctrl+W", "Extend Selection"),
	        make_shortcut(7, "Ctrl+Shift+W", "Shrink Selection"),
	        make_shortcut(8, "Alt+Insert", "Generate Code"),
	        make_shortcut(9, "Alt+Shift+Up", "Move Line Up"),
	        make_shortcut(10, "Alt+Shift+Down", "Move Line Down"),
	        make_shortcut(11, "Ctrl+F6", "Change Signature"),
	    ]
}

fn intellij_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+B", "Go to Declaration"),
	        make_shortcut(1, "Ctrl+Alt+B", "Go to Implementation(s)"),
	        make_shortcut(2, "Alt+F7", "Find Usages"),
	        make_shortcut(3, "Ctrl+N", "Go to Class"),
	        make_shortcut(4, "Ctrl+Shift+N", "Go to File"),
	        make_shortcut(5, "Ctrl+Alt+Shift+N", "Go to Symbol"),
	        make_shortcut(6, "Ctrl+Alt+Left", "Navigate Back"),
	        make_shortcut(7, "Ctrl+Alt+Right", "Navigate Forward"),
	        make_shortcut(8, "Ctrl+Shift+Backspace", "Go to Last Edit Location"),
	        make_shortcut(9, "F2", "Next Error"),
	        make_shortcut(10, "Shift+F2", "Previous Error"),
	        make_shortcut(11, "Ctrl+Alt+H", "Show Call Hierarchy"),
	    ]
}

// Visual Studio specific lists
fn visual_studio_general() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Shift+S", "Save all files"),
	        make_shortcut(1, "Ctrl+K, Ctrl+C", "Comment selected lines"),
	        make_shortcut(2, "Ctrl+K, Ctrl+U", "Uncomment selected lines"),
	        make_shortcut(3, "Ctrl+D", "Duplicate the current line"),
	        make_shortcut(4, "Shift+Delete", "Delete the current line"),
	        make_shortcut(5, "Ctrl+F", "Find in the file"),
	        make_shortcut(6, "Ctrl+H", "Find and replace"),
	    ]
}

fn visual_studio_navigation() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+,", "Go to any file / type / member"),
	        make_shortcut(1, "F12", "Go to definition"),
	        make_shortcut(2, "Ctrl+-", "Navigate backward"),
	        make_shortcut(3, "Ctrl+Shift+-", "Navigate forward"),
	        make_shortcut(4, "Ctrl+]", "Move to matching bracket"),
	        make_shortcut(5, "Ctrl+M, Ctrl+M", "Collapse / Expand code region"),
	        make_shortcut(6, "Ctrl+M, Ctrl+L", "Collapse / Expand all regions"),
	    ]
}

fn visual_studio_code_editing() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Space", "Autocomplete (IntelliSense)"),
	        make_shortcut(1, "Ctrl+K, Ctrl+D", "Format the entire document"),
	        make_shortcut(2, "Ctrl+K, Ctrl+F", "Format selection"),
	        make_shortcut(3, "Ctrl+.", "Quick Actions and Refactoring"),
	        make_shortcut(4, "Alt+Enter", "Quick Actions and Refactoring"),
	        make_shortcut(5, "F2", "Rename symbol"),
	        make_shortcut(6, "Ctrl+R, Ctrl+E", "Encapsulate field"),
	        make_shortcut(7, "Ctrl+Shift+Space", "Parameter info"),
	        make_shortcut(8, "Alt+Up", "Move line up"),
	        make_shortcut(9, "Alt+Down", "Move line down"),
	        make_shortcut(10, "Shift+Alt+Up", "Copy line up"),
	        make_shortcut(11, "Shift+Alt+Down", "Copy line down"),
	    ]
}

fn visual_studio_window_management() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "Ctrl+Alt+L", "Show Solution Explorer"),
	        make_shortcut(1, "Ctrl+Alt+O", "Show Output Window"),
	        make_shortcut(2, "Ctrl+\\, Ctrl+E", "Show Error List"),
	        make_shortcut(3, "Shift+Escape", "Close current tool window"),
	        make_shortcut(4, "Alt+F7", "Move to the next window"),
	        make_shortcut(5, "Ctrl+W, S", "Activate Solution Explorer window"),
	    ]
}

fn visual_studio_debugging() -> Vec<Shortcut> {
	    vec![
	        make_shortcut(0, "F5", "Start debugging"),
	        make_shortcut(1, "Ctrl+F5", "Start without debugging"),
	        make_shortcut(2, "F9", "Set / Remove breakpoint"),
	        make_shortcut(3, "F10", "Step over"),
	        make_shortcut(4, "F11", "Step into"),
	        make_shortcut(5, "Shift+F11", "Step out"),
	        make_shortcut(6, "Shift+F5", "Stop debugging"),
	        make_shortcut(7, "Ctrl+Alt+Q", "QuickWatch window"),
	    ]
}

pub fn create_default_data() -> (Vec<Application>, Vec<ShortcutList>) {
	    let mut applications = Vec::new();
	    let mut lists = Vec::new();

	    // VS Code
	    let vscode_id = VSCODE_APP_ID.to_string();
	    applications.push(Application {
	        id: vscode_id.clone(),
	        name: "VS Code".to_string(),
	        process_name: "Code.exe".to_string(),
	        detection_name: "Visual Studio Code".to_string(),
	        icon: None,
	        last_used_list_id: None,
	    });
	    lists.push(make_list(&vscode_id, "General", code_editor_general()));
	    lists.push(make_list(&vscode_id, "Navigation", code_editor_navigation()));

	    // Chrome
	    let chrome_id = CHROME_APP_ID.to_string();
	    applications.push(Application {
	        id: chrome_id.clone(),
	        name: "Chrome".to_string(),
	        process_name: "chrome.exe".to_string(),
	        detection_name: "Google Chrome".to_string(),
	        icon: None,
	        last_used_list_id: None,
	    });
	    lists.push(make_list(&chrome_id, "General", browser_general()));
	    lists.push(make_list(&chrome_id, "Navigation", browser_navigation()));

	    // Additional browsers
	    let edge_id = "app-msedge".to_string();
	    lists.push(make_list(&edge_id, "General", browser_general()));
	    lists.push(make_list(&edge_id, "Navigation", browser_navigation()));

	    let firefox_id = "app-firefox".to_string();
	    lists.push(make_list(&firefox_id, "General", browser_general()));
	    lists.push(make_list(&firefox_id, "Navigation", browser_navigation()));

	    let safari_id = "app-safari".to_string();
	    lists.push(make_list(&safari_id, "General", browser_general()));
	    lists.push(make_list(&safari_id, "Navigation", browser_navigation()));

	    let brave_id = "app-brave".to_string();
	    lists.push(make_list(&brave_id, "General", browser_general()));
	    lists.push(make_list(&brave_id, "Navigation", browser_navigation()));

	    let opera_id = "app-opera".to_string();
	    lists.push(make_list(&opera_id, "General", browser_general()));
	    lists.push(make_list(&opera_id, "Navigation", browser_navigation()));

	    // Code editors and IDEs
	    let vs_id = "app-visual-studio".to_string();
	    // Use richer Visual Studio-specific lists; keep Debugging as list #3
	    lists.push(make_list(&vs_id, "General", visual_studio_general()));
	    lists.push(make_list(&vs_id, "Navigation", visual_studio_navigation()));
	    lists.push(make_list(&vs_id, "Debugging", visual_studio_debugging()));
	    lists.push(make_list(&vs_id, "Code Editing", visual_studio_code_editing()));
	    lists.push(make_list(&vs_id, "Window Management", visual_studio_window_management()));

	    let intellij_id = "app-intellij-idea".to_string();
	    lists.push(make_list(&intellij_id, "General", intellij_general()));
	    lists.push(make_list(&intellij_id, "Editing", intellij_editing()));
	    lists.push(make_list(&intellij_id, "Navigation", intellij_navigation()));

	    let pycharm_id = "app-pycharm".to_string();
	    lists.push(make_list(&pycharm_id, "General", code_editor_general()));
	    lists.push(make_list(&pycharm_id, "Navigation", code_editor_navigation()));

	    let webstorm_id = "app-webstorm".to_string();
	    lists.push(make_list(&webstorm_id, "General", code_editor_general()));
	    lists.push(make_list(&webstorm_id, "Navigation", code_editor_navigation()));

	    let rider_id = "app-rider".to_string();
	    lists.push(make_list(&rider_id, "General", code_editor_general()));
	    lists.push(make_list(&rider_id, "Navigation", code_editor_navigation()));

	    let android_studio_id = "app-android-studio".to_string();
	    lists.push(make_list(&android_studio_id, "General", code_editor_general()));
	    lists.push(make_list(&android_studio_id, "Navigation", code_editor_navigation()));

	    let xcode_id = "app-xcode".to_string();
	    lists.push(make_list(&xcode_id, "General", code_editor_general()));
	    lists.push(make_list(&xcode_id, "Navigation", code_editor_navigation()));

	    let sublime_id = "app-sublime-text".to_string();
	    lists.push(make_list(&sublime_id, "General", code_editor_general()));
	    lists.push(make_list(&sublime_id, "Navigation", code_editor_navigation()));

	    let notepadpp_id = "app-notepad-plusplus".to_string();
	    lists.push(make_list(&notepadpp_id, "General", code_editor_general()));
	    lists.push(make_list(&notepadpp_id, "Navigation", code_editor_navigation()));

	    let vim_id = "app-vim".to_string();
	    lists.push(make_list(&vim_id, "General", code_editor_general()));
	    lists.push(make_list(&vim_id, "Navigation", code_editor_navigation()));

	    let emacs_id = "app-emacs".to_string();
	    lists.push(make_list(&emacs_id, "General", code_editor_general()));
	    lists.push(make_list(&emacs_id, "Navigation", code_editor_navigation()));

	    // Terminals
	    let wt_id = "app-windows-terminal".to_string();
	    lists.push(make_list(&wt_id, "General", terminal_general()));
	    lists.push(make_list(&wt_id, "Navigation", terminal_navigation()));

	    let cmd_id = "app-cmd".to_string();
	    lists.push(make_list(&cmd_id, "General", terminal_general()));
	    lists.push(make_list(&cmd_id, "Navigation", terminal_navigation()));

	    let ps_id = "app-powershell".to_string();
	    lists.push(make_list(&ps_id, "General", terminal_general()));
	    lists.push(make_list(&ps_id, "Navigation", terminal_navigation()));

	    let iterm_id = "app-iterm2".to_string();
	    lists.push(make_list(&iterm_id, "General", terminal_general()));
	    lists.push(make_list(&iterm_id, "Navigation", terminal_navigation()));

	    let mac_term_id = "app-mac-terminal".to_string();
	    lists.push(make_list(&mac_term_id, "General", terminal_general()));
	    lists.push(make_list(&mac_term_id, "Navigation", terminal_navigation()));

	    // File managers
	    let explorer_id = "app-windows-explorer".to_string();
	    lists.push(make_list(&explorer_id, "General", file_manager_general()));
	    lists.push(make_list(&explorer_id, "Navigation", file_manager_navigation()));

	    let finder_id = "app-finder".to_string();
	    lists.push(make_list(&finder_id, "General", file_manager_general()));
	    lists.push(make_list(&finder_id, "Navigation", file_manager_navigation()));

	    let nautilus_id = "app-nautilus".to_string();
	    lists.push(make_list(&nautilus_id, "General", file_manager_general()));
	    lists.push(make_list(&nautilus_id, "Navigation", file_manager_navigation()));

	    let dolphin_id = "app-dolphin".to_string();
	    lists.push(make_list(&dolphin_id, "General", file_manager_general()));
	    lists.push(make_list(&dolphin_id, "Navigation", file_manager_navigation()));

	    let totalcmd_id = "app-total-commander".to_string();
	    lists.push(make_list(&totalcmd_id, "General", file_manager_general()));
	    lists.push(make_list(&totalcmd_id, "Navigation", file_manager_navigation()));

	    // Office apps
	    let word_id = "app-word".to_string();
	    lists.push(make_list(&word_id, "General", word_processor_general()));
	    lists.push(make_list(&word_id, "Navigation", word_processor_navigation()));

	    let onenote_id = "app-onenote".to_string();
	    lists.push(make_list(&onenote_id, "General", word_processor_general()));
	    lists.push(make_list(&onenote_id, "Navigation", word_processor_navigation()));

	    let excel_id = "app-excel".to_string();
	    lists.push(make_list(&excel_id, "General", spreadsheet_general()));
	    lists.push(make_list(&excel_id, "Navigation", spreadsheet_navigation()));

	    let powerpoint_id = "app-powerpoint".to_string();
	    lists.push(make_list(&powerpoint_id, "General", presentation_general()));
	    lists.push(make_list(&powerpoint_id, "Navigation", presentation_navigation()));

	    let outlook_id = "app-outlook".to_string();
	    lists.push(make_list(&outlook_id, "General", email_client_general()));
	    lists.push(make_list(&outlook_id, "Navigation", email_client_navigation()));

	    // Communication tools
	    let slack_id = "app-slack".to_string();
	    lists.push(make_list(&slack_id, "General", chat_general()));
	    lists.push(make_list(&slack_id, "Navigation", chat_navigation()));

	    let teams_id = "app-teams".to_string();
	    lists.push(make_list(&teams_id, "General", chat_general()));
	    lists.push(make_list(&teams_id, "Navigation", chat_navigation()));

	    let discord_id = "app-discord".to_string();
	    lists.push(make_list(&discord_id, "General", chat_general()));
	    lists.push(make_list(&discord_id, "Navigation", chat_navigation()));

	    let zoom_id = "app-zoom".to_string();
	    lists.push(make_list(&zoom_id, "General", chat_general()));
	    lists.push(make_list(&zoom_id, "Navigation", chat_navigation()));

	    let skype_id = "app-skype".to_string();
	    lists.push(make_list(&skype_id, "General", chat_general()));
	    lists.push(make_list(&skype_id, "Navigation", chat_navigation()));

	    // Design tools
	    let figma_id = "app-figma".to_string();
	    lists.push(make_list(&figma_id, "General", design_general()));
	    lists.push(make_list(&figma_id, "Navigation", design_navigation()));

	    let photoshop_id = "app-photoshop".to_string();
	    lists.push(make_list(&photoshop_id, "General", design_general()));
	    lists.push(make_list(&photoshop_id, "Navigation", design_navigation()));

	    let illustrator_id = "app-illustrator".to_string();
	    lists.push(make_list(&illustrator_id, "General", design_general()));
	    lists.push(make_list(&illustrator_id, "Navigation", design_navigation()));

	    let xd_id = "app-adobe-xd".to_string();
	    lists.push(make_list(&xd_id, "General", design_general()));
	    lists.push(make_list(&xd_id, "Navigation", design_navigation()));

	    let sketch_id = "app-sketch".to_string();
	    lists.push(make_list(&sketch_id, "General", design_general()));
	    lists.push(make_list(&sketch_id, "Navigation", design_navigation()));

	    // Dev tools
	    let gitkraken_id = "app-gitkraken".to_string();
	    lists.push(make_list(&gitkraken_id, "General", devtool_general()));
	    lists.push(make_list(&gitkraken_id, "Navigation", devtool_navigation()));

	    let postman_id = "app-postman".to_string();
	    lists.push(make_list(&postman_id, "General", devtool_general()));
	    lists.push(make_list(&postman_id, "Navigation", devtool_navigation()));

	    let insomnia_id = "app-insomnia".to_string();
	    lists.push(make_list(&insomnia_id, "General", devtool_general()));
	    lists.push(make_list(&insomnia_id, "Navigation", devtool_navigation()));

	    let docker_id = "app-docker-desktop".to_string();
	    lists.push(make_list(&docker_id, "General", devtool_general()));
	    lists.push(make_list(&docker_id, "Navigation", devtool_navigation()));

	    let git_gui_id = "app-git-gui".to_string();
	    lists.push(make_list(&git_gui_id, "General", devtool_general()));
	    lists.push(make_list(&git_gui_id, "Navigation", devtool_navigation()));

	    // Notes, tasks, and knowledge tools
	    let notion_id = "app-notion".to_string();
	    lists.push(make_list(&notion_id, "General", note_app_general()));
	    lists.push(make_list(&notion_id, "Navigation", note_app_navigation()));

	    let obsidian_id = "app-obsidian".to_string();
	    lists.push(make_list(&obsidian_id, "General", note_app_general()));
	    lists.push(make_list(&obsidian_id, "Navigation", note_app_navigation()));

	    let evernote_id = "app-evernote".to_string();
	    lists.push(make_list(&evernote_id, "General", note_app_general()));
	    lists.push(make_list(&evernote_id, "Navigation", note_app_navigation()));

	    let todoist_id = "app-todoist".to_string();
	    lists.push(make_list(&todoist_id, "General", note_app_general()));
	    lists.push(make_list(&todoist_id, "Navigation", note_app_navigation()));

	    let trello_id = "app-trello".to_string();
	    lists.push(make_list(&trello_id, "General", note_app_general()));
	    lists.push(make_list(&trello_id, "Navigation", note_app_navigation()));

	    (applications, lists)
}
