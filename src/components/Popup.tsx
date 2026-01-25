import { useState, useEffect } from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import { ShortcutList } from '../types';
import { Keyboard, Settings as SettingsIcon } from 'lucide-react';

export function Popup() {
  const { lists, applications, activeApp, loading, error } = useShortcuts();
  const [selectedList, setSelectedList] = useState<ShortcutList | null>(null);

  // Auto-select the first list when data loads
  useEffect(() => {
    if (lists.length > 0 && !selectedList) {
      // Try to find a list for the active app
      const activeAppLists = lists.filter(list => {
        const app = applications.find(a => a.id === list.application_id);
        return app?.process_name === activeApp;
      });

      if (activeAppLists.length > 0) {
        setSelectedList(activeAppLists[0]);
      } else {
        setSelectedList(lists[0]);
      }
    }
  }, [lists, applications, activeApp, selectedList]);

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

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Shortcuts</h1>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Dropdown */}
      <div className="p-4 border-b border-gray-700">
        <select
          className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          value={selectedList?.id || ''}
          onChange={(e) => {
            const list = lists.find(l => l.id === e.target.value);
            setSelectedList(list || null);
          }}
        >
          {lists.length === 0 && (
            <option value="">No lists available</option>
          )}
          {lists.map(list => {
            const app = applications.find(a => a.id === list.application_id);
            return (
              <option key={list.id} value={list.id}>
                {app?.name || 'Unknown'} - {list.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Shortcuts List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedList && selectedList.shortcuts.length > 0 ? (
          <div className="space-y-2">
            {selectedList.shortcuts
              .sort((a, b) => a.order - b.order)
              .map(shortcut => (
                <div
                  key={shortcut.id}
                  className="bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-blue-400">
                      {shortcut.key_combo}
                    </kbd>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <Keyboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No shortcuts available</p>
            <p className="text-sm mt-2">Create a new list to get started</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-500 text-center">
        Active: {activeApp || 'Unknown'}
      </div>
    </div>
  );
}