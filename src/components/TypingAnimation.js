import { useState, useEffect } from 'react';

const TypingAnimation = ({ 
  sections, 
  typingSpeed = 50, 
  sectionDelay = 800 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showOutput, setShowOutput] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    if (currentSection >= sections.length) {
      setIsTyping(false);
      // Add a small delay before showing the final prompt
      const timer = setTimeout(() => {
        setAllComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    const section = sections[currentSection];
    
    if (!showOutput && currentCommand.length < section.command.length) {
      // Still typing the command
      const timer = setTimeout(() => {
        setCurrentCommand(section.command.slice(0, currentCommand.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (!showOutput) {
      // Command finished typing, show output
      const timer = setTimeout(() => {
        setShowOutput(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Output is showing, move to next section
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
                <span className="prompt">jake@terminal:~$ </span>
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
              <span className="prompt">jake@terminal:~$ </span>
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
          <span className="prompt">jake@terminal:~$ </span>
          <span className="cursor">|</span>
        </div>
      )}
    </div>
  );
};

export default TypingAnimation;