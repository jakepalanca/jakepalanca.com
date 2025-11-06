import { useState, useEffect } from 'react';

const TypingAnimation = ({ 
  sections, 
  typingSpeed = 30, 
  sectionDelay = 800 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentCommand, setCurrentCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [allComplete, setAllComplete] = useState(false);

  // Generate natural typing delay with variation
  const getTypingDelay = (char, index, previousChar, command) => {
    const baseSpeed = typingSpeed || 30;
    
    // After punctuation: longer pause (thinking/reading)
    if (previousChar && /[.,;:!?]/.test(previousChar)) {
      return baseSpeed + Math.random() * 80 + 40; // 40-120ms pause after punctuation
    }
    
    // Spaces: moderate pause (word boundary)
    if (char === ' ') {
      return baseSpeed + Math.random() * 50 + 20; // 20-70ms pause for spaces
    }
    
    // Punctuation itself: slight pause
    if (/[.,;:!?]/.test(char)) {
      return baseSpeed + Math.random() * 40 + 30; // 30-70ms for punctuation
    }
    
    // After spaces: sometimes fast burst, sometimes normal
    if (previousChar === ' ') {
      // 70% chance of fast burst after space
      if (Math.random() < 0.7) {
        return baseSpeed * (0.3 + Math.random() * 0.4); // 30-70% of base speed (fast burst)
      }
    }
    
    // Regular characters: wide variation (50-200% of base speed)
    // Simulate typing bursts and occasional hesitations
    const variation = baseSpeed * 1.5; // Much wider variation
    const randomVariation = Math.random() * variation;
    
    // 15% chance of a "hesitation" pause (thinking/typing error recovery)
    const hesitation = Math.random() < 0.15 ? Math.random() * 60 + 30 : 0;
    
    // 20% chance of very fast typing (burst mode)
    const burstSpeed = Math.random() < 0.2 ? baseSpeed * (0.2 + Math.random() * 0.3) : null;
    
    if (burstSpeed) {
      return Math.max(8, burstSpeed + hesitation);
    }
    
    return Math.max(8, baseSpeed * 0.5 + randomVariation + hesitation);
  };

  useEffect(() => {
    if (currentSection >= sections.length) {
      // Show the final prompt immediately
      setAllComplete(true);
      return;
    }

    const section = sections[currentSection];
    
    if (!showOutput && currentCommand.length < section.command.length) {
      // Still typing the command
      const nextChar = section.command[currentCommand.length];
      const previousChar = currentCommand.length > 0 ? section.command[currentCommand.length - 1] : null;
      const delay = getTypingDelay(nextChar, currentCommand.length, previousChar, section.command);
      
      const timer = setTimeout(() => {
        setCurrentCommand(section.command.slice(0, currentCommand.length + 1));
      }, delay);
      return () => clearTimeout(timer);
    } else if (!showOutput) {
      // Command finished typing, show output immediately
      const isLastSection = currentSection === sections.length - 1;
      setShowOutput(true);
      
      if (isLastSection) {
        // Last section - show final cursor immediately in same render cycle
        setCompletedSections(prev => [...prev, currentSection]);
        setAllComplete(true);
      }
      return;
    } else {
      // Output is showing, move to next section
      const isLastSection = currentSection === sections.length - 1;
      
      if (isLastSection) {
        // This shouldn't happen, but just in case
        setCompletedSections(prev => [...prev, currentSection]);
        setAllComplete(true);
        return;
      }
      
      const timer = setTimeout(() => {
        setCompletedSections(prev => [...prev, currentSection]);
        setCurrentSection(prev => prev + 1);
        setCurrentCommand('');
        setShowOutput(false);
      }, sectionDelay);
      return () => clearTimeout(timer);
    }
  }, [currentCommand, currentSection, sections, typingSpeed, sectionDelay, showOutput]);

  return (
    <div className="typing-container">
      {completedSections.map((sectionIndex) => {
        const section = sections[sectionIndex];
        return (
          <div key={sectionIndex} className="completed-section">
            {section.comment && <div className="cli-comment">{section.comment}</div>}
            <div className="cli-section">
              <div className="cli-command">
                <span className="prompt">jake@MacBook-Pro ~ % </span>
                <span className="command">{section.command}</span>
              </div>
              <div className="cli-output">
                {section.output}
              </div>
            </div>
          </div>
        );
      })}
      
      {currentSection < sections.length && (
        <div className="current-section">
          {sections[currentSection].comment && (
            <div className="cli-comment">{sections[currentSection].comment}</div>
          )}
          <div className="cli-section">
            <div className="cli-command">
              <span className="prompt">jake@MacBook-Pro ~ % </span>
              <span className="command">
                {currentCommand}
              </span>
            </div>
            {showOutput && (
              <div className="cli-output">
                {sections[currentSection].output}
              </div>
            )}
          </div>
        </div>
      )}
      
      {allComplete && (
        <div className="final-prompt">
          <span className="prompt">jake@MacBook-Pro ~ % </span>
          <span className="cursor">|</span>
        </div>
      )}
    </div>
  );
};

export default TypingAnimation;