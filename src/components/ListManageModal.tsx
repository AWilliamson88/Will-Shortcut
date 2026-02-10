import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { ShortcutList } from '../types';

interface ListManageModalProps {
  isOpen: boolean;
  selectedList: ShortcutList | null;
  onClose: () => void;
  onCreate: (name: string) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  dumpApps: () => void; // Debugging
}

export function ListManageModal(props: ListManageModalProps) {
  const { isOpen, selectedList, onClose, onCreate, onRename, onDelete, dumpApps } = props;
  const [mode, setMode] = useState<'edit' | 'create'>('create');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (selectedList) {
      setMode('edit');
      setName(selectedList.name);
    } else {
      setMode('create');
      setName('');
    }
  }, [isOpen, selectedList]);

  const handlePrimary = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (mode === 'edit' && selectedList) onRename(trimmed);
    else onCreate(trimmed);
    onClose();
  };

  const handleDelete = () => {
    if (!selectedList) return;
    onDelete();
    onClose();
  };

  const switchToCreate = () => {
    setMode('create');
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-4 w-72 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-sm font-semibold text-white"
            onClick={dumpApps}
          >
            {mode === 'edit' ? 'Edit List' : 'Create List'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

                <form onSubmit={handlePrimary} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">List name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-1.5 rounded border border-gray-700
                         focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={switchToCreate}
              className="text-xs text-blue-400 hover:underline"
            >
              Create new list instead
            </button>
          )}
                    <div className="flex gap-2 pt-2">
            {mode === 'edit' && selectedList && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded
                           hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              {mode === 'edit' ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}