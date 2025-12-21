import React from 'react';
import '../../styles/layout.css';

const Sidebar = ({ activeNav, setActiveNav, currentUser }) => {
    return (
        <aside className="app-sidebar">
            <div className="sidebar-top">
                <div className="logo">G</div>
                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-item ${activeNav === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveNav('home')}
                        title="Home"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </button>
                    <button
                        className={`sidebar-item ${activeNav === 'spaces' ? 'active' : ''}`}
                        onClick={() => setActiveNav('spaces')}
                        title="Spaces"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </button>
                    <button
                        className={`sidebar-item ${activeNav === 'chats' ? 'active' : ''}`}
                        onClick={() => setActiveNav('chats')}
                        title="Chats"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </button>
                    <button
                        className={`sidebar-item ${activeNav === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveNav('notifications')}
                        title="Notifications"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                </nav>
            </div>

            <div className="sidebar-bottom">
                <button className="profile-btn" aria-label="User Profile" title={currentUser.name}>
                    <div className="profile-avatar" style={{ background: currentUser.avatarColor }}>{currentUser.initials}</div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
