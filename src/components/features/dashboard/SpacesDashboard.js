import React from 'react';
import SpaceCard from './SpaceCard';
import '../../../styles/dashboard.css';

const SpacesDashboard = ({
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeStatus,
    setActiveStatus,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filteredSpaces,
    setActiveSpace,
    toggleFavorite,
    setIsCreateModalOpen
}) => {
    return (
        <>
            {/* Navigation */}
            <section className="nav-section">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-tabs">
                            <button
                                className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'member' ? 'active' : ''}`}
                                onClick={() => setActiveTab('member')}
                            >
                                Member
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                Favorites
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'owned' ? 'active' : ''}`}
                                onClick={() => setActiveTab('owned')}
                            >
                                Owned
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="filter-wrapper">
                                <select
                                    className="status-select"
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="CREATIVE">Creative</option>
                                    <option value="TECH">Tech</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="MEETING">Meeting</option>
                                </select>
                            </div>

                            <div className="status-filter">
                                <select
                                    className="status-select"
                                    value={activeStatus}
                                    onChange={(e) => setActiveStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>

                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Grid View"
                                >
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" />
                                    </svg>
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="List View"
                                >
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="search-box">
                                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spaces Grid */}
            <section className="spaces-section">
                <div className="container">
                    {filteredSpaces.length > 0 ? (
                        <div className={viewMode === 'grid' ? "spaces-grid" : "spaces-list"}>
                            {filteredSpaces.map((space, index) => (
                                <SpaceCard
                                    key={space.id}
                                    space={space}
                                    index={index}
                                    setActiveSpace={setActiveSpace}
                                    toggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">
                                No spaces found.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Create Button */}
            <button
                className="btn btn-primary floating-create-btn"
                onClick={() => setIsCreateModalOpen(true)}
            >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Space
            </button>
        </>
    );
};

export default SpacesDashboard;
