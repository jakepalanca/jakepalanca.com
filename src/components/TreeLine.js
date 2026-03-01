import { useCallback, useEffect, useRef, useState } from 'react';

const getContinuationPrefix = (treeChar, isLast) => {
  const branchIndex = treeChar.search(/[├└]/);

  if (branchIndex < 0) return '';

  const leadingPrefix = treeChar.slice(0, branchIndex);
  return `${leadingPrefix}${isLast ? ' ' : '│'}   `;
};

const TreeLine = ({ treeChar = '', children, isNested = false, isLast = false }) => {
  const contentRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);
  const continuationPrefix = getContinuationPrefix(treeChar, isLast);
  const hasPrefix = treeChar.length > 0;

  const measureLines = useCallback(() => {
    const contentElement = contentRef.current;

    if (!contentElement) return;

    const range = document.createRange();
    range.selectNodeContents(contentElement);

    const visibleRects = Array.from(range.getClientRects()).filter((rect) => (
      rect.width > 0 && rect.height > 0
    ));
    const uniqueLineTops = [];

    visibleRects.forEach((rect) => {
      const hasMatchingLine = uniqueLineTops.some((top) => Math.abs(top - rect.top) < 1);

      if (!hasMatchingLine) {
        uniqueLineTops.push(rect.top);
      }
    });

    setLineCount(Math.max(1, uniqueLineTops.length));
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(measureLines);
    return () => cancelAnimationFrame(frameId);
  }, [children, measureLines]);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) return undefined;

    const handleResize = () => {
      requestAnimationFrame(measureLines);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(contentElement);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [measureLines]);

  return (
    <div className={`tree-line-grid ${isNested ? 'tree-nested' : ''} ${hasPrefix ? 'tree-line-with-prefix' : 'tree-line-no-prefix'}`.trim()}>
      {hasPrefix ? (
        <div className="tree-prefix" aria-hidden="true">
          <span className="tree-char-main">{treeChar}</span>
          {Array.from({ length: Math.max(0, lineCount - 1) }, (_, index) => (
            <span key={index} className="tree-char-cont">{continuationPrefix}</span>
          ))}
        </div>
      ) : null}
      <div className="tree-content-block">
        <span className="tree-content-inline" ref={contentRef}>
          {children}
        </span>
      </div>
    </div>
  );
};

export default TreeLine;
