# Will-Shortcut

# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Step 1: Initialize the project

```powershell
npm install
npm run tauri init
```

## Step 2: Add the UI components

```powershell
npm install react react-dom
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
npm install uuid
```

## Step 3: Test App

```powershell
npm run tauri dev
```

## Step 4: Build App

```powershell
npm run tauri build
```
- Find the installer in `src-tauri\target\release\`
- Run the installer.
