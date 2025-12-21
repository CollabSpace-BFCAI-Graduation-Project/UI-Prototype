import React, { useState } from 'react';
import '../../styles/layout.css';

const Sidebar = ({ activeNav, setActiveNav, currentUser, userStatus, setUserStatus, setIsProfileModalOpen }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingTab, setActiveSettingTab] = useState('general');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#10b981';
            case 'away': return '#f59e0b';
            case 'dnd': return '#ef4444';
            default: return '#94a3b8';
        }
    };

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
                    <button
                        className={`sidebar-item ${activeNav === 'friends' ? 'active' : ''}`}
                        onClick={() => setActiveNav('friends')}
                        title="Friends"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </button>
                </nav>
            </div>

            <div className="sidebar-bottom">
                <button className="settings-btn" onClick={toggleSettings} title="Settings">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <div className="profile-wrapper">
                    <button
                        className="profile-btn"
                        aria-label="User Profile"
                        title={currentUser.name}
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    >
                        <div className="profile-avatar" style={{ background: currentUser.avatarColor }}>
                            {currentUser.initials}
                            <span
                                className="status-indicator"
                                style={{ background: getStatusColor(userStatus) }}
                            />
                        </div>
                    </button>

                    {/* Status Dropdown */}
                    {isStatusDropdownOpen && (
                        <div className="status-dropdown">
                            <div className="status-dropdown-header">
                                <span>Set Status</span>
                                <button className="close-dropdown" onClick={() => setIsStatusDropdownOpen(false)}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="status-options">
                                <button
                                    className={`status-option ${userStatus === 'online' ? 'active' : ''}`}
                                    onClick={() => { setUserStatus('online'); setIsStatusDropdownOpen(false); }}
                                >
                                    <span className="status-dot" style={{ background: '#10b981' }} />
                                    Online
                                </button>
                                <button
                                    className={`status-option ${userStatus === 'away' ? 'active' : ''}`}
                                    onClick={() => { setUserStatus('away'); setIsStatusDropdownOpen(false); }}
                                >
                                    <span className="status-dot" style={{ background: '#f59e0b' }} />
                                    Away
                                </button>
                                <button
                                    className={`status-option ${userStatus === 'dnd' ? 'active' : ''}`}
                                    onClick={() => { setUserStatus('dnd'); setIsStatusDropdownOpen(false); }}
                                >
                                    <span className="status-dot" style={{ background: '#ef4444' }} />
                                    Do Not Disturb
                                </button>
                                <button
                                    className={`status-option ${userStatus === 'offline' ? 'active' : ''}`}
                                    onClick={() => { setUserStatus('offline'); setIsStatusDropdownOpen(false); }}
                                >
                                    <span className="status-dot" style={{ background: '#94a3b8' }} />
                                    Invisible
                                </button>
                            </div>
                            <div className="status-dropdown-footer">
                                <button className="view-profile-btn" onClick={() => { setIsProfileModalOpen(true); setIsStatusDropdownOpen(false); }}>
                                    View Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <>
                    <div className="settings-backdrop" onClick={() => setIsSettingsOpen(false)}></div>
                    <div className="settings-popup">
                        <div className="settings-sidebar">
                            <h3>Settings</h3>
                            <ul>
                                <li className={activeSettingTab === 'general' ? 'active' : ''} onClick={() => setActiveSettingTab('general')}>General</li>
                                <li className={activeSettingTab === 'notifications' ? 'active' : ''} onClick={() => setActiveSettingTab('notifications')}>Notifications</li>
                                <li className={activeSettingTab === 'privacy' ? 'active' : ''} onClick={() => setActiveSettingTab('privacy')}>Privacy</li>
                            </ul>
                        </div>
                        <div className="settings-content">
                            {activeSettingTab === 'general' && (
                                <div className="settings-section">
                                    <h4>General Settings</h4>
                                    <div className="setting-group">
                                        <label>Language</label>
                                        <select defaultValue="en">
                                            <option value="en">English (US)</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div className="setting-group">
                                        <label>Theme</label>
                                        <div className="theme-options">
                                            <button className="theme-btn active">Light</button>
                                            <button className="theme-btn">Dark</button>
                                            <button className="theme-btn">System</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeSettingTab === 'notifications' && (
                                <div className="settings-section">
                                    <h4>Notifications</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                        Choose what you want to be notified about.
                                    </p>

                                    <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 0.75rem 0' }}>Communication</h5>
                                    <div className="setting-row">
                                        <input type="checkbox" defaultChecked /> <span>Mentions (@name)</span>
                                    </div>
                                    <div className="setting-row">
                                        <input type="checkbox" defaultChecked /> <span>Direct Messages</span>
                                    </div>
                                    <div className="setting-row">
                                        <input type="checkbox" defaultChecked /> <span>Space Invites</span>
                                    </div>

                                    <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '1.5rem 0 0.75rem 0' }}>Activity</h5>
                                    <div className="setting-row">
                                        <input type="checkbox" defaultChecked /> <span>Session Alerts</span>
                                    </div>
                                    <div className="setting-row">
                                        <input type="checkbox" defaultChecked /> <span>File Uploads & Updates</span>
                                    </div>
                                    <div className="setting-row">
                                        <input type="checkbox" /> <span>Task Assignments</span>
                                    </div>
                                </div>
                            )}
                            {activeSettingTab === 'privacy' && (
                                <div className="settings-section">
                                    <h4>Privacy</h4>
                                    <p>Privacy settings placeholder.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
