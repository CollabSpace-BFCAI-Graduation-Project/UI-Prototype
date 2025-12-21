import React from 'react';
import '../../../styles/session.css';

const SessionView = ({ activeSpace, currentUser, handleLeaveSession }) => {
    return (
        <div className="session-view">
            <div className="session-header">
                <div className="session-info">
                    <h2 className="session-title">{activeSpace?.name}</h2>
                    <span className="session-timer">00:00</span>
                </div>
                <div className="session-header-controls">
                    <button className="btn-icon-session" title="Settings">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>

            <div className="session-grid">
                {/* Main User (You) */}
                <div className="video-tile active-user">
                    <div className="video-placeholder">
                        <div className="avatar-lg" style={{ background: currentUser.avatarColor }}>{currentUser.initials}</div>
                    </div>
                    <div className="user-label">You</div>
                </div>

                {/* Other Participants placeholders */}
                <div className="video-tile">
                    <div className="video-placeholder" style={{ background: '#1f2937' }}>
                        <div className="avatar-lg" style={{ background: '#f59e0b' }}>TW</div>
                    </div>
                    <div className="user-label">Tom Wilson</div>
                </div>
                <div className="video-tile">
                    <div className="video-placeholder" style={{ background: '#1f2937' }}>
                        <div className="avatar-lg" style={{ background: '#ec4899' }}>AM</div>
                    </div>
                    <div className="user-label">Alex Morgan</div>
                </div>
            </div>

            <div className="session-controls">
                <button className="control-btn" title="Mute/Unmute">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <button className="control-btn" title="Stop Video">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
                <button className="control-btn" title="Share Screen">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </button>
                <button className="control-btn danger" onClick={handleLeaveSession} title="Leave Session">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>
        </div>
    );
};

export default SessionView;
