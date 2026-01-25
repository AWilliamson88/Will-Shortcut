// TypeScript interfaces matching Rust backend structures

export interface Application {
  id: string;
  name: string;
  process_name: string;
  icon?: string;
  last_used_list_id?: string;
}

export interface Shortcut {
  id: string;
  key_combo: string;
  description: string;
  order: number;
}

export interface ShortcutList {
  id: string;
  name: string;
  application_id: string;
  shortcuts: Shortcut[];
  created_at: string;
  updated_at: string;
}

export interface KeyboardShortcuts {
  move_up: string;
  move_down: string;
  duplicate: string;
  delete: string;
  add_new: string;
}

export interface Settings {
  global_hotkey: string;
  always_on_top: boolean;
  run_on_startup: boolean;
  keyboard_shortcuts: KeyboardShortcuts;
}