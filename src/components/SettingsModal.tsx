import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Settings, WindowPosition } from '../types';
import { KeyCaptureInput } from './KeyCaptureInput';

interface SettingsModalProps {
  isOpen: boolean;
  settings: Settings | null;
  onClose: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
}

export function SettingsModal({ isOpen, settings, onClose, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings);

  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen || !localSettings) return null;

  const updateWindowPosition = (updates: Partial<WindowPosition>) => {
    setLocalSettings((prev) =>
      prev
        ? {
            ...prev,
            window_position: {
              ...prev.window_position,
              ...updates,
            },
          }
        : prev
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;
    await onSave(localSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Global hotkey */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">Global hotkey</label>
            <KeyCaptureInput
              value={localSettings.global_hotkey}
              onChange={(value) =>
                setLocalSettings((prev) => (prev ? { ...prev, global_hotkey: value } : prev))
              }
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Changes to the global hotkey take effect the next time you restart the app.
            </p>
          </div>

          {/* Window position */}
          <div>
            <label className="block text-xs text-gray-300 mb-2">Popup position</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="text-[11px] text-gray-400 mb-1">Horizontal</div>
                <div className="flex gap-2">
                  {['Left', 'Right'].map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => {}}
                      className={`flex-1 px-2 py-1 rounded text-xs border transition-colors `}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-400 mb-1">Vertical</div>
                <div className="flex gap-2">
                  {['Top', 'Bottom'].map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => {}}
                      className={`flex-1 px-2 py-1 rounded text-xs border transition-colors `}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
