import React, { useState } from 'react';
import '../../../styles/session.css';

const SessionView = ({
    activeSpace,
    currentUser,
    handleLeaveSession,
    chatMessages,
    newMessage,
    setNewMessage,
    handleSendMessage
}) => {
    const [activePanel, setActivePanel] = useState('none'); // 'none', 'chat', 'members'
    const [micOn, setMicOn] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [showNearbyChat, setShowNearbyChat] = useState(false);
    const [nearbyMessage, setNearbyMessage] = useState('');

    const togglePanel = (panel) => {
        if (activePanel === panel) {
            setActivePanel('none');
        } else {
            setActivePanel(panel);
        }
    };

    const handleNearbyChatSubmit = (e) => {
        if (e.key === 'Enter' && nearbyMessage.trim()) {
            handleSendMessage({ text: nearbyMessage, type: 'nearby' });
            setNearbyMessage('');
            setShowNearbyChat(false);
        }
    };

    const messages = (activeSpace && chatMessages[activeSpace.id]) || [];

    return (
        <div className="session-view-container">
            {/* Left Navigation Rail */}
            <div className="session-nav-rail">
                <div className="nav-rail-top">
                    <div className="session-logo">G</div>
                    <button
                        className={`nav-rail-item ${activePanel === 'members' ? 'active' : ''}`}
                        onClick={() => togglePanel('members')}
                        title="Members"
                    >
                        <div className="nav-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="nav-label">Members</span>
                    </button>
                    <button
                        className={`nav-rail-item ${activePanel === 'chat' ? 'active' : ''}`}
                        onClick={() => togglePanel('chat')}
                        title="Chat"
                    >
                        <div className="nav-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <span className="nav-label">Chat</span>
                    </button>
                </div>
                <div className="nav-rail-bottom">
                    <button className="nav-rail-item" title="Settings">
                        <div className="nav-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Sliding Panel */}
            {activePanel !== 'none' && (
                <div className="session-side-panel">
                    <div className="panel-header">
                        <h3>{activePanel === 'members' ? 'Members' : 'Chat'}</h3>
                        <button className="close-panel-btn" onClick={() => setActivePanel('none')}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="panel-content">
                        {activePanel === 'members' && (
                            <div className="members-list-placeholder">
                                <p>Online (3)</p>
                                <div className="member-item">
                                    <div className="avatar-sm" style={{ background: currentUser.avatarColor }}>{currentUser.initials}</div>
                                    <span>{currentUser.name} (You)</span>
                                </div>
                                <div className="member-item">
                                    <div className="avatar-sm" style={{ background: '#f59e0b' }}>TW</div>
                                    <span>Tom Wilson</span>
                                </div>
                                <div className="member-item">
                                    <div className="avatar-sm" style={{ background: '#ec4899' }}>AM</div>
                                    <span>Alex Morgan</span>
                                </div>
                            </div>
                        )}
                        {activePanel === 'chat' && (
                            <div className="chat-placeholder">
                                <div className="chat-messages-area" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '1rem' }}>
                                    <p className="system-msg">Welcome to {activeSpace?.name}</p>
                                    {messages.map(msg => (
                                        <div key={msg.id} style={{
                                            alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                                            background: msg.sender === 'You' ? '#3b82f6' : '#374151',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            maxWidth: '85%',
                                            fontSize: '0.875rem'
                                        }}>
                                            {msg.sender !== 'You' && <div style={{ fontSize: '0.7em', color: '#9ca3af', marginBottom: '2px' }}>{msg.sender}</div>}
                                            <div>{msg.text}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input-area">
                                    <input
                                        type="text"
                                        placeholder="Send a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSendMessage();
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Game/Unity Area */}
            <div className="session-main-area">
                <div className="unity-placeholder">
                    <h2>Unity WebGL Build</h2>
                    <p>Rendering area for 3D environment</p>
                </div>

                {/* Nearby Chat Popup */}
                {showNearbyChat && (
                    <div className="nearby-chat-popup">
                        <div className="nearby-input-wrapper">
                            <span className="nearby-icon">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </span>
                            <input
                                type="text"
                                className="nearby-input"
                                placeholder="Message..."
                                autoFocus
                                value={nearbyMessage}
                                onChange={(e) => setNearbyMessage(e.target.value)}
                                onKeyDown={handleNearbyChatSubmit}
                            />
                        </div>
                        <div className="nearby-helper-text">Messages here are not saved</div>
                    </div>
                )}

                {/* Floating Bottom Controls */}
                <div className="floating-controls-bar">
                    <button
                        className={`control-btn ${micOn ? 'active' : 'muted'}`}
                        onClick={() => setMicOn(!micOn)}
                        title={micOn ? "Mute Mic" : "Unmute Mic"}
                    >
                        {micOn ? (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        ) : (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                        )}
                    </button>
                    <button
                        className={`control-btn ${cameraOn ? 'active' : 'off'}`}
                        onClick={() => setCameraOn(!cameraOn)}
                        title={cameraOn ? "Stop Camera" : "Start Camera"}
                    >
                        {cameraOn ? (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        ) : (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                        )}
                    </button>
                    <button
                        className={`control-btn ${showNearbyChat ? 'active' : ''}`}
                        onClick={() => setShowNearbyChat(!showNearbyChat)}
                        title="Nearby Chat"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </button>
                    <button className="control-btn" title="Emote">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button className="control-btn" title="Share Screen">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </button>
                    <button className="control-btn danger" onClick={handleLeaveSession} title="Leave">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionView;
