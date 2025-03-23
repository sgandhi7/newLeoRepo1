import { useEffect, useState } from 'react';
import HighlightText from './highlighttext';

const Typewriter = ({
  sentence,
  delay,
  index,
  length,
  sources,
  onPartComplete,
}: {
  sentence: string; // Sentence to type
  delay: number; // Typing speed in milliseconds
  index: number;
  length: number;
  sources: Array<[string, string]>;
  onPartComplete: () => void;
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasDocX, setHasDocX] = useState(false);
  useEffect(() => {
    const hasDoc = /\[doc\d+\]/.test(sentence);
    if (hasDoc) {
      setHasDocX(true);
    } else {
      setHasDocX(false);
    }
    const timeout = setTimeout(() => {
      setShouldRender(true); // Set shouldRender to true after the delay
    }, delay * index); // Increase delay between sentences

    return () => clearTimeout(timeout); // Clean up timeout on unmount or when dependencies change
  }, [sentence, delay, index]); // Include relevant dependencies

  // Function to extract the value of X from [docX]
  const extractDocXValue = (str: string) => {
    const match = /\[doc(\d+)\]/.exec(str);
    return match ? match[1] : null; // Extract the captured group
  };

  return (
    shouldRender && (
      <span key={index}>
        {hasDocX && (
          <span>
            <HighlightText
              text={sentence.replace(/\[doc\d+\]/g, '')}
              onPartComplete={onPartComplete}
            />
            <a
              href={sources[Number(extractDocXValue(sentence))][1]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <sup
                style={{
                  fontSize: '0.7rem',
                  marginLeft: '2px',
                }}
              >
                {Number(extractDocXValue(sentence)) + 1}
              </sup>
            </a>
          </span>
        )}
        {!hasDocX && (
          <HighlightText text={sentence} onPartComplete={onPartComplete} />
        )}
        {/* Add a break except for the last part */}
        {index !== length - 1 && <br />}
      </span>
    )
  );
};

export default Typewriter;
