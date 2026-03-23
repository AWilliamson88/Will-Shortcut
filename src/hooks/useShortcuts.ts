import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen, emit } from '@tauri-apps/api/event';
import { ShortcutList, Application, Settings } from '../types';
import { enable, disable } from '@tauri-apps/plugin-autostart';

export function useShortcuts() {
	  const [shortcutLists, setShortcutLists] = useState<ShortcutList[]>([]);
	  const [applications, setApplications] = useState<Application[]>([]);
	  const [settings, setSettings] = useState<Settings | null>(null);
	  const [activeApp, setActiveApp] = useState<Application | null>(null);
	  const [loading, setLoading] = useState(true);
	  const [error, setError] = useState<string | null>(null);

	  // For debounced, list saving (should be used for quick reorders only)
	  const pendingSaveTimeoutRef = useRef<number | null>(null);
	  const pendingSaveListRef = useRef<ShortcutList | null>(null);

	  // Load all data on mount
	  useEffect(() => {
	    loadData();
	  }, []);

	  // Reload data whenever another window reports that shared data was updated.
	  // This keeps multiple Tauri windows (popup, settings) in sync without
	  // requiring a full app restart.
	  useEffect(() => {
	    const unlistenApplicationsPromise = listen('applications-updated', () => {
	      loadData();
	    });

	    const unlistenSettingsPromise = listen('settings-updated', () => {
	      loadData();
	    });

	    return () => {
	      unlistenApplicationsPromise.then((unlisten) => unlisten());
	      unlistenSettingsPromise.then((unlisten) => unlisten());
	    };
	  }, []);

	  const loadData = async () => {
	    try {
	      setLoading(true);
	      
	      // Initialize defaults if no data exists
	      await invoke('initialize_defaults');
	
	      const [
	        listsData,
	        appsData,
	        settingsData,
	        activeAppData,
	        _activeWindowTitle,
	      ] = await Promise.all([
	        invoke<ShortcutList[]>('get_all_lists'),
	        invoke<Application[]>('get_all_applications'),
	        invoke<Settings>('get_settings'),
	        invoke<string>('get_active_application'),
	        invoke<string>('get_active_window_title'),
	      ]);
	
	      setShortcutLists(listsData);
	      setApplications(appsData);
	      setSettings(settingsData);

      // Throws "os error 2" in dev mode so skip it.
      if (!import.meta.env.DEV) {
        try {
          if (settingsData.run_on_startup) {
            await enable();
          } else {
            await disable();
          }
        } catch (e) {
          console.error('Failed to sync autostart on load:', e);
        }
      }
      setActiveApp(appsData.find(app => app.detection_name === activeAppData) || null);
      setError(null);
    } catch (err) {
      setError(err as string);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

	  const saveList = async (list: ShortcutList) => {
	    try {
	      await invoke('save_list', { list });
	      await loadData(); // Reload to get updated data
	    } catch (err) {
	      setError(err as string);
	      console.error('Failed to save list:', err);
	    }
	  };

	  // Debounced save used for in-place reorders.
	  // Updates local state immediately and batches writes to the backend.
	  const saveListWithDebounce = (list: ShortcutList) => {
	    // Update local shortcut lists immediately so UI reflects the change.
	    setShortcutLists((prev) => {
	      const idx = prev.findIndex((l) => l.id === list.id);
	      if (idx === -1) return prev;
	      const next = [...prev];
	      next[idx] = list;
	      return next;
	    });

	    // Keep the changed list.
	    pendingSaveListRef.current = list;

	    // Debounce the actual save to avoid spamming the backend.
	    if (pendingSaveTimeoutRef.current !== null) {
	      window.clearTimeout(pendingSaveTimeoutRef.current);
	    }

	    pendingSaveTimeoutRef.current = window.setTimeout(async () => {
	      const latest = pendingSaveListRef.current;
	      if (!latest) return;
	      try {
	        await invoke('save_list', { list: latest });
	      } catch (err) {
	        setError(err as string);
	        console.error('Failed to save list (using debounce):', err);
	      } finally {
	        pendingSaveTimeoutRef.current = null;
	      }
	    }, 250);
	  };

	  // Clear any pending timeout on unmount
	  useEffect(() => {
	    return () => {
	      if (pendingSaveTimeoutRef.current !== null) {
	        window.clearTimeout(pendingSaveTimeoutRef.current);
	      }
	    };
	  }, []);

  const deleteList = async (listId: string) => {
    try {
      await invoke('delete_list', { listId });
      await loadData();
    } catch (err) {
      setError(err as string);
      console.error('Failed to delete list:', err);
    }
  };

	  const saveApplication = async (app: Application) => {
	    try {
	      await invoke('save_application', { app });
	      await loadData();
	      try {
	        await emit('applications-updated');
	      } catch (eventError) {
	        console.error('Failed to emit applications-updated event:', eventError);
	      }
	    } catch (err) {
	      setError(err as string);
	      console.error('Failed to save application:', err);
	    }
	  };

	  const saveSettings = async (newSettings: Settings) => {
	    try {
	      await invoke('save_settings', { settings: newSettings });
	      await invoke('refresh_global_hotkey');
	      setSettings(newSettings);
	
	      try {
	        await emit('settings-updated');
	      } catch (eventError) {
	        console.error('Failed to emit settings-updated event:', eventError);
	      }
	
	      // Throws "os error 2" in dev mode so skip it.
	      if (!import.meta.env.DEV) {
	        try {
	          if (newSettings.run_on_startup) {
	            await enable();
	          } else {
	            await disable();
	          }
	        } catch (e) {
	          console.error('Failed to update autostart:', e);
	        }
	      }
	    } catch (err) {
	      setError(err as string);
	      console.error('Failed to save settings:', err);
	    }
	  };

  const refreshActiveApp = async () => {
    try {
      const activeApp = await invoke<string>('get_active_application');
      setActiveApp(applications.find(app => app.detection_name === activeApp) || null);
    } catch (err) {
      console.error('Failed to get active app:', err);
    }
  };

  const getActiveAppTitle = async () => {
    try {
      const app = await invoke<string>('get_active_window_title');
      return app;
    } catch (err) {
      console.error('Failed to get active app:', err);
    }
  };

  const dumpApps = async () => {
    const apps = await invoke('debug_dump_applications');
    console.log('Merged apps from Rust:', apps);
  };

  return {
    shortcutLists,
    applications,
    settings,
    activeApp,
    loading,
    error,
    saveList,
	saveListWithDebounce,
    deleteList,
    saveApplication,
    saveSettings,
    refreshActiveApp,
    reload: loadData,
    dumpApps,
    getActiveAppTitle,
  };
}