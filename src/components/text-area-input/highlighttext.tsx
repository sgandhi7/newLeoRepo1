import React, { useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TextProps {
  text: string;
  onPartComplete: () => void;
}

const HighlightText: React.FC<TextProps> = ({ text, onPartComplete }) => {
  const parts = text.split(/\*\*(.+?)\*\*/g);

  useEffect(() => {
    // Calculate total typing time
    const totalTypingTime = text.length * (1000 / 99); // 99 is the typing speed

    // Set a timeout to call onPartComplete after typing is done
    const timeout = setTimeout(() => {
      onPartComplete();
    }, totalTypingTime);

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, [text, onPartComplete]);

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a matched part with **, remove ** from each side and render in bold
          return <strong key={index}>{part}</strong>;
        } else {
          return (
            <span key={index}>
              <TypeAnimation
                sequence={[part]} // Type current sentence or empty string
                speed={99} // Typing speed for individual characters
                cursor={false} // Hide cursor if desired
              />
            </span>
          );
        }
      })}
    </>
  );
};

export default HighlightText;
