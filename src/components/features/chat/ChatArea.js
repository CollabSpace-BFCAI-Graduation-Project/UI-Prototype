import React from 'react';

const ChatArea = ({ activeSpace, chatMessages, newMessage, setNewMessage, handleSendMessage }) => {
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
                                <div className="user-avatar-sm" style={{ background: msg.avatarColor || 'gold' }}>
                                    {msg.sender.charAt(0)}
                                </div>
                                <div className="message-content-col">
                                    <div className="message-meta">
                                        <span className="message-sender">{msg.sender}</span>
                                        <span className="msg-time">{msg.time}</span>
                                    </div>
                                    {msg.type === 'system' ? (
                                        <span>{msg.sender} {msg.text}</span>
                                    ) : (
                                        <p className="message-text">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            <input
                                type="text"
                                placeholder={`Message #${activeSpace.name.toLowerCase().replace(/\s+/g, '-')}`}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <div className="chat-tools">
                                <div className="format-tools">
                                    <button className="tool-btn"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                                    <button className="tool-btn">@</button>
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
