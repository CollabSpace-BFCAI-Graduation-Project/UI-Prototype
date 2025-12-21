import React, { useState, useEffect } from 'react';
import '../../../styles/friends.css';

const FriendsView = ({ currentUser }) => {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [addFriendEmail, setAddFriendEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setFriends([
                { id: 2, name: 'Sarah Chen', initials: 'SC', avatarColor: '#10b981', status: 'online', bio: 'Senior Developer' },
                { id: 3, name: 'Mike Ross', initials: 'MR', avatarColor: '#f59e0b', status: 'away', bio: 'Marketing Lead' },
                { id: 6, name: 'Emily Zhang', initials: 'EZ', avatarColor: '#06b6d4', status: 'online', bio: 'Project Manager' },
                { id: 7, name: 'Alex Kim', initials: 'AK', avatarColor: '#8b5cf6', status: 'offline', bio: 'Data Analyst' },
            ]);
            setFriendRequests([
                { id: 1, fromUser: { id: 5, name: 'Tom Wilson', initials: 'TW', avatarColor: '#8b5cf6', bio: 'Backend Engineer' }, createdAt: '2 days ago' },
            ]);
            setLoading(false);
        }, 400);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#10b981';
            case 'away': return '#f59e0b';
            case 'dnd': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'online': return 'Online';
            case 'away': return 'Away';
            case 'dnd': return 'Do Not Disturb';
            default: return 'Offline';
        }
    };

    const filteredFriends = friends.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'online') return matchesSearch && f.status === 'online';
        return matchesSearch;
    });

    const handleAcceptRequest = (requestId) => {
        const request = friendRequests.find(r => r.id === requestId);
        if (request) {
            setFriends(prev => [...prev, { ...request.fromUser, status: 'offline' }]);
            setFriendRequests(prev => prev.filter(r => r.id !== requestId));
        }
    };

    const handleDeclineRequest = (requestId) => {
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleRemoveFriend = (friendId) => {
        if (window.confirm('Are you sure you want to remove this friend?')) {
            setFriends(prev => prev.filter(f => f.id !== friendId));
        }
    };

    const handleSendRequest = () => {
        if (addFriendEmail.trim()) {
            alert(`Friend request sent to ${addFriendEmail}`);
            setAddFriendEmail('');
            setShowAddFriend(false);
        }
    };

    return (
        <div className="friends-view">
            <header className="friends-header">
                <div className="header-left">
                    <h2>Friends</h2>
                    <div className="friends-count">{friends.length} friends</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddFriend(true)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Add Friend
                </button>
            </header>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
                <section className="friend-requests-section">
                    <h3>Friend Requests <span className="badge">{friendRequests.length}</span></h3>
                    <div className="requests-list">
                        {friendRequests.map(request => (
                            <div key={request.id} className="request-card">
                                <div className="request-user">
                                    <div className="friend-avatar" style={{ background: request.fromUser.avatarColor }}>
                                        {request.fromUser.initials}
                                    </div>
                                    <div className="friend-info">
                                        <div className="friend-name">{request.fromUser.name}</div>
                                        <div className="friend-bio">{request.fromUser.bio}</div>
                                    </div>
                                </div>
                                <div className="request-actions">
                                    <button className="btn btn-primary btn-sm" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Filters */}
            <div className="friends-filters">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'online' ? 'active' : ''}`}
                        onClick={() => setActiveTab('online')}
                    >
                        Online
                    </button>
                </div>
                <div className="search-input-wrapper">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Friends List */}
            <div className="friends-list">
                {loading ? (
                    <div className="loading-state">Loading friends...</div>
                ) : filteredFriends.length === 0 ? (
                    <div className="empty-state">
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3>No friends found</h3>
                        <p>Try a different search or add new friends</p>
                    </div>
                ) : (
                    filteredFriends.map(friend => (
                        <div key={friend.id} className="friend-card">
                            <div className="friend-avatar-wrapper">
                                <div className="friend-avatar" style={{ background: friend.avatarColor }}>
                                    {friend.initials}
                                </div>
                                <span
                                    className="status-dot"
                                    style={{ background: getStatusColor(friend.status) }}
                                    title={getStatusLabel(friend.status)}
                                />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                <div className="friend-status">{getStatusLabel(friend.status)}</div>
                            </div>
                            <div className="friend-actions">
                                <button className="icon-btn" title="Send Message">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </button>
                                <button className="icon-btn" title="Invite to Space">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                                <button className="icon-btn danger" title="Remove Friend" onClick={() => handleRemoveFriend(friend.id)}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Friend Modal */}
            {showAddFriend && (
                <div className="modal-overlay" onClick={() => setShowAddFriend(false)}>
                    <div className="modal add-friend-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Friend</h3>
                            <button className="modal-close" onClick={() => setShowAddFriend(false)}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Enter your friend's email or username to send them a friend request.</p>
                            <input
                                type="text"
                                placeholder="Email or username"
                                value={addFriendEmail}
                                onChange={e => setAddFriendEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddFriend(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSendRequest}>Send Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendsView;
