import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ShortcutList, Application, Settings } from '../types';

export function useShortcuts() {
  const [lists, setLists] = useState<ShortcutList[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeApp, setActiveApp] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Initialize defaults if no data exists
      await invoke('initialize_defaults');

      const [listsData, appsData, settingsData, activeAppData] = await Promise.all([
        invoke<ShortcutList[]>('get_all_lists'),
        invoke<Application[]>('get_all_applications'),
        invoke<Settings>('get_settings'),
        invoke<string>('get_active_application'),
      ]);

      setLists(listsData);
      setApplications(appsData);
      setSettings(settingsData);
      setActiveApp(activeAppData);
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
    } catch (err) {
      setError(err as string);
      console.error('Failed to save application:', err);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await invoke('save_settings', { settings: newSettings });
      setSettings(newSettings);
    } catch (err) {
      setError(err as string);
      console.error('Failed to save settings:', err);
    }
  };

  const refreshActiveApp = async () => {
    try {
      const app = await invoke<string>('get_active_application');
      setActiveApp(app);
    } catch (err) {
      console.error('Failed to get active app:', err);
    }
  };

  return {
    lists,
    applications,
    settings,
    activeApp,
    loading,
    error,
    saveList,
    deleteList,
    saveApplication,
    saveSettings,
    refreshActiveApp,
    reload: loadData,
  };
}