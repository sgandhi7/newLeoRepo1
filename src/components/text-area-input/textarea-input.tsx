import { Label, TextArea } from '@metrostar/comet-uswds';
import React, { ChangeEvent, KeyboardEvent } from 'react';
interface TextAreaProps {
  id: string;
  label?: string;
  name?: string;
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const TextAreaInput: React.FC<TextAreaProps> = ({
  id,
  label,
  name,
  value,
  className,
  placeholder,
  onChange,
  onKeyDown,
  onKeyUp,
  rows = 1,
  cols = 1,
  autoFocus = true,
  disabled = false,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event);
    const textarea = document.querySelector('textarea');
    // Set the height of the textarea to its scrollHeight
    textarea?.style.setProperty('height', 'auto'); // Reset the height to auto to prevent scrollHeight limitation
    textarea?.style.setProperty('height', `${textarea?.scrollHeight}px`);
  };

  return (
    <>
      <div className="text-container">
        <Label htmlFor={id}>{label}</Label>
        <TextArea
          id={id}
          className={className}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          disabled={disabled}
          autoFocus={autoFocus}
          style={{
            minHeight: `${rows * 3.5}rem`,
            maxHeight: `${rows * 20}rem`,
            borderRadius: '10px',
            margin: '1rem',
            padding: '1rem',
          }}
        />
      </div>
    </>
  );
};
