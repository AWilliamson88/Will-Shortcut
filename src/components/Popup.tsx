import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useShortcuts } from '../hooks/useShortcuts';
import { ShortcutList, Shortcut, Application } from '../types';
import { Keyboard, Settings as SettingsIcon, Plus, Edit2 } from 'lucide-react';
import { ShortcutModal } from './ShortcutModal';
import { v4 as uuidv4 } from 'uuid';
import { ListManageModal } from './ListManageModal';
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { PhysicalPosition } from "@tauri-apps/api/dpi";

export function Popup() {
  const { shortcutLists, applications, activeApp, loading, error, saveList, deleteList, dumpApps, saveApplication } = useShortcuts();
  const [selectedList, setSelectedList] = useState<ShortcutList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | undefined>(undefined);
  const [detectedActiveApp, setDetectedActiveApp] = useState<string>('');
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Listen for active app detection event
  useEffect(() => {
    const unlisten = listen<string>('active-app-detected', (event) => {
      setDetectedActiveApp(event.payload);
      // Update selectedList when the active app changes
      if (activeApp !== event.payload) {
        autoSelectList();
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  // Auto-select the first list when data loads
  useEffect(() => {
    console.log("Auto-selecting list...");
    autoSelectList();
  }, [shortcutLists, applications, activeApp, detectedActiveApp, selectedList]);

  // Update selectedList when lists change
  useEffect(() => {
    console.log("Updating selected list...");
    if (selectedList) {
      console.log("Selected list:", selectedList);
      const updatedList = shortcutLists.find(l => l.id === selectedList.id);
      if (updatedList) {
        console.log("Found updated list:", updatedList);
        setSelectedList(updatedList);
      }
    }
  }, [shortcutLists]);

  // Close modals when popup is hidden
  useEffect(() => {
    const unlistenPromise = listen('popup-hidden', () => {
      setIsModalOpen(false);
      setEditingShortcut(undefined);
      setIsListModalOpen(false);
    });

    return () => {
      unlistenPromise.then(unlisten => unlisten());
    };
  }, []);

  // Auto-select the first list when data loads
  const autoSelectList = () => {
    // if (shortcutLists.length > 0 && !selectedList) {
    // Try to find a list for the active app (use detected app if available)
    const currentActiveApp = detectedActiveApp || activeApp;
    console.log("Current active app:", currentActiveApp);
    console.log("lists:", shortcutLists);
    const activeAppLists = shortcutLists.filter(list => {
      const app = applications.find(a => a.id === list.application_id);
      if (!app) return false;
      const matchKey = app.detection_name || app.process_name;
      return matchKey === currentActiveApp;
    });

    console.log("Active app lists:", activeAppLists);
    if (activeAppLists.length > 0) {
      setSelectedList(activeAppLists[0]);
      console.log("Found list for active app:", activeAppLists[0].name);
    } else {
      setSelectedList(null);
      console.log("No list found for active app, null: ");
    }
    // }
    console.log("Active app:", detectedActiveApp || activeApp);
    console.log("  ");
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

  const handleAddShortcut = () => {
    setEditingShortcut(undefined);
    setIsModalOpen(true);
  };

  const handleEditShortcut = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setIsModalOpen(true);
  };

  const handleSaveShortcut = async (shortcut: Shortcut) => {
    if (!selectedList) return;

    const updatedShortcuts = editingShortcut
      ? selectedList.shortcuts.map(s => s.id === shortcut.id ? shortcut : s)
      : [...selectedList.shortcuts, shortcut];

    const updatedList: ShortcutList = {
      ...selectedList,
      shortcuts: updatedShortcuts,
      updated_at: new Date().toISOString(),
    };

    await saveList(updatedList);
  };

  const handleDeleteShortcut = async (shortcutId: string) => {
    if (!selectedList) return;

    const updatedShortcuts = selectedList.shortcuts.filter(s => s.id !== shortcutId);

    const updatedList: ShortcutList = {
      ...selectedList,
      shortcuts: updatedShortcuts,
      updated_at: new Date().toISOString(),
    };

    await saveList(updatedList);
  };

  const handleCreateList = async (name: string) => {
  const currentActiveApp = detectedActiveApp || activeApp;
  if (!currentActiveApp) return;

  let appForList = applications.find(app => {
    const matchKey = app.detection_name || app.process_name;
    return matchKey === currentActiveApp;
  });

  if (!appForList) {
    const newApp: Application = {
      id: uuidv4(),
      name: currentActiveApp,
      process_name: currentActiveApp,
      detection_name: currentActiveApp,
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
  setSelectedList(newList);
};

  const handleDeleteCurrentList = async () => {
    if (!selectedList) return;
    await deleteList(selectedList.id);
    setSelectedList(null);
  };

  const handleRenameList = async (name: string) => {
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

  const currentActiveApp = detectedActiveApp || activeApp;

  const hasListForCurrentApp = shortcutLists.some((list) => {
    const app = applications.find((a) => a.id === list.application_id);
    if (!app) return false;
    const matchKey = app.detection_name || app.process_name;
    return matchKey === currentActiveApp;
  });

  const defaultNewListName = (() => {
    if (!currentActiveApp) return 'New list';
    const appForList = applications.find((app) => {
      const matchKey = app.detection_name || app.process_name;
      return matchKey === currentActiveApp;
    });
    if (appForList?.name) {
      return `${appForList.name} shortcuts`;
    }
    return `${currentActiveApp} shortcuts`;
  })();

  const nextOrder = selectedList ? selectedList.shortcuts.length : 0;

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
          value={selectedList?.id || ''}
          onChange={(e) => {
            const list = shortcutLists.find(l => l.id === e.target.value);
            setSelectedList(list || null);
          }}
        >
          {(shortcutLists.length === 0 || !hasListForCurrentApp) && <option value="">No lists available</option>}
          {shortcutLists.map(list => {
            const app = applications.find(a => a.id === list.application_id);
            return (
              <option key={list.id} value={list.id}>
                {app?.name || 'Unknown'} - {list.name}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          onClick={() => {
            console.log("Edit button clicked");
            setIsListModalOpen(true);
          }}
          className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
          title={selectedList ? 'Edit list' : 'Create list'}
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
        {selectedList && selectedList.shortcuts.length > 0 ? (
          <div className="">
            {selectedList.shortcuts
              .sort((a, b) => a.order - b.order)
              .map((shortcut, index) => (
                <div
                  key={shortcut.id}
                  onClick={() => handleEditShortcut(shortcut)}
                  className={`bg-gray-${index % 2 === 0 ? '7' : '8'}00 px-1 hover:bg-gray-600 transition-colors cursor-pointer`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 rounded text-base font-mono text-right">
                      {shortcut.key_combo.split(',').map((part, idx, arr) => (
                        <span key={idx} className="whitespace-nowrap">
                          {part.trim()}
                          {idx < arr.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </kbd>
                  </div>
                </div>
              ))}
          </div>
        ) : selectedList ? (
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
        Active: {detectedActiveApp || activeApp || 'Unknown'}
      </div>

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
        selectedList={selectedList}
        onClose={() => setIsListModalOpen(false)}
        onCreate={handleCreateList}
        onRename={handleRenameList}
        onDelete={handleDeleteCurrentList}
        dumpApps={dumpApps}
      />
    </div>
  );
}