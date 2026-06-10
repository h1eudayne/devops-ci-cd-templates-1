import React, { useState, useEffect, useRef } from 'react';

export default function ImageZoomer({ src, alt, onClose }) {
  const [zoomScale, setZoomScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const viewportRef = useRef(null);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const amount = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomScale((scale) => Math.min(Math.max(scale + amount, 0.4), 5));
  };

  // Keyboard Escape support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Window drag listeners (to maintain drag outside viewport)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPanX(e.clientX - startX);
      setPanY(e.clientY - startY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startY]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button drag
    setIsDragging(true);
    setStartX(e.clientX - panX);
    setStartY(e.clientY - panY);
  };

  const handleZoom = (amount) => {
    setZoomScale((scale) => Math.min(Math.max(scale + amount, 0.4), 5));
  };

  const handleReset = () => {
    setZoomScale(1);
    setPanX(0);
    setPanY(0);
  };

  if (!src) return null;

  return (
    <div className="zoomer-modal active" aria-hidden="false">
      <div className="zoomer-overlay" onClick={onClose}></div>
      <div className="zoomer-content">
        <div className="zoomer-header">
          <span className="zoomer-title">{alt || 'Xem sơ đồ thiết kế hệ thống'}</span>
          <div className="zoomer-controls">
            <button className="zoomer-btn" onClick={() => handleZoom(0.25)} title="Phóng to">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="zoomer-btn" onClick={() => handleZoom(-0.25)} title="Thu nhỏ">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="zoomer-btn" onClick={handleReset} title="Đặt lại">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
              </svg>
            </button>
            <button className="zoomer-btn close-btn" onClick={onClose} title="Đóng (ESC)">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div
          ref={viewportRef}
          className="zoomer-viewport"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="zoomer-drag-wrapper"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <img
              src={src}
              alt={alt}
              id="zoomer-image"
              draggable="false"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
        </div>
        
        <div className="zoomer-footer">
          <span>Kéo và thả để dịch chuyển sơ đồ • Cuộn chuột để phóng to/thu nhỏ</span>
        </div>
      </div>
    </div>
  );
}
