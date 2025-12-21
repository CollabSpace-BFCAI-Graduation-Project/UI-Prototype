import React, { useState, useEffect } from 'react';
import '../../../styles/home.css';

const HomeView = ({
    currentUser,
    spaces,
    notifications,
    setActiveNav,
    setActiveSpace,
    setIsCreateModalOpen
}) => {
    const [activity, setActivity] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setActivity([
                { id: 1, type: 'session', user: { name: 'Sarah Chen', initials: 'SC', avatarColor: '#10b981' }, spaceName: 'Design Weekly', action: 'started a session', time: '10 mins ago' },
                { id: 2, type: 'file', user: { name: 'Mike Ross', initials: 'MR', avatarColor: '#f59e0b' }, spaceName: 'Project Alpha', action: 'uploaded Design_v3.fig', time: '1 hour ago' },
                { id: 3, type: 'join', user: { name: 'Emily Zhang', initials: 'EZ', avatarColor: '#06b6d4' }, spaceName: 'Acme Corp HQ', action: 'joined the space', time: '2 hours ago' },
                { id: 4, type: 'message', user: { name: 'Sarah Chen', initials: 'SC', avatarColor: '#10b981' }, spaceName: 'Dev Standup', action: 'mentioned you', time: '3 hours ago' },
            ]);
            setStats({
                spacesJoined: 6,
                hoursSpent: 47,
                messagesSent: 234,
                filesShared: 18,
            });
            setLoading(false);
        }, 500);
    }, []);

    const recentSpaces = spaces.slice(0, 4);
    const upcomingEvents = [
        { id: 1, title: 'Weekly Design Review', time: 'Today, 2:00 PM', spaceName: 'Design Weekly' },
        { id: 2, title: 'Sprint Planning', time: 'Tomorrow, 10:00 AM', spaceName: 'Project Alpha' },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'session': return (
                <div className="activity-icon session">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
            );
            case 'file': return (
                <div className="activity-icon file">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
            );
            case 'join': return (
                <div className="activity-icon join">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </div>
            );
            case 'message': return (
                <div className="activity-icon message">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="home-view">
            {/* Welcome Banner */}
            <header className="home-header">
                <div className="welcome-section">
                    <h1>Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
                    <p>Here's what's happening in your spaces</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => setActiveNav('notifications')}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="notif-badge">{notifications.filter(n => !n.read).length}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* Quick Actions */}
            <section className="quick-actions">
                <div className="action-card primary" onClick={() => setActiveNav('spaces')}>
                    <div className="action-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div className="action-content">
                        <h3>Join a Space</h3>
                        <p>Browse and enter virtual spaces</p>
                    </div>
                    <svg className="action-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                <div className="action-card" onClick={() => setIsCreateModalOpen(true)}>
                    <div className="action-icon create">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <div className="action-content">
                        <h3>Create Space</h3>
                        <p>Start a new virtual environment</p>
                    </div>
                    <svg className="action-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                <div className="action-card" onClick={() => setActiveNav('chats')}>
                    <div className="action-icon chat">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div className="action-content">
                        <h3>Messages</h3>
                        <p>View your conversations</p>
                    </div>
                    <svg className="action-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="home-grid">
                {/* Recent Spaces */}
                <section className="home-section recent-spaces">
                    <div className="section-header">
                        <h2>Recent Spaces</h2>
                        <button className="link-btn" onClick={() => setActiveNav('spaces')}>View all</button>
                    </div>
                    <div className="spaces-grid">
                        {recentSpaces.map(space => (
                            <div
                                key={space.id}
                                className="space-card-mini"
                                onClick={() => { setActiveSpace(space); setActiveNav('spaces'); }}
                            >
                                <div className="space-thumb" style={{ background: space.thumbnail }}>
                                    {space.isOnline && <span className="online-badge">{space.userCount} online</span>}
                                </div>
                                <div className="space-info">
                                    <h4>{space.name}</h4>
                                    <p>{space.lastVisited}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Activity Feed */}
                <section className="home-section activity-feed">
                    <div className="section-header">
                        <h2>Activity</h2>
                        <button className="link-btn" onClick={() => setActiveNav('notifications')}>View all</button>
                    </div>
                    {loading ? (
                        <div className="loading-placeholder">Loading...</div>
                    ) : (
                        <div className="activity-list">
                            {activity.map(item => (
                                <div key={item.id} className="activity-item">
                                    <div className="activity-avatar" style={{ background: item.user.avatarColor }}>
                                        {item.user.initials}
                                    </div>
                                    <div className="activity-content">
                                        <p>
                                            <strong>{item.user.name}</strong> {item.action} in <strong>{item.spaceName}</strong>
                                        </p>
                                        <span className="activity-time">{item.time}</span>
                                    </div>
                                    {getActivityIcon(item.type)}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Upcoming Events */}
                <section className="home-section upcoming-events">
                    <div className="section-header">
                        <h2>Upcoming Events</h2>
                        <button className="link-btn">+ Schedule</button>
                    </div>
                    <div className="events-list">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="event-time">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {event.time}
                                </div>
                                <h4>{event.title}</h4>
                                <p>in {event.spaceName}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats */}
                <section className="home-section stats-section">
                    <div className="section-header">
                        <h2>Your Stats</h2>
                    </div>
                    {stats && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{stats.spacesJoined}</div>
                                <div className="stat-label">Spaces Joined</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.hoursSpent}h</div>
                                <div className="stat-label">Hours Spent</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.messagesSent}</div>
                                <div className="stat-label">Messages Sent</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.filesShared}</div>
                                <div className="stat-label">Files Shared</div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomeView;
