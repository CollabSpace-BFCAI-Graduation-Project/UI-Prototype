import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../../../services/api';

// Mock users for mention autocomplete
const MENTION_USERS = [
    { id: 1, name: 'John Doe', initials: 'JD', avatarColor: '#3b82f6' },
    { id: 2, name: 'Sarah Chen', initials: 'SC', avatarColor: '#10b981' },
    { id: 3, name: 'Mike Ross', initials: 'MR', avatarColor: '#f59e0b' },
    { id: 4, name: 'Jessica Day', initials: 'JD', avatarColor: '#ec4899' },
    { id: 5, name: 'Tom Wilson', initials: 'TW', avatarColor: '#8b5cf6' },
];

const ChatArea = ({ activeSpace, chatMessages, newMessage, setNewMessage, handleSendMessage }) => {
    const [showMentionPopup, setShowMentionPopup] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const inputRef = useRef(null);

    const filteredUsers = MENTION_USERS.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );

    useEffect(() => {
        // Detect @ symbol in message
        const lastAtIndex = newMessage.lastIndexOf('@');
        if (lastAtIndex !== -1 && lastAtIndex === newMessage.length - 1) {
            setShowMentionPopup(true);
            setMentionQuery('');
        } else if (lastAtIndex !== -1) {
            const afterAt = newMessage.substring(lastAtIndex + 1);
            if (!afterAt.includes(' ')) {
                setShowMentionPopup(true);
                setMentionQuery(afterAt);
            } else {
                setShowMentionPopup(false);
            }
        } else {
            setShowMentionPopup(false);
        }
    }, [newMessage]);

    const handleMentionSelect = (user) => {
        const lastAtIndex = newMessage.lastIndexOf('@');
        const newText = newMessage.substring(0, lastAtIndex) + `@${user.name.split(' ')[0]} `;
        setNewMessage(newText);
        setShowMentionPopup(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (showMentionPopup) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedMentionIndex(prev => Math.min(prev + 1, filteredUsers.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedMentionIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                if (filteredUsers.length > 0) {
                    e.preventDefault();
                    handleMentionSelect(filteredUsers[selectedMentionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowMentionPopup(false);
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Render message text with highlighted mentions
    const renderMessageText = (text) => {
        const parts = text.split(/(@\w+)/g);
        return parts.map((part, i) => {
            if (part.startsWith('@')) {
                return <span key={i} className="mention-highlight">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="chat-main">
            {activeSpace ? (
                <>
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <h2 className="channel-title"># {activeSpace.name.toLowerCase().replace(/\s+/g, '-')}</h2>
                        </div>
                    </div>

                    <div className="chat-messages">
                        <div className="message-starter">
                            <span className="wave">👋</span>
                            <h3>Say hello in #{activeSpace.name.toLowerCase().replace(/\s+/g, '-')}</h3>
                            <p>Light, non-work chat to keep us human</p>
                        </div>

                        {(chatMessages[activeSpace.id] || []).map(msg => (
                            <div key={msg.id} className={msg.type === 'system' ? 'system-message' : 'chat-message-row'}>
                                {msg.avatarImage ? (
                                    <img
                                        src={getImageUrl(msg.avatarImage)}
                                        alt={msg.sender}
                                        className="user-avatar-sm user-avatar-img"
                                    />
                                ) : (
                                    <div className="user-avatar-sm" style={{ background: msg.avatarColor || 'gold' }}>
                                        {msg.sender.charAt(0)}
                                    </div>
                                )}
                                <div className="message-content-col">
                                    <div className="message-meta">
                                        <span className="message-sender">{msg.sender}</span>
                                        <span className="msg-time">{msg.time}</span>
                                    </div>
                                    {msg.type === 'system' ? (
                                        <span>{msg.sender} {msg.text}</span>
                                    ) : (
                                        <p className="message-text">{renderMessageText(msg.text)}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            {showMentionPopup && filteredUsers.length > 0 && (
                                <div className="mention-popup">
                                    {filteredUsers.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className={`mention-item ${index === selectedMentionIndex ? 'selected' : ''}`}
                                            onClick={() => handleMentionSelect(user)}
                                        >
                                            <div className="mention-avatar" style={{ background: user.avatarColor }}>
                                                {user.initials}
                                            </div>
                                            <span className="mention-name">{user.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={`Message #${activeSpace.name.toLowerCase().replace(/\s+/g, '-')}`}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="chat-tools">
                                <div className="format-tools">
                                    <button className="tool-btn"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                                    <button className="tool-btn" onClick={() => setNewMessage(prev => prev + '@')}>@</button>
                                    <div className="tool-divider"></div>
                                    <button className="tool-btn"><b>B</b></button>
                                    <button className="tool-btn"><i>I</i></button>
                                    <button className="tool-btn"><s>S</s></button>
                                </div>
                                <button className="send-btn" onClick={handleSendMessage}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-chat-state">
                    <p>Select a channel to start chatting</p>
                </div>
            )}
        </div>
    );
};

export default ChatArea;

