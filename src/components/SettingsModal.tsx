import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Settings } from '../types';
import { KeyCaptureInput } from './KeyCaptureInput';

interface SettingsModalProps {
  isOpen: boolean;
  settings: Settings | null;
  onClose: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
}

export function SettingsModal({ isOpen, settings, onClose, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings);
  const [windowPosition, setWindowPosition] = useState<string>("BottomRight");

  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings(settings);
      setWindowPosition(settings.window_position ?? "BottomRight");
    }
  }, [isOpen, settings]);

  if (!isOpen || !localSettings) return null;

  const handleWindowPositionChange = (pos: string) => {
    setWindowPosition(pos);
    setLocalSettings(prev =>
      prev ? { ...prev, window_position: pos } : prev
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;
    await onSave(localSettings);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 items-center justify-center z-50 border border-gray-700">
      <div className='flex flex-col p-4'>
        {/* Header */}
        <div data-tauri-drag-region className="flex justify-between mb-6">
          <h2 className="text-3xl font-semibold text-white">Settings</h2>
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
              disableToggle={true}
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Changes to the global hotkey take effect the next time you restart the app.
            </p>
          </div>

          {/* Window position */}
          <div className='flex flex-col gap-4'>
            <label className="block text-xs text-gray-300">Popup position</label>
              <div className="bg-neutral-900 h-40 w-40 p-2">
                <div className="h-full w-full bg-neutral-800 p-1">

                <div className="grid grid-cols-2 gap-x-16 gap-y-5 h-full ">

                    <button
                      key={"TopLeft"}
                      type="button"
                      onClick={() => handleWindowPositionChange("TopLeft")}
                      className={windowPosition == "TopLeft" ? `bg-gray-900 border border-neutral-700` : `bg-neutral-900`}
                      >
                    </button>
                    <button
                      key={"TopRight"}
                      type="button"
                      onClick={() => handleWindowPositionChange("TopRight")}
                      className={windowPosition == "TopRight" ? `bg-gray-900 border border-neutral-700` : `bg-neutral-900`}
                      >
                    </button>
                    <button
                      key={"BottomLeft"}
                      type="button"
                      onClick={() => handleWindowPositionChange("BottomLeft")}
                      className={windowPosition == "BottomLeft" ? `bg-gray-900 border border-neutral-700` : `bg-neutral-900`}
                      >
                    </button>
                    <button
                      key={"BottomRight"}
                      type="button"
                      onClick={() => handleWindowPositionChange("BottomRight")}
                      className={windowPosition == "BottomRight" ? `bg-gray-900 border border-neutral-700` : `bg-neutral-900`}
                      >
                    </button>
                      </div>
                  </div>
              </div>
          </div>

          {/* <div className="grid h-56 grid-cols-3 content-between gap-4 ...">
            <div>01</div>
            <div>02</div>
            <div>03</div>
            <div>04</div>
            <div>05</div>
          </div> */}

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
