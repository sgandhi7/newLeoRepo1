import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TextProps {
  text: string;
}

const HighlightText: React.FC<TextProps> = ({ text }) => {
  const parts = text.split(/\*\*(.+?)\*\*/g);

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
