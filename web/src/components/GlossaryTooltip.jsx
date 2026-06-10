import React, { useState, useEffect } from 'react';

export default function GlossaryTooltip({ text, triggerRect }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!triggerRect || !text) return;

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const tooltipWidth = 240; // Matches style.css width
    const estimatedHeight = 65; // Estimated height for coordinate calculations

    let top = triggerRect.top + scrollTop - estimatedHeight - 8;
    let left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - (tooltipWidth / 2);

    // Boundary checks (prevent offscreen left/right)
    const buffer = 16;
    if (left < buffer) {
      left = buffer;
    } else if (left + tooltipWidth > window.innerWidth - buffer) {
      left = window.innerWidth - tooltipWidth - buffer;
    }

    // Top boundary check: if offscreen top, render below instead
    if (triggerRect.top - estimatedHeight - 8 < 0) {
      top = triggerRect.bottom + scrollTop + 8;
    }

    setCoords({ top, left });
  }, [triggerRect, text]);

  if (!text || !triggerRect) return null;

  return (
    <div
      className="glossary-tooltip-popup active"
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'block'
      }}
      aria-hidden="false"
    >
      {text}
    </div>
  );
}
