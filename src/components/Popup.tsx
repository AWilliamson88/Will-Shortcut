import type React from 'react';
import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useShortcuts } from '../hooks/useShortcuts';
import { ShortcutList, Shortcut, Application } from '../types';
import { Keyboard, Settings as SettingsIcon, Plus, Edit2 } from 'lucide-react';
import { ShortcutModal } from './ShortcutModal';
import { ShortcutRow } from './ShortcutRow';
import { ShortcutContextMenu } from './ShortcutContextMenu';
import { v4 as uuidv4 } from 'uuid';
import { ListManageModal } from './ListManageModal';
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { PhysicalPosition } from "@tauri-apps/api/dpi";
import {
  sortShortcuts,
  deleteShortcut as deleteShortcutFromList,
  updateShortcut as updateShortcutInList,
  insertShortcutAt,
  moveShortcut,
} from '../utils/shortcutListUtils';

type ContextMenuState =
  | { isOpen: false }
  | {
      isOpen: true;
      shortcutId: string;
      index: number;
      x: number;
      y: number;
    };

export function Popup() {
  const { shortcutLists, applications, activeApp, loading, error, saveList, deleteList, dumpApps, saveApplication } = useShortcuts();
	  const [selectedListId, setSelectedListId] = useState<string | null>(null);
	  const [isModalOpen, setIsModalOpen] = useState(false);
	  const [editingShortcut, setEditingShortcut] = useState<Shortcut | undefined>(undefined);
	  const [detectedActiveApp, setDetectedActiveApp] = useState<string>('');
	  const [isListModalOpen, setIsListModalOpen] = useState(false);
	  const [insertIndex, setInsertIndex] = useState<number | null>(null);
	  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ isOpen: false });

	  // Listen for active app detection event
	  useEffect(() => {
	    const unlisten = listen<string>('active-app-detected', (event) => {
	      // Only update the detected app name; actual list selection is handled
	      // by the autoSelectList effect that reacts to detectedActiveApp changes.
	      setDetectedActiveApp(event.payload);
	    });

	    return () => {
	      unlisten.then((fn) => fn());
	    };
	  }, []);

  // select a list when data loads
  useEffect(() => {
    console.log("Auto-selecting list...");
    autoSelectList();
  }, [shortcutLists, applications, activeApp, detectedActiveApp]);

		  // Close modals when popup is hidden and persist the *current* app's last used list
		  useEffect(() => {
		    const unlistenPromise = listen('popup-hidden', () => {
		      setIsModalOpen(false);
		      setEditingShortcut(undefined);
		      setIsListModalOpen(false);
		      setInsertIndex(null);
		      setContextMenu({ isOpen: false });
		      
		      if (!selectedListId) {
		        return;
		      }
		      
		      // Work out which app this popup session was showing shortcuts for,
		      // based on the detected active app or the current activeApp fallback.
		      const currentIdentifier =
		        detectedActiveApp ||
		        activeApp?.detection_name ||
		        activeApp?.process_name;
		      
		      if (!currentIdentifier) {
		        return;
		      }
		      
		      const appForIdentifier = applications.find((app) => {
		        const matchKey = app.detection_name || app.process_name;
		        return matchKey === currentIdentifier;
		      });
		      
		      if (!appForIdentifier) {
		        return;
		      }
		      
		      if (appForIdentifier.last_used_list_id !== selectedListId) {
		        saveApplication({ ...appForIdentifier, last_used_list_id: selectedListId });
		      }
		    });
	
		    return () => {
		      unlistenPromise.then((unlisten) => unlisten());
		    };
		  }, [applications, activeApp, detectedActiveApp, selectedListId, saveApplication]);
	
		  // Auto-select the appropriate list for the current app when data or
		  // the detected app changes
		  const autoSelectList = (identifier?: string) => {
		    const currentIdentifier =
		      identifier ||
		      detectedActiveApp ||
		      activeApp?.detection_name ||
		      activeApp?.process_name;
		
		    console.log('Current active identifier:', currentIdentifier);
		    console.log('Lists:', shortcutLists);
		
		    if (!currentIdentifier) {
		      setSelectedListId(null);
		      return;
		    }
		
		    const appForIdentifier = applications.find((app) => {
		      const matchKey = app.detection_name || app.process_name;
		      return matchKey === currentIdentifier;
		    });
		
		    console.log('Resolved app for identifier:', appForIdentifier);
		
		    const activeAppLists = appForIdentifier
		      ? shortcutLists.filter((list) => list.application_id === appForIdentifier.id)
		      : [];
		
		    console.log('Active app lists:', activeAppLists);
		
		    if (activeAppLists.length > 0) {
		      const lastUsed = appForIdentifier?.last_used_list_id;
		      const lastUsedList = lastUsed
		        ? activeAppLists.find((l) => l.id === lastUsed)
		        : undefined;
		
		      const nextSelectedId = lastUsedList?.id ?? activeAppLists[0].id;
		      setSelectedListId(nextSelectedId);
		      console.log('Selected list:', nextSelectedId);
		    } else {
		      setSelectedListId(null);
		      console.log('No list found for active app, null.');
		    }
		  };

  const openSettingsWindow = async () => {
    const w = await WebviewWindow.getByLabel("settings");
    if (!w) { console.error("Settings window not found"); return; }
    const monitor = await currentMonitor();
    if (monitor) {
      const { width, height } = await w.outerSize();
      const x = monitor.position.x + Math.round((monitor.size.width - width) / 2);
      const y = monitor.position.y + Math.round((monitor.size.height - height) / 2);
      await w.setPosition(new PhysicalPosition(x, y));
    }
    await w.show();
    await w.setFocus();
  };

	  const getSelectedList = (): ShortcutList | null => {
	    if (!selectedListId) return null;
	    return shortcutLists.find((l) => l.id === selectedListId) || null;
	  };

	  const updateSelectedListShortcuts = async (
	    transform: (shortcuts: Shortcut[]) => Shortcut[],
	  ) => {
	    const selectedList = getSelectedList();
	    if (!selectedList) return;

	    const updatedShortcuts = transform(selectedList.shortcuts);
	    const updatedList: ShortcutList = {
	      ...selectedList,
	      shortcuts: updatedShortcuts,
	      updated_at: new Date().toISOString(),
	    };

	    await saveList(updatedList);
	  };

	  const handleAddShortcut = () => {
	    setEditingShortcut(undefined);
	    setInsertIndex(null);
	    setIsModalOpen(true);
	  };

	  const handleShortcutContextMenu = (
	    event: React.MouseEvent<HTMLDivElement>,
	    shortcut: Shortcut,
	    index: number,
	  ) => {
	    event.preventDefault();
	    setContextMenu({
	      isOpen: true,
	      shortcutId: shortcut.id,
	      index,
	      x: event.clientX,
	      y: event.clientY,
	    });
	  };

	  const handleEditShortcut = (shortcut: Shortcut) => {
	    setEditingShortcut(shortcut);
	    setInsertIndex(null);
	    setIsModalOpen(true);
	  };

	  const handleSaveShortcut = async (shortcut: Shortcut) => {
	    await updateSelectedListShortcuts((shortcuts) => {
	      if (editingShortcut) {
	        return updateShortcutInList(shortcuts, shortcut);
	      }

	      const index = insertIndex !== null ? insertIndex : shortcuts.length;
	      const newShortcut: Shortcut = {
	        ...shortcut,
	        order: index,
	      };

	      return insertShortcutAt(shortcuts, newShortcut, index);
	    });

	    setEditingShortcut(undefined);
	    setInsertIndex(null);
	  };

	  const handleDeleteShortcut = async (shortcutId: string) => {
	    await updateSelectedListShortcuts((shortcuts) =>
	      deleteShortcutFromList(shortcuts, shortcutId),
	    );
	  };

	  const handleAddShortcutAbove = () => {
	    if (!contextMenu.isOpen) return;
	    setEditingShortcut(undefined);
	    setInsertIndex(contextMenu.index);
	    setIsModalOpen(true);
	  };

	  const handleAddShortcutBelow = () => {
	    if (!contextMenu.isOpen) return;
	    setEditingShortcut(undefined);
	    setInsertIndex(contextMenu.index + 1);
	    setIsModalOpen(true);
	  };

	  const handleRenameShortcutFromMenu = () => {
	    if (!contextMenu.isOpen) return;
	    const selectedList = getSelectedList();
	    if (!selectedList) return;
	    const shortcut = selectedList.shortcuts.find(
	      (s) => s.id === contextMenu.shortcutId,
	    );
	    if (!shortcut) return;
	    handleEditShortcut(shortcut);
	  };

		  const handleMoveShortcut = async (direction: 'up' | 'down') => {
		    if (!contextMenu.isOpen) return;
		    const selectedList = getSelectedList();
		    if (!selectedList) return;
		
		    const sorted = sortShortcuts(selectedList.shortcuts);
		    const fromIndex = sorted.findIndex(
		      (s) => s.id === contextMenu.shortcutId,
		    );
		    if (fromIndex === -1) return;
		
		    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
		
		    if (toIndex < 0 || toIndex >= sorted.length) {
		      return;
		    }
		
		    await updateSelectedListShortcuts((shortcuts) =>
		      moveShortcut(shortcuts, fromIndex, toIndex),
		    );
		  };

	  const handleDeleteShortcutFromMenu = async () => {
	    if (!contextMenu.isOpen) return;
	    await handleDeleteShortcut(contextMenu.shortcutId);
	  };

	  const closeContextMenu = () => {
	    setContextMenu({ isOpen: false });
	  };

	  const handleCreateList = async (name: string) => {
    const currentActiveApp = detectedActiveApp || activeApp?.process_name;
    if (!currentActiveApp) return;

    let appForList = applications.find(app => {
      const matchKey = app.detection_name || app.process_name;
      return matchKey === currentActiveApp;
    });

    if (!appForList) {
      const rawIdentifier = currentActiveApp.trim();

      let displayName = rawIdentifier;
      if (displayName.toLowerCase().endsWith('.exe')) {
        displayName = displayName.slice(0, -4);
      }
      displayName = displayName.replace(/\s+/g, ' ').trim();

      const newApp: Application = {
        id: uuidv4(),
        name: displayName,
        process_name: rawIdentifier,
        detection_name: rawIdentifier,
      };

      await saveApplication(newApp);
      appForList = newApp;
    }

    const now = new Date().toISOString();
    const newList: ShortcutList = {
      id: uuidv4(),
      name: name.trim(),
      application_id: appForList.id,
      shortcuts: [],
      created_at: now,
      updated_at: now,
    };

    await saveList(newList);
    setSelectedListId(newList.id);
  };

  const handleDeleteCurrentList = async () => {
    if (!selectedListId) return;
    await deleteList(selectedListId);
    setSelectedListId(null);
    // Update the active app's last used list id
    if (activeApp) {
      await saveApplication({ ...activeApp, last_used_list_id: undefined });
    }
    // Auto select a new list
    autoSelectList();
  };

  const handleRenameList = async (name: string) => {
    if (!selectedListId) return;
    const selectedList = shortcutLists.find(l => l.id === selectedListId);
    if (!selectedList) return;

    const trimmed = name.trim();
    if (!trimmed || trimmed === selectedList.name) return;

    const updatedList: ShortcutList = {
      ...selectedList,
      name: trimmed,
      updated_at: new Date().toISOString(),
    };

    await saveList(updatedList);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <Keyboard className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading shortcuts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

const activeIdentifier =
  detectedActiveApp ||
  activeApp?.detection_name ||
  activeApp?.process_name ||
  '';

  const activeAppRecord = activeIdentifier
    ? applications.find((app) => {
      const matchKey = app.detection_name || app.process_name;
      return matchKey === activeIdentifier;
    })
    : undefined;

  const hasListForCurrentApp = shortcutLists.some((list) => {
    const app = applications.find((a) => a.id === list.application_id);
    if (!app) return false;
    const matchKey = app.detection_name || app.process_name;
    return matchKey === activeIdentifier;
  });

	  const defaultNewListName = (() => {
    if (!activeIdentifier) return 'New list';
    const appForList = applications.find((app) => {
      const matchKey = app.detection_name || app.process_name;
      return matchKey === activeIdentifier;
    });
    if (appForList?.name) {
      return `${appForList.name} shortcuts`;
    }
	    return `${activeIdentifier} shortcuts`;
	  })();

	  const selectedList = selectedListId
	    ? shortcutLists.find((l) => l.id === selectedListId) || null
	    : null;

		  const sortedShortcuts = selectedList ? sortShortcuts(selectedList.shortcuts) : [];
		
		  const nextOrder = selectedList ? selectedList.shortcuts.length : 0;
		
		  const contextMenuIndex =
		    contextMenu.isOpen
		      ? sortedShortcuts.findIndex(
		          (s) => s.id === contextMenu.shortcutId,
		        )
		      : -1;
		
		  const canMoveUp = contextMenuIndex > 0;
		  const canMoveDown =
		    contextMenuIndex !== -1 &&
		    contextMenuIndex < sortedShortcuts.length - 1;

	  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Will-Shortcut</h1>
        </div>
      </div>

      {/* Dropdown */}
      <div className="p-1 border-b border-gray-700 flex items-center gap-2">
        <select
          className="flex-1 bg-gray-800 text-white px-2 py-1 rounded border border-gray-700
          focus:outline-none focus:border-blue-500 w-10"
          value={selectedListId || ''}
          onChange={(e) => {
            setSelectedListId(e.target.value)
          }}
        >
	      {shortcutLists.length === 0 || !hasListForCurrentApp ? (
	        <option value="">No lists available</option>
	      ) : (
	        shortcutLists.map((list: ShortcutList) => {
	          const app = applications.find((a) => a.id === list.application_id);
	          return (
	            <option key={list.id} value={list.id}>
	              {app?.name || 'Unknown'} - {list.name}
	            </option>
	          );
	        })
	      )}
        </select>
        <button
          type="button"
          onClick={() => {
            console.log("Edit button clicked");
            setIsListModalOpen(true);
          }}
          className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
          title={selectedListId ? 'Edit list' : 'Create list'}
        >
          <Edit2 className="w-4 h-4 text-gray-300" />
        </button>
        <button
          type="button"
          onClick={openSettingsWindow}
          className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Shortcuts List */}
      <div className="flex-1 overflow-y-auto py-1">
	        {selectedList ? sortedShortcuts.length > 0 ? (
	          <div>
	            {sortedShortcuts.map((shortcut, index) => (
	              <ShortcutRow
	                key={shortcut.id}
	                shortcut={shortcut}
	                index={index}
	                onClick={handleEditShortcut}
	                onContextMenu={handleShortcutContextMenu}
					tabIndex={0}
	              />
	            ))}
	          </div>
	        ) : (
          <div className="text-center text-gray-500 mt-8">
            <Keyboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No shortcuts in this list</p>
            <p className="text-sm mt-2">
              {hasListForCurrentApp
                ? 'Click "Add Shortcut" to get started'
                : 'Click "Create List" to get started'}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <Keyboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No lists available</p>
            <p className="text-sm mt-2">Create a new list to get started</p>
          </div>
        )}
      </div>

      {/* Add Shortcut / Create List Button */}
      <div className="px-4 py-3">
        {hasListForCurrentApp ? (
          <button
            onClick={handleAddShortcut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Shortcut
          </button>
        ) : (
          <button
            onClick={() => handleCreateList(defaultNewListName)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 text-base text-center">
        Active: {activeAppRecord?.name || activeIdentifier || 'Unknown'}
      </div>

	      <ShortcutContextMenu
	        isOpen={contextMenu.isOpen}
	        x={contextMenu.isOpen ? contextMenu.x : 0}
	        y={contextMenu.isOpen ? contextMenu.y : 0}
	        canMoveUp={canMoveUp}
	        canMoveDown={canMoveDown}
	        onRename={handleRenameShortcutFromMenu}
	        onDelete={handleDeleteShortcutFromMenu}
	        onAddAbove={handleAddShortcutAbove}
	        onAddBelow={handleAddShortcutBelow}
	        onMoveUp={() => handleMoveShortcut('up')}
	        onMoveDown={() => handleMoveShortcut('down')}
	        onClose={closeContextMenu}
	      />

	      {/* Modal */}
      <ShortcutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShortcut}
        shortcut={editingShortcut}
        nextOrder={nextOrder}
        onDelete={handleDeleteShortcut}
      />

      <ListManageModal
        isOpen={isListModalOpen}
        selectedList={selectedListId ? shortcutLists.find(l => l.id === selectedListId) || null : null}
        onClose={() => setIsListModalOpen(false)}
        onCreate={handleCreateList}
        onRename={handleRenameList}
        onDelete={handleDeleteCurrentList}
        dumpApps={dumpApps}
      />
    </div>
  );
}