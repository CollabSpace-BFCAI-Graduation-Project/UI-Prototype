import React, { useState } from 'react';
import { invitesApi } from '../../../services/api';
import '../../../styles/notifications.css';

const NotificationsView = ({ notifications, markAsRead, markAllAsRead, onInviteResponse }) => {
    const [filter, setFilter] = useState('all');
    const [processingInvites, setProcessingInvites] = useState({});

    const handleAcceptInvite = async (e, notif) => {
        e.stopPropagation();
        if (!notif.inviteId) return;

        setProcessingInvites(prev => ({ ...prev, [notif.inviteId]: 'accepting' }));
        try {
            await invitesApi.accept(notif.inviteId);
            markAsRead(notif.id);
            if (onInviteResponse) onInviteResponse('accepted', notif);
            alert(`You've joined ${notif.target}!`);
        } catch (err) {
            console.error('Failed to accept invite:', err);
            alert('Failed to accept invite');
        } finally {
            setProcessingInvites(prev => ({ ...prev, [notif.inviteId]: null }));
        }
    };

    const handleDeclineInvite = async (e, notif) => {
        e.stopPropagation();
        if (!notif.inviteId) return;

        setProcessingInvites(prev => ({ ...prev, [notif.inviteId]: 'declining' }));
        try {
            await invitesApi.decline(notif.inviteId);
            markAsRead(notif.id);
            if (onInviteResponse) onInviteResponse('declined', notif);
        } catch (err) {
            console.error('Failed to decline invite:', err);
            alert('Failed to decline invite');
        } finally {
            setProcessingInvites(prev => ({ ...prev, [notif.inviteId]: null }));
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.read;
        if (filter === 'mentions') return notif.type === 'mention';
        if (filter === 'system') return notif.type === 'system';
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'mention': return (
                <div className="notif-icon mention">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
            );
            case 'message': return (
                <div className="notif-icon message">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
            );
            case 'invite': return (
                <div className="notif-icon invite">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </div>
            );
            case 'session': return (
                <div className="notif-icon session">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
            );
            case 'file': return (
                <div className="notif-icon file">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
            );
            case 'system': return (
                <div className="notif-icon system">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            );
            default: return (
                <div className="notif-icon default">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
            );
        }
    };

    return (
        <div className="notifications-view">
            <header className="notifications-header">
                <div className="header-left">
                    <h2>Notifications</h2>
                    <div className="badge">{notifications.filter(n => !n.read).length} Unread</div>
                </div>
                <div className="header-actions">
                    <button className="text-btn" onClick={markAllAsRead}>Mark all as read</button>
                    <button className="icon-btn">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </header>

            <div className="notifications-filters">
                <button
                    className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-chip ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Unread
                </button>
                <button
                    className={`filter-chip ${filter === 'mentions' ? 'active' : ''}`}
                    onClick={() => setFilter('mentions')}
                >
                    Mentions
                </button>
                <button
                    className={`filter-chip ${filter === 'system' ? 'active' : ''}`}
                    onClick={() => setFilter('system')}
                >
                    System
                </button>
            </div>

            <div className="notifications-list">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div className="notif-status-dot"></div>
                            {getIcon(notif.type)}
                            <div className="notif-content">
                                <div className="notif-text">
                                    <span className="notif-author">{notif.author}</span>
                                    {notif.text}
                                    {notif.target && <span className="notif-target">{notif.target}</span>}
                                </div>
                                <div className="notif-time">{notif.time}</div>
                            </div>
                            {notif.type === 'invite' && notif.inviteId && !notif.read ? (
                                <div className="notif-action invite-actions">
                                    <button
                                        className="action-btn accept-btn"
                                        onClick={(e) => handleAcceptInvite(e, notif)}
                                        disabled={processingInvites[notif.inviteId]}
                                    >
                                        {processingInvites[notif.inviteId] === 'accepting' ? '...' : 'Accept'}
                                    </button>
                                    <button
                                        className="action-btn decline-btn"
                                        onClick={(e) => handleDeclineInvite(e, notif)}
                                        disabled={processingInvites[notif.inviteId]}
                                    >
                                        {processingInvites[notif.inviteId] === 'declining' ? '...' : 'Decline'}
                                    </button>
                                </div>
                            ) : notif.action && (
                                <div className="notif-action">
                                    <button className="action-btn">{notif.action}</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-notifications">
                        <div className="empty-icon">
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3>No notifications</h3>
                        <p>You're all caught up! check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsView;
