import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useShortcuts } from '../hooks/useShortcuts';
import { ShortcutList, Shortcut } from '../types';
import { Keyboard, Settings as SettingsIcon, Plus, Edit2 } from 'lucide-react';
import { ShortcutModal } from './ShortcutModal';
import { v4 as uuidv4 } from 'uuid';
import { ListManageModal } from './ListManageModal';
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { PhysicalPosition } from "@tauri-apps/api/dpi";

export function Popup() {
	  const { lists, applications, activeApp, loading, error, saveList, deleteList, dumpApps, settings, saveSettings } = useShortcuts();
	  const [selectedList, setSelectedList] = useState<ShortcutList | null>(null);
	  const [isModalOpen, setIsModalOpen] = useState(false);
	  const [editingShortcut, setEditingShortcut] = useState<Shortcut | undefined>(undefined);
	  const [detectedActiveApp, setDetectedActiveApp] = useState<string>('');
	  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Listen for active app detection event
  useEffect(() => {
    const unlisten = listen<string>('active-app-detected', (event) => {
      setDetectedActiveApp(event.payload);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  // Auto-select the first list when data loads
  useEffect(() => {
    if (lists.length > 0 && !selectedList) {
      // Try to find a list for the active app (use detected app if available)
      const currentActiveApp = detectedActiveApp || activeApp;
      const activeAppLists = lists.filter(list => {
        const app = applications.find(a => a.id === list.application_id);
        return app?.process_name === currentActiveApp;
      });

      if (activeAppLists.length > 0) {
        setSelectedList(activeAppLists[0]);
      } else {
        setSelectedList(lists[0]);
      }
    }
  }, [lists, applications, activeApp, detectedActiveApp, selectedList]);

  // Update selectedList when lists change
  useEffect(() => {
    if (selectedList) {
      const updatedList = lists.find(l => l.id === selectedList.id);
      if (updatedList) {
        setSelectedList(updatedList);
      }
    }
  }, [lists]);

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

  
  const openSettingsWindow = async () => {
    const w = await WebviewWindow.getByLabel("settings");
    if (!w) { console.error("Settings window not found"); return; }
    const monitor = await currentMonitor();
    if (monitor) { const { width, height } = await w.outerSize();
      const x = monitor.position.x + Math.round((monitor.size.width - width) / 2);
      const y = monitor.position.y + Math.round((monitor.size.height - height) / 2);
      await w.setPosition(new PhysicalPosition(x, y)); }
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
    if (applications.length === 0) return;

    const currentActiveApp = detectedActiveApp || activeApp;

    // Try to bind the new list to the active app; fall back to first app
    const appForList =
      applications.find(app => app.process_name === currentActiveApp) ??
      applications[0];

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
                    focus:outline-none focus:border-blue-500"
          value={selectedList?.id || ''}
          onChange={(e) => {
            const list = lists.find(l => l.id === e.target.value);
            setSelectedList(list || null);
          }}
        >
          {lists.length === 0 && <option value="">No lists available</option>}
          {lists.map(list => {
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
            <p className="text-sm mt-2">Click "Add Shortcut" to get started</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <Keyboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No lists available</p>
            <p className="text-sm mt-2">Create a new list to get started</p>
          </div>
        )}
      </div>

      {/* Add Shortcut Button */}
      {selectedList && (
        <div className="px-4 py-3">
          <button
            onClick={handleAddShortcut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Shortcut
          </button>
        </div>
      )}

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