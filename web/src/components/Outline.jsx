import React, { useState, useEffect } from 'react';

export default function Outline({
  content,
  activePath,
  completedSections,
  onToggleSection
}) {
  const [headers, setHeaders] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from the DOM after markdown has rendered
  useEffect(() => {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
      setHeaders([]);
      return;
    }

    const headerElements = contentArea.querySelectorAll('h2, h3');
    const headerData = Array.from(headerElements).map((h) => ({
      id: h.id,
      text: h.textContent.replace(/^\s*[☑☐]?\s*/, '').trim(), // Clean up checkbox icons if any
      tag: h.tagName.toLowerCase()
    }));

    setHeaders(headerData);
  }, [content, activePath]);

  // ScrollSpy logic
  useEffect(() => {
    const contentPanel = document.getElementById('content-panel');
    if (!contentPanel || headers.length === 0) return;

    const handleScrollSpy = () => {
      const contentArea = document.getElementById('content-area');
      if (!contentArea) return;

      const headerElements = contentArea.querySelectorAll('h2, h3');
      let currentActiveId = '';

      for (let header of headerElements) {
        const rect = header.getBoundingClientRect();
        // Trigger active class when heading is near the top of the content panel
        if (rect.top < 150) {
          currentActiveId = header.id;
        } else {
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    contentPanel.addEventListener('scroll', handleScrollSpy);
    // Initial run
    handleScrollSpy();

    return () => {
      contentPanel.removeEventListener('scroll', handleScrollSpy);
    };
  }, [headers]);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const header = document.getElementById(id);
    if (header) {
      header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headers.length === 0) {
    return (
      <aside className="sidebar-right" id="sidebar-right">
        <div className="outline-container">
          <h4 class="outline-title">TRÊN TRANG NÀY</h4>
          <span className="no-outline">Không có mục lục con</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar-right" id="sidebar-right">
      <div className="outline-container">
        <h4 className="outline-title">TRÊN TRANG NÀY</h4>
        <nav className="outline-nav" id="outline-area">
          {headers.map((header) => {
            const sectionId = `section-${activePath}-${header.id}`;
            const isChecked = completedSections.has(sectionId);

            return (
              <a
                key={header.id}
                href={`#${header.id}`}
                onClick={(e) => handleLinkClick(e, header.id)}
                className={`outline-link ${header.tag}-link ${activeId === header.id ? 'active' : ''}`}
                data-target={header.id}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="outline-checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="outline-section-checkbox"
                    onChange={(e) => onToggleSection(sectionId, e.target.checked)}
                  />
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {header.text}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
