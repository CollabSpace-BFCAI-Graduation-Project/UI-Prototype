import React from 'react';

const SpaceCard = ({ space, index, setActiveSpace, toggleFavorite }) => {
    return (
        <div
            className="space-card fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setActiveSpace(space)}
        >
            <div className="space-thumbnail">
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: space.thumbnail || `linear-gradient(135deg, 
          hsl(${(space.id * 60) % 360}, 70%, 85%) 0%, 
          hsl(${(space.id * 60 + 40) % 360}, 70%, 90%) 100%)`,
                    position: 'relative'
                }}>
                    <span className={`space-status-badge ${space.isOnline ? 'status-online' : 'status-offline'}`}>
                        {space.isOnline ? `online(${space.userCount})` : 'offline'}
                    </span>

                    <button
                        className={`favorite-btn-thumb ${space.isFavorite ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(e, space.id)}
                        title={space.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={space.isFavorite ? "#ef4444" : "none"}
                            stroke={space.isFavorite ? "#ef4444" : "white"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>

                    <div className="space-overlay">
                        <span className="overlay-text">Click to enter space</span>
                    </div>
                </div>
            </div>
            <div className="space-info">
                <div className="space-details">
                    <h1 className="space-name">{space.name}</h1>
                    <h3 className="space-members">{space.memberCount} members</h3>
                </div>
                <div className="space-category">
                    {space.type}
                </div>
            </div>
        </div>
    );
};

export default SpaceCard;
