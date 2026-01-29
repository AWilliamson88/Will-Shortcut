import { useState, useRef, useEffect } from 'react';

interface KeyCaptureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function KeyCaptureInput({ value, onChange, placeholder }: KeyCaptureInputProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCapturing) {
      setCurrentKeys('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keys: string[] = [];

      // Add modifiers
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Win');

      // Add the main key (ignore modifier keys themselves)
      const mainKey = e.key;

      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(mainKey)) {
        // Capitalize single letters
        if (mainKey.length === 1) {
          keys.push(mainKey.toUpperCase());
        } else {
          // Handle special keys
          const specialKeyMap: { [key: string]: string } = {
            ' ': 'Space',
            'Enter': 'Enter',
            'Escape': 'Esc',
            'Backspace': 'Backspace',
            'Delete': 'Delete',
            'Tab': 'Tab',
            'ArrowUp': 'Up',
            'ArrowDown': 'Down',
            'ArrowLeft': 'Left',
            'ArrowRight': 'Right',
            '`': '`',
            '-': '-',
            '=': '=',
            '[': '[',
            ']': ']',
            '\\': '\\',
            ';': ';',
            "'": "'",
            ',': ',',
            '.': '.',
            '/': '/',
          };

          keys.push(specialKeyMap[mainKey] || mainKey);
        }
      }

      // Update the display in real-time
      const combo = keys.join('+');
      setCurrentKeys(combo);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // When user releases keys, save the combination immediately
      if (currentKeys) {
        onChange(currentKeys);
        setIsCapturing(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapturing, currentKeys, onChange]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={isCapturing ? currentKeys : value}
        onChange={(e) => {
          if (!isCapturing) {
            onChange(e.target.value);
          }
        }}
        onFocus={() => setIsCapturing(true)}
        onBlur={() => setIsCapturing(false)}
        placeholder={placeholder || "Click to capture or type manually"}
        className={`w-full bg-gray-900 text-white px-3 py-2 rounded border ${
          isCapturing ? 'border-blue-500' : 'border-gray-700'
        } focus:outline-none cursor-text`}
      />
      {isCapturing && !currentKeys && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded pointer-events-none">
          <span className="text-sm text-blue-400">Press any key combination...</span>
        </div>
      )}
    </div>
  );
}