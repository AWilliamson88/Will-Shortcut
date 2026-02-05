
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

- [X] Add the ability to add new shortcuts
- [X] Add the ability to edit shortcuts
- [X] Add the ability to delete shortcuts
- [ ] Add the ability to move shortcuts up and down
- [ ] Add the ability to duplicate shortcuts
- [X] Add the ability to delete lists
- [ ] Move the delete shortcut buttons from the individual shortcuts to the edit modal.

## Right click menu
- [ ] Delete
- [ ] Rename
- [ ] Add new

## Applications
- [ ] Change the application name asscociated with a process name.
 - - Some applications names get quite long and don't fit well in the dropdown. "Visual Studio Code" and be shortened to "VS Code" for example.
 - - Should we allow the user to change the application's name?

## Edit List Modal
- [ ] Move add/edit/delete shortcut functionality to edit list modal.
    - Current buttons take up too much space on the list.

