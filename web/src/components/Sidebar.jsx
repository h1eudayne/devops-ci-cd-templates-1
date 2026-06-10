import React, { useRef, useEffect, useState } from 'react';

// Custom checkbox component to handle indeterminate state
const TreeCheckbox = ({ checked, indeterminate, onChange, id }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={checkboxRef}
      checked={checked}
      onChange={onChange}
      className="chapter-checkbox"
      id={id}
    />
  );
};

export default function Sidebar({
  tree,
  activePath,
  onSelectFile,
  completedFiles,
  onToggleFileComplete,
  expandedNodes,
  onToggleExpand,
  isOpen,
  selectedTopic,
  onSelectTopic
}) {
  const [topicSelectorExpanded, setTopicSelectorExpanded] = useState(false);

  const getActiveTopicName = () => {
    switch (selectedTopic) {
      case 'all': return 'Tất cả tài liệu';
      case 'system-design': return 'System Design';
      case 'kubernetes': return 'Kubernetes';
      case 'aws': return 'EC2 & AWS';
      case 'cicd-docker': return 'CI/CD & Docker';
      case 'glossary': return 'Từ điển Thuật ngữ';
      case 'flashcard': return 'Thẻ Flashcard';
      default: return 'Tất cả';
    }
  };

  const handleSelectTopic = (topic) => {
    onSelectTopic(topic);
    setTopicSelectorExpanded(false);
  };

  // Helper to determine if a node is a parent directory of active file (to auto-expand it)
  // Recursively check if a directory contains all completed files
  const getDirectoryCompletionState = (node) => {
    if (node.type === 'file') {
      return completedFiles.has(node.path) ? 'checked' : 'unchecked';
    }

    if (!node.children || node.children.length === 0) {
      return 'unchecked';
    }

    let checkedCount = 0;
    let uncheckedCount = 0;
    let hasIndeterminate = false;

    node.children.forEach(child => {
      const state = getDirectoryCompletionState(child);
      if (state === 'checked') {
        checkedCount++;
      } else if (state === 'unchecked') {
        uncheckedCount++;
      } else {
        hasIndeterminate = true;
      }
    });

    if (hasIndeterminate) {
      return 'indeterminate';
    }
    if (checkedCount === node.children.length) {
      return 'checked';
    }
    if (uncheckedCount === node.children.length) {
      return 'unchecked';
    }
    return 'indeterminate';
  };

  // Recursively toggle all child files of a directory
  const toggleDirectoryComplete = (node, makeCompleted) => {
    const filesToToggle = [];
    const collectFiles = (n) => {
      if (n.type === 'file') {
        filesToToggle.push(n.path);
      } else if (n.children) {
        n.children.forEach(collectFiles);
      }
    };
    collectFiles(node);
    onToggleFileComplete(filesToToggle, makeCompleted);
  };

  // Render a single node recursively
  const renderNode = (node, depth = 0) => {
    const isDir = node.type === 'directory';
    const nodeId = node.path || node.name;
    const isExpanded = expandedNodes.has(nodeId);

    if (isDir) {
      const completionState = getDirectoryCompletionState(node);
      const isChecked = completionState === 'checked';
      const isIndeterminate = completionState === 'indeterminate';

      // Parse and format directory names starting with numbers, and add 00. to Alex-Xu
      const match = node.name.match(/^(\d+)/);
      let dirNum = '';
      let displayTitle = node.displayName || node.name;

      if (node.name === 'Alex-Xu-System-Design-Interview') {
        dirNum = '00.';
        displayTitle = 'Alex Xu System Design Interview';
      } else if (match) {
        dirNum = `${match[1].padStart(2, '0')}.`;
        displayTitle = displayTitle.replace(/^\d+\.\s*/, '').replace(/-/g, ' ');
      } else if (depth > 0) {
        displayTitle = displayTitle.replace(/-/g, ' ');
      }

      return (
        <li key={nodeId} className="vol-section" style={{ marginLeft: depth > 0 ? '12px' : '0' }}>
          <div className="vol-header-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="chapter-checkbox-container">
              <TreeCheckbox
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={(e) => toggleDirectoryComplete(node, e.target.checked)}
                id={`cb-dir-${nodeId}`}
              />
            </div>
            <button
              className="vol-header"
              aria-expanded={isExpanded}
              onClick={() => onToggleExpand(nodeId)}
              style={{ flex: 1, textTransform: depth === 0 ? 'uppercase' : 'none', paddingLeft: '4px' }}
            >
              <span className="vol-title" style={{ fontSize: depth === 0 ? '12px' : '13px', fontWeight: depth === 0 ? '700' : '600', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                {dirNum && <span className="chapter-num" style={{ width: '24px' }}>{dirNum}</span>}
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayTitle}</span>
              </span>
              <svg
                className="chevron-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          {isExpanded && node.children && (
            <ul className="chapter-list" style={{ paddingLeft: '4px', marginTop: '4px' }}>
              {node.children.map(child => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    } else {
      // File node
      const isActive = node.path === activePath;
      const isChecked = completedFiles.has(node.path);

      // Check if file is chapter in Alex Xu (starts with a number)
      // Extract number to display
      const match = node.name.match(/^(\d+)/);
      const fileNum = match ? `${match[1].padStart(2, '0')}.` : '';
      const displayTitle = node.title || node.name.replace(/\.md$/, '');

      return (
        <li key={node.path} className="chapter-item-container" style={{ marginLeft: depth > 0 ? '12px' : '0' }}>
          <div className={`chapter-item ${isActive ? 'active' : ''}`} data-index={node.path}>
            <div className="chapter-checkbox-container">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onToggleFileComplete([node.path], e.target.checked)}
                className="chapter-checkbox"
                id={`cb-file-${node.path}`}
              />
            </div>
            <div
              className="chapter-item-link"
              onClick={() => onSelectFile(node.path)}
              style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}
            >
              {fileNum && <span className="chapter-num">{fileNum}</span>}
              <span className="chapter-title-text" title={displayTitle}>
                {displayTitle}
              </span>
            </div>
          </div>
        </li>
      );
    }
  };

  return (
    <aside className={`sidebar-left ${isOpen ? 'open' : ''}`} id="sidebar-left">
      <div className="sidebar-topic-selector">
        <button 
          className="selector-toggle-btn"
          onClick={() => setTopicSelectorExpanded(!topicSelectorExpanded)}
          aria-expanded={topicSelectorExpanded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            color: 'var(--text-main)',
            textAlign: 'left'
          }}
        >
          <span className="selector-label" style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', color: 'var(--text-muted)' }}>
            Chủ đề: <span style={{ color: 'var(--accent)', textTransform: 'none', fontWeight: '600' }}>{getActiveTopicName()}</span>
          </span>
          <svg
            className="chevron-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ 
              transform: topicSelectorExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', 
              transition: 'transform 0.2s ease',
              color: 'var(--text-muted)'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {topicSelectorExpanded && (
          <div className="topic-pills" style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-out' }}>
            <button 
              className={`topic-pill topic-pill-all ${selectedTopic === 'all' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('all')}
            >
              Tất cả tài liệu
            </button>
            <button 
              className={`topic-pill ${selectedTopic === 'system-design' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('system-design')}
              title="System Design"
            >
              System Design
            </button>
            <button 
              className={`topic-pill ${selectedTopic === 'kubernetes' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('kubernetes')}
              title="Kubernetes"
            >
              Kubernetes
            </button>
            <button 
              className={`topic-pill ${selectedTopic === 'aws' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('aws')}
              title="EC2 & AWS Cloud"
            >
              EC2 & AWS
            </button>
            <button 
              className={`topic-pill ${selectedTopic === 'cicd-docker' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('cicd-docker')}
              title="CI/CD & Docker"
            >
              CI/CD & Docker
            </button>
            <button 
              className={`topic-pill topic-pill-all ${selectedTopic === 'glossary' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('glossary')}
              title="Từ điển Thuật ngữ"
            >
              📕 Từ điển Thuật ngữ
            </button>
            <button 
              className={`topic-pill topic-pill-all ${selectedTopic === 'flashcard' ? 'active' : ''}`}
              onClick={() => handleSelectTopic('flashcard')}
              title="Thẻ Flashcard"
            >
              🎴 Thẻ Flashcard
            </button>
          </div>
        )}
      </div>
      <div className="sidebar-scroll">
        <ul className="chapter-list">
          {tree && tree.map(node => renderNode(node, 0))}
        </ul>
      </div>
    </aside>
  );
}
