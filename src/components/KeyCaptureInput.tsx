interface KeyCaptureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function KeyCaptureInput({ value, onChange, placeholder }: KeyCaptureInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "e.g., Ctrl+K, Ctrl+D"}
      className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
    />
  );
}