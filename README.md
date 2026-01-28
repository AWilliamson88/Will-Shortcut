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


# TODO

- [ ] Add the ability to add new applications
- [ ] Add the ability to add new lists
- [ ] Add the ability to add new shortcuts
- [ ] Add the ability to edit shortcuts
- [ ] Add the ability to delete shortcuts
- [ ] Add the ability to move shortcuts up and down
- [ ] Add the ability to duplicate shortcuts
- [ ] Add the ability to delete lists

## New shortcut modal
- [ ] Fix key combination field not using the key combo pressed. (Ctrl must be typed in for example)
- [ ] Modal should close if main app closed.
- [ ] Add shortcut button should be at bottom of the list.
- [ ] Save button should be enabled only if key combination and description are filled.
- [ ] Add shortcut button should be disabled if no list is selected.
- [ ] If no application is selected use add to default list.
