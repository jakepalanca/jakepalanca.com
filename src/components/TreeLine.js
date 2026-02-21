import { useRef, useEffect, useState, useCallback } from 'react';

const TreeLine = ({ treeChar, children, isNested = false, isLast = false }) => {
  const contentRef = useRef(null);
  const frameRef = useRef(null);
  const [extraLines, setExtraLines] = useState(0);

  const measureLines = useCallback(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const computedStyle = getComputedStyle(element);
    const lineHeightValue = Number.parseFloat(computedStyle.lineHeight);
    const fontSizeValue = Number.parseFloat(computedStyle.fontSize);
    const lineHeight = Number.isFinite(lineHeightValue) && lineHeightValue > 0
      ? lineHeightValue
      : (Number.isFinite(fontSizeValue) && fontSizeValue > 0 ? fontSizeValue * 1.4 : 0);

    if (lineHeight <= 0) return;

    const totalHeight = element.getBoundingClientRect().height;
    if (totalHeight <= 0) return;

    // iOS Safari can report slightly fractional values after orientation changes.
    const lines = Math.max(1, Math.ceil((totalHeight + 0.5) / lineHeight));
    const newExtraLines = Math.max(0, lines - 1);

    setExtraLines((currentLines) => (
      currentLines === newExtraLines ? currentLines : newExtraLines
    ));
  }, []);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      measureLines();
      frameRef.current = null;
    });
  }, [measureLines]);

  // Measure on mount and when content changes.
  useEffect(() => {
    scheduleMeasure();
  }, [scheduleMeasure, children]);

  // Re-measure after viewport changes such as rotation.
  useEffect(() => {
    const handleResize = () => scheduleMeasure();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [scheduleMeasure]);

  // Re-measure whenever wrapped tree content changes height.
  useEffect(() => {
    if (!contentRef.current) return undefined;

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [scheduleMeasure]);

  useEffect(() => () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  // Continuation character for wrapped lines
  const continuationChar = isLast ? ' ' : '│';

  return (
    <div
      className={`tree-line-grid ${isNested ? 'tree-nested' : ''}`}
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
