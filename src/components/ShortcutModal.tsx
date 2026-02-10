import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Shortcut } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { KeyCaptureInput } from './KeyCaptureInput';
import { ConfirmModal } from './ConfirmModal';

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: Shortcut) => void;
  shortcut?: Shortcut; // If provided, we're editing; otherwise, creating new
  nextOrder: number; // The order number for a new shortcut
	  onDelete?: (shortcutId: string) => void; // Optional delete handler when editing
}

	export function ShortcutModal({ isOpen, onClose, onSave, shortcut, nextOrder, onDelete }: ShortcutModalProps) {
	const [keyCombo, setKeyCombo] = useState('');
	const [description, setDescription] = useState('');
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	
	const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (shortcut) {
      setKeyCombo(shortcut.key_combo);
      setDescription(shortcut.description);
    } else {
      setKeyCombo('');
      setDescription('');
    }
  }, [shortcut, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyCombo.trim() || !description.trim()) {
      return;
    }

    const newShortcut: Shortcut = {
      id: shortcut?.id || uuidv4(),
      key_combo: keyCombo.trim(),
      description: description.trim(),
      order: shortcut?.order ?? nextOrder,
    };

    onSave(newShortcut);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-80 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {shortcut ? 'Edit Shortcut' : 'Add Shortcut'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Key Combination */}
            <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                Key Combination
            </label>
            <KeyCaptureInput
                value={keyCombo}
                onChange={setKeyCombo}
                placeholder="Click and press keys..."
                onRequestNextField={() => {
                  descriptionInputRef.current?.focus();
                }}
            />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <input
                ref={descriptionInputRef}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Open Command Palette"
                className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
	
	          {/* Buttons */}
	          {shortcut ? (
	            <div className="flex gap-2 mt-6">
	              <button
	                type="button"
	                onClick={onClose}
	                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
	              >
	                Cancel
	              </button>
	              {onDelete && (
	                <button
	                  type="button"
	                  onClick={() => setIsConfirmOpen(true)}
	                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
	                >
	                  Delete
	                </button>
	              )}
	              <button
	                type="submit"
	                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
	              >
	                Save
	              </button>
	            </div>
	          ) : (
	            <div className="flex gap-2 mt-6">
	              <button
	                type="button"
	                onClick={onClose}
	                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
	              >
	                Cancel
	              </button>
	              <button
	                type="submit"
	                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
	              >
	                Add
	              </button>
	            </div>
	          )}
        </form>
      </div>

	      {/* Confirm Delete Modal (only when editing) */}
	      {shortcut && onDelete && (
	        <ConfirmModal
	          isOpen={isConfirmOpen}
	          onClose={() => setIsConfirmOpen(false)}
	          onConfirm={() => {
	            onDelete(shortcut.id);
	            onClose();
	          }}
	          title="Delete Shortcut"
	          message="Are you sure you want to delete this shortcut? This action cannot be undone."
	        />
	      )}
    </div>
  );
}