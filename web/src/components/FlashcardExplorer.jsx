import React, { useState, useEffect, useMemo, useCallback } from 'react';

export default function FlashcardExplorer({ glossaryData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, unlearned, learned, starred
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage state for study progress
  const [learnedSet, setLearnedSet] = useState(() => {
    const saved = localStorage.getItem('learnedFlashcards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [starredSet, setStarredSet] = useState(() => {
    const saved = localStorage.getItem('starredFlashcards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Convert glossaryData object to a sorted array
  const allTerms = useMemo(() => {
    if (!glossaryData) return [];
    return Object.entries(glossaryData)
      .map(([key, value]) => ({
        term: key,
        vi: value.vi || '',
        def: value.def || '',
      }))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [glossaryData]);

  // Filter terms based on search query, letter, and status
  const filteredTerms = useMemo(() => {
    return allTerms.filter(item => {
      // 1. Status Filter
      if (statusFilter === 'learned' && !learnedSet.has(item.term)) return false;
      if (statusFilter === 'unlearned' && learnedSet.has(item.term)) return false;
      if (statusFilter === 'starred' && !starredSet.has(item.term)) return false;

      // 2. Letter Filter
      if (selectedLetter !== 'All') {
        const firstLetter = item.term.charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          item.term.toLowerCase().includes(query) ||
          item.vi.toLowerCase().includes(query) ||
          item.def.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allTerms, statusFilter, selectedLetter, searchQuery, learnedSet, starredSet]);

  // Active study deck (handles shuffling)
  const [currentDeck, setCurrentDeck] = useState([]);

  // Sync current deck with filtered terms
  useEffect(() => {
    setCurrentDeck(filteredTerms);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filteredTerms]);

  const currentCard = currentDeck[currentIndex] || null;

  // Toggle Learned status
  const toggleLearned = useCallback((termKey) => {
    setLearnedSet(prev => {
      const next = new Set(prev);
      if (next.has(termKey)) {
        next.delete(termKey);
      } else {
        next.add(termKey);
      }
      localStorage.setItem('learnedFlashcards', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  // Toggle Starred status
  const toggleStarred = useCallback((termKey) => {
    setStarredSet(prev => {
      const next = new Set(prev);
      if (next.has(termKey)) {
        next.delete(termKey);
      } else {
        next.add(termKey);
      }
      localStorage.setItem('starredFlashcards', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % currentDeck.length);
  }, [currentDeck]);

  const handlePrev = useCallback(() => {
    if (currentDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + currentDeck.length) % currentDeck.length);
  }, [currentDeck]);

  const handleFlip = useCallback(() => {
    if (currentDeck.length === 0) return;
    setIsFlipped(prev => !prev);
  }, [currentDeck]);

  // Shuffle Deck
  const shuffleDeck = () => {
    if (currentDeck.length === 0) return;
    setCurrentDeck(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Reset Deck
  const resetDeck = () => {
    setCurrentDeck(filteredTerms);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'l') {
        if (currentCard) {
          toggleLearned(currentCard.term);
        }
      } else if (e.key.toLowerCase() === 's') {
        if (currentCard) {
          toggleStarred(currentCard.term);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, handleFlip, handleNext, handlePrev, toggleLearned, toggleStarred]);

  // Compute alphabet list
  const availableLetters = useMemo(() => {
    const letters = new Set();
    allTerms.forEach(item => {
      const firstLetter = item.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    });
    return ['All', ...Array.from(letters).sort()];
  }, [allTerms]);

  // Progress metrics
  const learnedCount = useMemo(() => {
    return allTerms.filter(item => learnedSet.has(item.term)).length;
  }, [allTerms, learnedSet]);

  const starredCount = useMemo(() => {
    return allTerms.filter(item => starredSet.has(item.term)).length;
  }, [allTerms, starredSet]);

  const deckProgressPercent = useMemo(() => {
    if (currentDeck.length === 0) return 0;
    const learnedInDeck = currentDeck.filter(item => learnedSet.has(item.term)).length;
    return Math.round((learnedInDeck / currentDeck.length) * 100);
  }, [currentDeck, learnedSet]);

  return (
    <div className="flashcard-explorer">
      <div className="flashcard-header">
        <h1 className="glossary-title">Học thuật ngữ qua Flashcard</h1>
        <p className="glossary-subtitle">
          Phương pháp lặp lại ngắt quãng (Spaced Repetition) giúp ghi nhớ nhanh {allTerms.length} thuật ngữ chuyên ngành.
        </p>

        {/* Global Stats Panel */}
        <div className="flashcard-stats-panel">
          <div className="stat-pill">
            <span className="stat-label">Tổng thuật ngữ:</span>
            <span className="stat-value">{allTerms.length}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Đã thuộc:</span>
            <span className="stat-value text-success">{learnedCount}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Đã đánh dấu:</span>
            <span className="stat-value text-star">{starredCount}</span>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flashcard-filter-controls">
          {/* Status filter tabs */}
          <div className="status-tabs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            >
              Tất cả ({allTerms.length})
            </button>
            <button
              onClick={() => setStatusFilter('unlearned')}
              className={`status-tab ${statusFilter === 'unlearned' ? 'active' : ''}`}
            >
              Chưa thuộc ({allTerms.length - learnedCount})
            </button>
            <button
              onClick={() => setStatusFilter('learned')}
              className={`status-tab ${statusFilter === 'learned' ? 'active' : ''}`}
            >
              Đã thuộc ({learnedCount})
            </button>
            <button
              onClick={() => setStatusFilter('starred')}
              className={`status-tab ${statusFilter === 'starred' ? 'active' : ''}`}
            >
              Đã đánh dấu ({starredCount})
            </button>
          </div>

          {/* Search box */}
          <div className="glossary-search-container">
            <svg viewBox="0 0 24 24" className="glossary-search-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm trong bộ thẻ hiện tại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glossary-search-input"
            />
          </div>

          {/* Letters Filter */}
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
      </div>

      {/* Main Flashcard Body */}
      {currentCard ? (
        <div className="flashcard-study-area">
          {/* Deck progress bar */}
          <div className="deck-progress-wrapper">
            <div className="deck-progress-text">
              <span>Tiến trình bộ thẻ hiện tại: {currentDeck.filter(item => learnedSet.has(item.term)).length}/{currentDeck.length} thẻ</span>
              <span>{deckProgressPercent}%</span>
            </div>
            <div className="deck-progress-bar-bg">
              <div className="deck-progress-bar-fill" style={{ width: `${deckProgressPercent}%` }}></div>
            </div>
          </div>

          {/* 3D Flippable Card */}
          <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              {/* Front Face */}
              <div className="flashcard-face flashcard-front">
                <div className="card-top-actions">
                  <span className="card-counter">Thẻ {currentIndex + 1} / {currentDeck.length}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(currentCard.term);
                    }}
                    className={`card-star-btn ${starredSet.has(currentCard.term) ? 'starred' : ''}`}
                    title="Đánh dấu thẻ này"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={starredSet.has(currentCard.term) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <h2 className="card-term">{currentCard.term}</h2>
                  <div className="card-badges">
                    <span className="card-badge-status">
                      {learnedSet.has(currentCard.term) ? '✓ Đã thuộc' : '✍ Chưa thuộc'}
                    </span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="flip-prompt">Bấm để lật xem định nghĩa</span>
                </div>
              </div>

              {/* Back Face */}
              <div className="flashcard-face flashcard-back">
                <div className="card-top-actions">
                  <span className="card-counter">Thẻ {currentIndex + 1} / {currentDeck.length}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(currentCard.term);
                    }}
                    className={`card-star-btn ${starredSet.has(currentCard.term) ? 'starred' : ''}`}
                    title="Đánh dấu thẻ này"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={starredSet.has(currentCard.term) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <span className="card-term-small">{currentCard.term}</span>
                  <h3 className="card-translation">{currentCard.vi}</h3>
                  <div className="card-divider"></div>
                  <p className="card-definition">{currentCard.def}</p>
                </div>
                <div className="card-footer">
                  <span className="flip-prompt">Bấm để lật lại mặt trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study Controls */}
          <div className="flashcard-controls">
            <button onClick={handlePrev} className="control-btn secondary-btn" title="Thẻ trước (Mũi tên trái)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Trước
            </button>

            <button onClick={handleFlip} className="control-btn primary-btn" title="Lật thẻ (Phím cách)">
              Lật thẻ
            </button>

            <button onClick={handleNext} className="control-btn secondary-btn" title="Thẻ tiếp theo (Mũi tên phải)">
              Sau
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Quick Action buttons */}
          <div className="flashcard-actions">
            <button
              onClick={() => toggleLearned(currentCard.term)}
              className={`action-btn-learned ${learnedSet.has(currentCard.term) ? 'active' : ''}`}
            >
              {learnedSet.has(currentCard.term) ? '✓ Đánh dấu chưa thuộc (L)' : '✓ Đã thuộc bài này (L)'}
            </button>

            <button onClick={shuffleDeck} className="action-btn-extra">
              🔀 Xáo trộn bộ thẻ
            </button>

            <button onClick={resetDeck} className="action-btn-extra">
              🔄 Đặt lại thứ tự
            </button>
          </div>

          {/* Shortcuts Hint */}
          <div className="shortcuts-hint">
            <div className="shortcut-tag"><strong>Space</strong>: Lật thẻ</div>
            <div className="shortcut-tag"><strong>← / →</strong>: Thẻ trước / sau</div>
            <div className="shortcut-tag"><strong>L</strong>: Đánh dấu thuộc</div>
            <div className="shortcut-tag"><strong>S</strong>: Đánh dấu sao</div>
          </div>
        </div>
      ) : (
        <div className="glossary-empty" style={{ margin: '40px auto' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Không có thẻ nào phù hợp với bộ lọc hiện tại của bạn.</p>
          {(statusFilter !== 'all' || selectedLetter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedLetter('All');
                setSearchQuery('');
              }}
              className="control-btn primary-btn"
              style={{ marginTop: '12px' }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}
