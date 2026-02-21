import { useRef, useEffect, useState, useCallback } from 'react';

const TreeLine = ({ treeChar, children, isNested = false, isLast = false }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [extraLines, setExtraLines] = useState(0);

  const measureLines = useCallback(() => {
    if (!contentRef.current) return;
    
    const element = contentRef.current;
    const computedStyle = getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    
    if (isNaN(lineHeight) || lineHeight <= 0) return;
    
    // Get fresh measurement
    const totalHeight = element.offsetHeight;
    
    if (totalHeight <= 0) return;
    
    const lines = Math.max(1, Math.round(totalHeight / lineHeight));
    const newExtraLines = Math.max(0, lines - 1);
    
    setExtraLines(newExtraLines);
  }, []);

  // Measure on mount and children change
  useEffect(() => {
    const timer = requestAnimationFrame(measureLines);
    return () => cancelAnimationFrame(timer);
  }, [measureLines, children]);

  // Window resize - force remeasure
  useEffect(() => {
    const handleResize = () => {
      // Reset first to ensure state updates
      setExtraLines(0);
      // Then remeasure after layout updates
      requestAnimationFrame(() => {
        requestAnimationFrame(measureLines);
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [measureLines]);

  // ResizeObserver for container
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(() => {
      setExtraLines(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(measureLines);
      });
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureLines]);

  // Continuation character for wrapped lines
  const continuationChar = isLast ? ' ' : '│';

  return (
    <div 
      className={`tree-line-grid ${isNested ? 'tree-nested' : ''}`}
      ref={containerRef}
    >
      <div className="tree-prefix">
        <span className="tree-char-main">{treeChar}</span>
        {extraLines > 0 && Array.from({ length: extraLines }, (_, i) => (
          <span key={i} className="tree-char-cont">{continuationChar}   </span>
        ))}
      </div>
      <div className="tree-content-block" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default TreeLine;
