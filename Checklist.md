# Project Checklist

 - [ ] Settings should be stored in configuration files or environment variables.

# Issues
- [X] Key combination field uses shift key character. Eg. "Ctrl+Shift+|" instead of "Ctrl+Shift+\".
- [X] Key combination field space isn't regecognized.
- [X] Current styles waste too much space. Need more compact styling
- [X] Will need ability to create shortcuts like. Ctrl+Shift+[ or ] or Ctrl+1/2/3
    - [X] Toggle field from key combination capture to just normal text field so the user can type in the key combination.
- [ ] When toggling back to the key combination field, the cursor is still in the field but pressing another key combination does nothing.
    - [ ] Allow one of the sections to be manually added and the other to be a key combination capture.
- [X] Settings window opens on the main screen not the current screen.
- [X] App name in dropdown should update when the active app changes
- [X] App name in dropdown should update when new list is created.
- [X] Each application should save their lists in their own json file.
- [X] Lists should include their applications name in the json not just it's id.
- [X] Need to be able to add single keys like " f6" not just "ctrl+shift+k" for example.
- [X] Add shortcut modal should focus the key combination field when opened.
- [ ] 
- [ ] 

# TODO
- [X] Settings modal
    - [X] Open settings modal from the popup. (Click the gear icon in the top right)
    - [X] Open settings modal from the tray. (Click the tray icon)
- [X] Context menu.
- [X] Add the ability to add new shortcuts
- [X] Add the ability to edit shortcuts
- [X] Add the ability to delete shortcuts

- [ ] Move shortcuts up and down
    - [ ] Add hotkey text to the settings.
    - [ ] Add text to the shortcut row context menu items showing the hotkeys to move up and down.
    - [X] Add a button to move the shortcut up and down
        - Not necessary. Use hotkeys.
    - [O] Drag and drop?
        - Not necessary. Use hotkeys.
    - [X] Hotkey to move up and down.
    - [X] The order of the shortcuts needs to be saved when the list is saved.
- [X] Add the ability to delete lists
- [X] Move the delete shortcut buttons from the individual shortcuts to the edit modal.
- When there's no list for current app?
    - [X] Show the empty list
    - [X] Swap out the add shortcut button for a button to create a new list.
- [X] Replace up/down/left/right with ↑ / ↓ / ← / →
- [X] Allow for ↑ / ↓ / ← / → keys to be used in the key combination field(Text mode)
- [X] Allow for ↑ / ↓ / ← / → keys to be used in the description field.
- [ ] 


## Settings
- [X] Settings to change the global hotkey
- [ ] Settings to change the appearance (light/dark)
- [ ] Settings to change the window size
    - [ ] Full height.
    - [ ] Standard height.
    - [ ] Custom height?
    - [ ] Custom width?
- [X] Settings to change the window position
    - [X] Save last position and restore on startup?
    - [X] Option to open at a specific position. (Left/Right, Top/Bottom)
- [ ] Show app name before the list name in the dropdown.


## Right click context menu
- [X] Shortcut context(right click) menu
    - [X] Delete shortcut
    - [X] Edit shortcut (Open the edit modal)
        - [X] Remove open edit modal from the shortcut row click event.
    - [X] Add new shortcut above/below
    - [X] Move shortcut up and down

    ### Things are always more complicated than they seem.
    - [X] Move all shortcut manipulation logic from components and into it's own utils file.
    - [X] Extract a ShortcutRow component
        - [X] Will display the descriptions and key combination.
        - [X] The row will be responsible for it's own actions.
        - [X] Props
            - [X] shortcut
            - [X] index
            - [X] onClick
            - [X] onContextMenu(shortcut, index, event)
    - [ ] ShortcutContextMenu component
        - disable the menu action when:
            - [X] first item → cannot move up
            - [X] last item → cannot move down
        - Close the context menu on:
            - [X] click outside
            - [X] Escape
            - [X] scroll
        - Props:
            - [X] isOpen
            - [X] position: { x: number; y: number }
            - [X] canMoveUp
            - [X] canMoveDown
        - Callbacks
    - [X] Update Popup.tsx to use the new components.
        - [X] Create new shortcut editor state object
        - [X] create new Context menu state object.
        - [X] Don’t keep order math in the modal, move to util function
        - [X] Don't sort in-place.
        - [X] sortShortcuts(selectedList.shortcuts)

    - [?] Add a subtle ... action button, right-click isn’t always obvious. Make the ... verticle not horizontal.


## Applications
- [X] Change the application name asscociated with a process name.
 - - Some applications names get quite long and don't fit well in the dropdown. "Visual Studio Code" and be shortened to "VS Code" for example.
 - [X] Allow the user to change the application's name.
 - [ ] Default application lists
    - [ ] Add a default list for each application.
    - [ ] Add a default set of shortcuts for each application.
 - [X] User application list
 - [ ] User app list should 
 ### App Icons
 - [ ] Add an icon for each application.
    - [ ] Option to upload an icon.
    - [ ] Option to use the application's icon.
    - [ ] Option to use a default icon.

 ## Application Lists
 - [ ] Dropdown to show only lists for current application.
    - [ ] Option to show all lists in settings.
 - [ ] Set the order of lists
 - [ ] Turn pages, (left/right)
    - [ ] Buttons
    - [ ] Hotkeys
 - [ ] Buttons/shortcuts to swap current list. (Up/down)
    - [ ] Cycles through the lists for current application
    - [ ] Hotkeys to move to previous/next list?
    - [ ] Wrap around to first/last list when at the end/beginning.

## Installer/Installation
- [X] Create an installer for Windows, Mac, Linux
    - [X] All in one if possible.
    - [-] Otherwise, create an installer for each platform.
- [X] Includes the ability to autostart on login.
    - [-] Ask during install.
    - [X] Option in settings.
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