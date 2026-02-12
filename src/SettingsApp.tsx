import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useShortcuts } from "./hooks/useShortcuts"; 
import { SettingsModal } from "./components/SettingsModal";

export function SettingsApp() {
  const { settings, saveSettings, loading, error } = useShortcuts();
  if (loading || !settings) return <div className="p-4 text-white">Loading settings...</div>;
  if (error) return <div className="p-4 text-red-400">Error: {String(error)}</div>;
  return (
    <SettingsModal
      isOpen={true}
      settings={settings}
      onClose={() => getCurrentWebviewWindow().close()}
      onSave={async s => { await saveSettings(s); getCurrentWebviewWindow().close(); }}
    />
  );
}