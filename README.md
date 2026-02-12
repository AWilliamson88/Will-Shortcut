# Shortcuts

# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Step 1: Initialize the project

```powershell
npm install
npm run tauri init
npm run tauri dev
```

## Step 2: Add the UI components

```powershell
npm install react react-dom
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
npm install uuid
```

## Step 3: Test CRUD Operations

```powershell
npm run tauri dev
```

# -------

# Issues
- [X] Key combination field uses shift key character. Eg. "Ctrl+Shift+|" instead of "Ctrl+Shift+\".
- [X] Key combination field space isn't regecognized.
- [X] Current styles waste too much space. Need more compact styling
- [ ] Will need ability to create shortcuts like. Ctrl+Shift+[ or ] or Ctrl+1/2/3
    - [ ] Toggle field from key combination capture to just normal text field so the user can type in the key combination.
- [ ] When toggling back to the key combination field, the cursor is still in the field but pressing another key combination does nothing.
    - [ ] Allow one of the sections to be manually added and the other to be a key combination capture.

# TODO
- [ ] Settings modal
    - [ ] Open settings modal from the popup. (Click the gear icon in the top right)
    - [ ] Open settings modal from the tray. (Click the tray icon)
- [ ] Context menu.
- [X] Add the ability to add new shortcuts
- [X] Add the ability to edit shortcuts
- [X] Add the ability to delete shortcuts
- [ ] Move shortcuts up and down
    - [ ] Add a button to move the shortcut up and down
    - [ ] Drag and drop?
    - [ ] Hotkey to move up and down.
    - [ ] The order of the shortcuts needs to be saved when the list is saved.
- [X] Add the ability to delete lists
- [X] Move the delete shortcut buttons from the individual shortcuts to the edit modal.
- [ ] Add a loading spinner when loading the lists?
- When there's no list for current app?
    - [ ] Show a message to create a new list?
    - [ ] Create a new list automatically?
    - Keep showing previous list until a new list is created for the app?
        - Some way to indicate that it's not the current app's list.
        - Make select dropdown red?
- [ ] Replace up/down/left/right with ↑ / ↓ / ← / →


## Settings
- [ ] Settings to change the global hotkey
- [ ] Settings to change the appearance (light/dark)
- [ ] Settings to change the window size
    - [ ] Full height.
    - [ ] Standard height.
    - [ ] Custom height?
    - [ ] Remember last size and restore on startup?
    - [ ] Custom width?
- [ ] Settings to change the window position
    - [ ] Save last position and restore on startup?
    - [ ] Option to open at a specific position. (Left/Right, Top/Bottom)
- [ ] Show app name before the list name in the dropdown.


## Right click context menu
- [ ] Delete shortcut
- [ ] Rename shortcut
- [ ] Add new shortcut above/below

## Applications
- [ ] Change the application name asscociated with a process name.
 - - Some applications names get quite long and don't fit well in the dropdown. "Visual Studio Code" and be shortened to "VS Code" for example.
 - - Should we allow the user to change the application's name?

 ## Application Lists
 - [ ] Set the order of lists
 - [ ] Turn pages, (left/right)
    - [ ] Buttons
    - [ ] Hotkeys
 - [ ] Buttons/shortcuts to swap current list. (Up/down)
    - [ ] Cycles through the lists for current application
    - [ ] Hotkeys to move to previous/next list?
    - [ ] Wrap around to first/last list when at the end/beginning.

## Installer/Installation
- [ ] Create an installer for Windows, Mac, Linux
    - [ ] All in one if possible.
    - [ ] Otherwise, create an installer for each platform.
- [ ] Includes the ability to autostart on login.
    - [ ] Ask during install.
    - [ ] Option in settings.
- [ ] Add a donate button. (Paypal, Github Sponsors, etc)
    - [ ] Add a donate page.
    - [ ] Add a donate button to the settings page/modal.
    - [ ] Add a donate button to the tray menu.

# Application lists to start with.
- Start with lists ordered alphabetically, but with "General" first if exists.
- User defined order takes priority over default order.
- [ ] VS Code
    - [ ] General
        - [ ] Open Settings
    - [ ] Navigation
    - [ ] Editor?
    - [ ] Terminal?
        - include in general?
    - [ ] Git?
    - [ ] Debugging?
    - [ ] Extensions
        - Separate list or include in general?
    - [ ] Sidebars?

- [ ] Chrome
    - [ ] Navigation
    - [ ] Tabs
    - [ ] Bookmarks
    - [ ] History
    - [ ] Tools

- [ ] Visual Studio
    - [ ] General
    - [ ] Navigation
    - [ ] Build
    - [ ] Debug
    - [ ] Test
    - [ ] Extensions
    - [ ] Sidebars

- [ ] Other browsers if sufficiently different.
- [ ] Other editors 
    - 3 - 4 should be enough.
- [ ] Discord
- [ ] Spotify
- [ ] word
- [ ] Excel
- [ ] Powerpoint
- [ ] Teams
- [ ] Outlook
- [ ] OneNote