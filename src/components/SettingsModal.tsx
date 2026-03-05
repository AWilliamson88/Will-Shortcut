import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Settings, Application } from '../types';
import { KeyCaptureInput } from './KeyCaptureInput';

interface SettingsModalProps {
  isOpen: boolean;
  settings: Settings | null;
  applications: Application[];
  onClose: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
  onSaveApplication: (app: Application) => Promise<void> | void;
}

export function SettingsModal({
  isOpen,
  settings,
  applications,
  onClose,
  onSave,
  onSaveApplication,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings);
  const [windowPosition, setWindowPosition] = useState<string>('BottomRight');
  const [localApplications, setLocalApplications] = useState<Application[]>(applications);
  const [activeTab, setActiveTab] = useState<'general' | 'applications'>('general');

  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings(settings);
      setWindowPosition(settings.window_position ?? 'BottomRight');
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (isOpen) {
      setLocalApplications(applications);
    }
  }, [isOpen, applications]);

  if (!isOpen || !localSettings) return null;

  const handleWindowPositionChange = (pos: string) => {
    setWindowPosition(pos);
    setLocalSettings(prev => (prev ? { ...prev, window_position: pos } : prev));
  };

  const handleAppNameChange = (id: string, name: string) => {
    setLocalApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, name } : app)),
    );
  };

  const handleAppIconChange = (id: string, icon: string) => {
    setLocalApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, icon: icon || undefined } : app)),
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;

    // Persist any application changes (name/icon)
    const changedApps = localApplications.filter(local => {
      const original = applications.find(app => app.id === local.id);
      if (!original) return true;
      return (
        original.name !== local.name || (original.icon ?? '') !== (local.icon ?? '')
      );
    });

    for (const app of changedApps) {
      await onSaveApplication(app);
    }

    await onSave(localSettings);
  };

	return (
	  <div className="fixed inset-0 bg-gray-800 items-center justify-center z-50 border border-gray-700">
	    <div className="flex flex-col p-4 h-full">
	      {/* Header */}
	      <div data-tauri-drag-region className="flex justify-between mb-4">
	        <h2 className="text-3xl font-semibold text-white">Settings</h2>
	        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
	          <X className="w-4 h-4 text-gray-400" />
	        </button>
	      </div>

	      {/* Tabs */}
	      <div className="mb-2 border-b border-gray-700">
	        <nav className="flex gap-2 text-sm">
	          <button
	            type="button"
	            onClick={() => setActiveTab('general')}
	            className={`px-3 py-1 rounded-t ${
	              activeTab === 'general'
	                ? 'bg-gray-900 text-white border border-b-transparent border-gray-700'
	                : 'text-gray-400 hover:text-white'
	            }`}
	          >
	            General
	          </button>
	          <button
	            type="button"
	            onClick={() => setActiveTab('applications')}
	            className={`px-3 py-1 rounded-t ${
	              activeTab === 'applications'
	                ? 'bg-gray-900 text-white border border-b-transparent border-gray-700'
	                : 'text-gray-400 hover:text-white'
	            }`}
	          >
	            Applications
	          </button>
	        </nav>
	      </div>

	      <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
	        <div className="flex-1 overflow-y-auto space-y-4 px-2">
	          {activeTab === 'general' && (
	            <>
	              {/* Global hotkey */}
	              <div>
	                <label className="block text-xs text-gray-300 mb-1">Global hotkey</label>
	                <KeyCaptureInput
	                  value={localSettings.global_hotkey}
	                  onChange={value =>
	                    setLocalSettings(prev =>
	                      prev ? { ...prev, global_hotkey: value } : prev,
	                    )
	                  }
	                  disableToggle={true}
	                />
	                <p className="mt-1 text-[11px] text-gray-400">
	                  Changes to the global hotkey take effect the next time you restart the
	                  app.
	                </p>
	              </div>

	              {/* Window position */}
	              <div className="flex flex-col">
	                <label className="block text-xs text-gray-300 mb-1">Popup position</label>
	                <div className="bg-neutral-900 h-40 w-40 p-2">
	                  <div className="h-full w-full bg-neutral-800 p-1">
	                    <div className="grid grid-cols-2 gap-x-16 gap-y-5 h-full ">
	                      <button
	                        key={'TopLeft'}
	                        type="button"
	                        onClick={() => handleWindowPositionChange('TopLeft')}
	                        className={
	                          windowPosition == 'TopLeft'
	                            ? 'bg-gray-900 border border-neutral-700'
	                            : 'bg-neutral-900'
	                        }
	                      ></button>
	                      <button
	                        key={'TopRight'}
	                        type="button"
	                        onClick={() => handleWindowPositionChange('TopRight')}
	                        className={
	                          windowPosition == 'TopRight'
	                            ? 'bg-gray-900 border border-neutral-700'
	                            : 'bg-neutral-900'
	                        }
	                      ></button>
	                      <button
	                        key={'BottomLeft'}
	                        type="button"
	                        onClick={() => handleWindowPositionChange('BottomLeft')}
	                        className={
	                          windowPosition == 'BottomLeft'
	                            ? 'bg-gray-900 border border-neutral-700'
	                            : 'bg-neutral-900'
	                        }
	                      ></button>
	                      <button
	                        key={'BottomRight'}
	                        type="button"
	                        onClick={() => handleWindowPositionChange('BottomRight')}
	                        className={
	                          windowPosition == 'BottomRight'
	                            ? 'bg-gray-900 border border-neutral-700'
	                            : 'bg-neutral-900'
	                        }
	                      ></button>
	                    </div>
	                  </div>
	                </div>
	              </div>

	              <div className="flex items-center justify-between">
	                <label className="text-xs text-gray-300">
	                  Run on system startup
	                </label>
	                <input
	                  type="checkbox"
	                  checked={localSettings.run_on_startup}
	                  onChange={e =>
	                    setLocalSettings(prev =>
	                      prev
	                        ? { ...prev, run_on_startup: e.target.checked }
	                        : prev,
	                    )
	                  }
	                />
	              </div>
	            </>
	          )}

	          {activeTab === 'applications' && (
	            <div className="space-y-2">
	              <p className="text-xs text-gray-400">
	                Edit the display name and icon for each detected application.
	              </p>
	              <div className="border border-gray-700 rounded max-h-64 overflow-y-auto">
	                <table className="w-full text-xs">
	                  <thead className="bg-gray-900 sticky top-0">
	                    <tr>
	                      <th className="px-2 py-1 text-left text-gray-300 font-medium">
	                        Detection name
	                      </th>
	                      <th className="px-2 py-1 text-left text-gray-300 font-medium">
	                        Process name
	                      </th>
	                      <th className="px-2 py-1 text-left text-gray-300 font-medium">
	                        Name
	                      </th>
	                      <th className="px-2 py-1 text-left text-gray-300 font-medium">
	                        Icon
	                      </th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    {localApplications.map(app => (
	                      <tr key={app.id} className="border-t border-gray-800">
	                        <td className="px-2 py-1 text-gray-300">
	                          {app.detection_name}
	                        </td>
	                        <td className="px-2 py-1 text-gray-400">
	                          {app.process_name}
	                        </td>
	                        <td className="px-2 py-1">
	                          <input
	                            className="w-full bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-blue-500 text-xs"
	                            value={app.name}
	                            onChange={e =>
	                              handleAppNameChange(app.id, e.target.value)
	                            }
	                          />
	                        </td>
							<td className="px-2 py-1">
							  <input
									className="w-full bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-blue-500 text-xs"
									value={app.icon ?? ''}
									onChange={e =>
									  handleAppIconChange(app.id, e.target.value)
									}
									placeholder="e.g. 🔧 or icon path"
								  />
							</td>
	                      </tr>
	                    ))}
	                  </tbody>
	                </table>
	              </div>
	            </div>
	          )}
	        </div>

	        {/* Actions */}
	        <div className="flex justify-end gap-2 pt-3 border-t border-gray-700 mt-3">
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
