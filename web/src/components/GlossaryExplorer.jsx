import React, { useState, useMemo } from 'react';

export default function GlossaryExplorer({ glossaryData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [copiedKey, setCopiedKey] = useState(null);

  // Convert glossaryData object to a sorted array
  const termsList = useMemo(() => {
    if (!glossaryData) return [];
    return Object.entries(glossaryData)
      .map(([key, value]) => ({
        term: key,
        vi: value.vi || '',
        def: value.def || '',
      }))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [glossaryData]);

  // Filter list based on search query and selected letter
  const filteredTerms = useMemo(() => {
    return termsList.filter(item => {
      // 1. Alphabet Filter
      if (selectedLetter !== 'All') {
        const firstLetter = item.term.charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // 2. Search Query Filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.term.toLowerCase().includes(query) ||
        item.vi.toLowerCase().includes(query) ||
        item.def.toLowerCase().includes(query)
      );
    });
  }, [termsList, searchQuery, selectedLetter]);

  // Get list of letters that actually have terms to display in alphabet filter
  const availableLetters = useMemo(() => {
    const letters = new Set();
    termsList.forEach(item => {
      const firstLetter = item.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    });
    return ['All', ...Array.from(letters).sort()];
  }, [termsList]);

  const handleCopy = (item) => {
    const text = `**${item.term}** (${item.vi}): ${item.def}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(item.term);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div className="glossary-explorer">
      <div className="glossary-explorer-header">
        <h1 className="glossary-title">Từ điển Thuật ngữ DevOps & System Design</h1>
        <p className="glossary-subtitle">
          Tổng hợp toàn bộ {termsList.length} thuật ngữ chuyên ngành đã được thống kê và biên dịch chi tiết.
        </p>
        
        {/* Search Input */}
        <div className="glossary-search-container">
          <svg viewBox="0 0 24 24" className="glossary-search-icon" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm thuật ngữ (ví dụ: latency, load balancer, cơ sở dữ liệu...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glossary-search-input"
          />
        </div>

        {/* Alphabet Bar */}
        <div className="alphabet-bar">
          {availableLetters.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`alphabet-btn ${selectedLetter === letter ? 'active' : ''}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="glossary-grid">
        {filteredTerms.length > 0 ? (
          filteredTerms.map(item => (
            <div key={item.term} className="glossary-card" id={`glossary-card-${item.term.replace(/\s+/g, '-')}`}>
              <div className="glossary-card-header">
                <h3 className="glossary-card-title">{item.term}</h3>
                <button 
                  onClick={() => handleCopy(item)} 
                  className="glossary-card-copy"
                  title="Sao chép định nghĩa"
                >
                  {copiedKey === item.term ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="copy-success-icon">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
              <div className="glossary-card-badge">
                <span className="vi-badge">{item.vi}</span>
              </div>
              <p className="glossary-card-definition">{item.def}</p>
            </div>
          ))
        ) : (
          <div className="glossary-empty">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Không tìm thấy thuật ngữ nào khớp với điều kiện tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
}
