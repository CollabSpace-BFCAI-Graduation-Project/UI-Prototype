import React, { useState, useEffect, useRef } from 'react';
import '../../styles/modals.css';

const SearchModal = ({ isOpen, onClose, spaces, activeSpaceMembers, setActiveSpace, setActiveNav }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [results, setResults] = useState({ spaces: [], people: [] });
    const [recentSearches, setRecentSearches] = useState(['Design Weekly', 'Sarah Chen', 'Project Alpha']);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults({ spaces: [], people: [] });
            return;
        }

        const q = query.toLowerCase();
        const filteredSpaces = spaces.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.type.toLowerCase().includes(q)
        );
        const filteredPeople = activeSpaceMembers.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q)
        );

        setResults({ spaces: filteredSpaces, people: filteredPeople });
    }, [query, spaces, activeSpaceMembers]);

    if (!isOpen) return null;

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSpaceClick = (space) => {
        setActiveSpace(space);
        setActiveNav('spaces');
        onClose();
    };

    const handlePersonClick = (person) => {
        // Could navigate to DM or profile
        console.log('View profile:', person);
        onClose();
    };

    const totalResults = results.spaces.length + results.people.length;

    return (
        <div className="modal-overlay search-overlay" onClick={onClose}>
            <div className="modal search-modal" onClick={e => e.stopPropagation()}>
                {/* Search Input */}
                <div className="search-input-container">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search spaces, people, files..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="search-hint">
                        <kbd>ESC</kbd> to close
                    </div>
                </div>

                {/* Tabs */}
                <div className="search-tabs">
                    <button
                        className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All {query && `(${totalResults})`}
                    </button>
                    <button
                        className={`search-tab ${activeTab === 'spaces' ? 'active' : ''}`}
                        onClick={() => setActiveTab('spaces')}
                    >
                        Spaces {query && `(${results.spaces.length})`}
                    </button>
                    <button
                        className={`search-tab ${activeTab === 'people' ? 'active' : ''}`}
                        onClick={() => setActiveTab('people')}
                    >
                        People {query && `(${results.people.length})`}
                    </button>
                </div>

                {/* Results */}
                <div className="search-results">
                    {!query ? (
                        /* Recent Searches */
                        <div className="recent-searches">
                            <div className="recent-header">Recent Searches</div>
                            {recentSearches.map((search, i) => (
                                <div
                                    key={i}
                                    className="recent-item"
                                    onClick={() => setQuery(search)}
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {search}
                                </div>
                            ))}
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="no-results">
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            {/* Spaces Results */}
                            {(activeTab === 'all' || activeTab === 'spaces') && results.spaces.length > 0 && (
                                <div className="result-section">
                                    <div className="result-header">Spaces</div>
                                    {results.spaces.map(space => (
                                        <div
                                            key={space.id}
                                            className="result-item"
                                            onClick={() => handleSpaceClick(space)}
                                        >
                                            <div className="result-icon space-icon" style={{ background: space.thumbnail }}>
                                                {space.name[0]}
                                            </div>
                                            <div className="result-info">
                                                <div className="result-name">{space.name}</div>
                                                <div className="result-meta">{space.type} · {space.memberCount} members</div>
                                            </div>
                                            {space.isOnline && (
                                                <span className="result-badge online">{space.userCount} online</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* People Results */}
                            {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                                <div className="result-section">
                                    <div className="result-header">People</div>
                                    {results.people.map(person => (
                                        <div
                                            key={person.id}
                                            className="result-item"
                                            onClick={() => handlePersonClick(person)}
                                        >
                                            <div className="result-icon person-icon" style={{ background: person.avatarColor }}>
                                                {person.initials}
                                            </div>
                                            <div className="result-info">
                                                <div className="result-name">{person.name}</div>
                                                <div className="result-meta">{person.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="search-footer">
                    <div className="search-tips">
                        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                        <span><kbd>↵</kbd> to select</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
