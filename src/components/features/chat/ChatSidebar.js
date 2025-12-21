import React from 'react';

const ChatSidebar = ({ chatSearchQuery, setChatSearchQuery, spaces, activeSpace, setActiveSpace }) => {
    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <h2 className="chat-main-title">Chat</h2>
            </div>

            <div className="chat-search">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    type="text"
                    placeholder="Search or navigate..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                />
            </div>

            <div className="chat-section">
                <div className="chat-section-header">Channels</div>
                <div className="channel-list">
                    {spaces
                        .filter(space => space.name.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                        .map(space => (
                            <button key={space.id} className={`channel-item ${activeSpace && activeSpace.id === space.id ? 'active' : ''}`} onClick={() => setActiveSpace(space)}>
                                <span className="channel-hash">#</span>
                                {space.name.toLowerCase().replace(/\s+/g, '-')}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
