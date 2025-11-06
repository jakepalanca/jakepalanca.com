import React, { useState, useEffect } from 'react';

const CommandLine = ({ onComplete, typingSpeed = 75 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullCommand = 'cat /home/jake/about-me.txt';

  useEffect(() => {
    if (displayedText.length < fullCommand.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullCommand.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (isTyping) {
      setIsTyping(false);
      if (onComplete) {
        // Small delay before calling onComplete to let the cursor blink a bit
        setTimeout(() => onComplete(), 500);
      }
    }
  }, [displayedText, fullCommand, typingSpeed, isTyping, onComplete]);

  return (
    <div className="command-line">
      <span className="prompt">jake@terminal:~$ </span>
      <span className="command">
        {displayedText}
        {isTyping && <span className="cursor">|</span>}
      </span>
    </div>
  );
};

export default CommandLine;