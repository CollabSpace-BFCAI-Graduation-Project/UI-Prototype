import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all'); // 'all', 'online', 'offline'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [createStep, setCreateStep] = useState(1);
  const [inviteMode, setInviteMode] = useState('link'); // 'link' or 'email'
  const [activeNav, setActiveNav] = useState('spaces'); // 'home', 'spaces', 'chats', 'notifications'
  const [activeSpace, setActiveSpace] = useState(null);
  const [activeFileFilter, setActiveFileFilter] = useState('all'); // 'all', 'image', 'doc', 'video', '3d'
  const [isFileTypesOpen, setIsFileTypesOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeSpaceMembers, setActiveSpaceMembers] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Owner', avatarColor: '#8b5cf6', initials: 'SC' },
    { id: 4, name: 'Tom Wilson', role: 'Admin', avatarColor: '#f59e0b', initials: 'TW' },
    { id: 5, name: 'Alex Morgan', role: 'Member', avatarColor: '#ec4899', initials: 'AM' },
  ]);
  const [currentUserId, setCurrentUserId] = useState(1);
  const currentUser = activeSpaceMembers.find(m => m.id === currentUserId) || activeSpaceMembers[0];
  const [activeDetailTab, setActiveDetailTab] = useState('files'); // 'files', 'boards'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: 'Mariam Tarek', text: 'joined', type: 'system', time: '1:55 AM' },
      { id: 2, sender: 'Mariam Tarek', text: 'Hello #nour!', type: 'user', time: '1:56 AM', avatarColor: 'gold' }
    ],
    2: [
      { id: 1, sender: 'System', text: 'Welcome to Creative Studio', type: 'system', time: '10:00 AM' }
    ],
    3: [
      { id: 1, sender: 'System', text: 'Tech updates go here', type: 'system', time: '09:00 AM' }
    ],
    4: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');

  const [files, setFiles] = useState([
    { name: 'Banner Assets.jpg', size: '3.2 MB', time: '1 day ago', icon: 'image', color: '#a855f7' },
    { name: 'Q4 Report.docx', size: '1.2 MB', time: '6 hours ago', icon: 'doc', color: '#3b82f6' },
    { name: 'Walkthrough.mov', size: '128.5 MB', time: '3 days ago', icon: 'video', color: '#ef4444' },
    { name: 'Brand Guidelines.pdf', size: '5.1 MB', time: '5 hours ago', icon: 'doc', color: '#3b82f6' },
    { name: 'UI Components.fig', size: '15.8 MB', time: '4 hours ago', icon: 'image', color: '#a855f7' },
    { name: 'Budget Planning.xlsx', size: '845 KB', time: '1 day ago', icon: 'doc', color: '#3b82f6' },
    { name: 'Project Mockups.png', size: '2.4 MB', time: '2 hours ago', icon: 'image', color: '#a855f7' },
    { name: 'Demo Video.mp4', size: '45.2 MB', time: '1 day ago', icon: 'video', color: '#ef4444' },
    { name: 'Product Model.glb', size: '24.5 MB', time: '2 days ago', icon: '3d', color: '#f59e0b' },
  ]);

  /* Upload Queue State */
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  /* Session State */
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  const handleJoinSession = () => {
    setIsSessionLoading(true);
    setTimeout(() => {
      setIsSessionLoading(false);
      setIsSessionActive(true);
    }, 2000);
  };

  const handleLeaveSession = () => {
    setIsSessionActive(false);
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (uploadQueue.length > 0 && uploadQueue.some(f => f.progress < 100)) {
      const interval = setInterval(() => {
        setUploadQueue(prev => prev.map(f => {
          if (f.progress >= 100) return f;
          return { ...f, progress: Math.min(f.progress + Math.random() * 15, 100) };
        }));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [uploadQueue]);

  const handleFileUpload = (uploadedFiles) => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      const newUploads = Array.from(uploadedFiles).map((file, idx) => {
        let icon = 'doc';
        let color = '#3b82f6';
        if (file.type.startsWith('image/')) { icon = 'image'; color = '#a855f7'; }
        else if (file.type.startsWith('video/')) { icon = 'video'; color = '#ef4444'; }

        return {
          id: Date.now() + idx,
          name: file.name,
          progress: 0,
          rawSize: file.size,
          size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
          time: 'Just now',
          icon: icon,
          color: color
        };
      });

      setUploadQueue(newUploads);
      setIsUploading(true);
    }
  };

  const handleConfirmUpload = () => {
    const completedFiles = uploadQueue.map(f => ({
      name: f.name,
      size: (f.rawSize / 1024 / 1024).toFixed(1) + ' MB',
      time: 'Just now',
      icon: f.icon,
      color: f.color
    }));
    setFiles([...files, ...completedFiles]);
    setUploadQueue([]);
    setIsUploading(false);
    setIsUploadModalOpen(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }; const handleSendMessage = () => {
    if (!newMessage.trim() || !activeSpace) return;

    const currentMessages = chatMessages[activeSpace.id] || [];
    const msg = {
      id: currentMessages.length + 1,
      sender: currentUser.name,
      text: newMessage,
      type: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: currentUser.avatarColor
    };

    setChatMessages({
      ...chatMessages,
      [activeSpace.id]: [...currentMessages, msg]
    });
    setNewMessage('');
  };

  // Templates mapping to categories
  const spaceTemplates = [
    { id: 't1', name: 'Aeries Gallery', category: 'CREATIVE', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 't2', name: 'Tech Lab', category: 'TECH', gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
    { id: 't4', name: 'Mountain Lounge', category: 'MEETING', gradient: 'linear-gradient(135deg, #e6b980 0%, #eacda3 100%)' },
    { id: 't5', name: 'Agora', category: 'EDUCATION', gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)' },
  ];

  const handleCreateConfirm = (template) => {
    // Instead of finishing immediately, move to step 3 (invite)
    // We'll store the pending space data temporarily or just create it now but keep modal open
    const newSpace = {
      id: spaces.length + 1,
      name: newSpaceName,
      thumbnail: template.gradient,
      lastVisited: 'Just now',
      type: template.category,
      isOnline: true,
      userCount: 0,
      memberCount: 1,
      isFavorite: false,
      memberCount: 1,
      description: newSpaceDescription
    };

    // In a real app we might wait, but here we add it
    setSpaces([...spaces, newSpace]);
    setCreateStep(3); // Move to invite step
  };

  const handleFinalizeCreate = () => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewSpaceName('');
    setNewSpaceDescription('');
    setInviteMode('link');
  };

  // Sample space data - in a real app, this would come from an API
  const [spaces, setSpaces] = useState([
    {
      id: 1,
      name: 'nour',
      thumbnail: null, // Will use gradient background
      lastVisited: 'today',
      type: 'MEETING',
      isOnline: true,
      userCount: 6,
      memberCount: 24,
      isFavorite: true
    },
    {
      id: 2,
      name: 'Creative Studio',
      thumbnail: null,
      lastVisited: 'yesterday',
      type: 'CREATIVE',
      isOnline: false,
      userCount: 0,
      memberCount: 8,
      isFavorite: false
    },
    {
      id: 3,
      name: 'Tech Hub',
      thumbnail: null,
      lastVisited: '2 days ago',
      type: 'TECH',
      isOnline: true,
      userCount: 12,
      memberCount: 42,
      isFavorite: false
    },
    {
      id: 4,
      name: 'Learning Center',
      thumbnail: null,
      lastVisited: '1 week ago',
      type: 'EDUCATION',
      isOnline: false,
      userCount: 0,
      memberCount: 156,
      isFavorite: true
    }
  ]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setSpaces(spaces.map(space =>
      space.id === id ? { ...space, isFavorite: !space.isFavorite } : space
    ));
  };

  const filteredSpaces = spaces.filter(space => {
    // Search Filter
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab Filter
    let matchesTab = true;
    if (activeTab === 'favorites') matchesTab = space.isFavorite;
    // For 'member' and 'owned', we'd check those properties. 
    // For now, assuming 'all' passes everything.

    // Status Filter
    let matchesStatus = true;
    if (activeStatus === 'online') matchesStatus = space.isOnline;
    if (activeStatus === 'offline') matchesStatus = !space.isOnline;

    // Category Filter
    let matchesCategory = true;
    if (activeCategory !== 'all') matchesCategory = space.type === activeCategory;

    return matchesSearch && matchesTab && matchesStatus && matchesCategory;
  });

  if (isSessionLoading) {
    return (
      <div className="session-loading">
        <div className="loading-spinner"></div>
        <h2 className="loading-text">Joining {activeSpace?.name}...</h2>
        <p className="loading-subtext">Loading environment...</p>
      </div>
    );
  }

  if (isSessionActive) {
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
  }

  return (
    <div className="App">
      <div className="app-layout">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="app-main">

          {activeNav === 'chats' && (
            <div className="chats-view">
              {/* Chat Sidebar */}
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

              {/* Chat Main Area */}
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


            </div>
          )}

          {activeNav === 'home' && (
            <div className="empty-state" style={{ marginTop: '20vh' }}>
              <h2>Home View Placeholder</h2>
              <button className="btn btn-primary" onClick={() => setActiveNav('spaces')}>Go to Spaces</button>
            </div>
          )}

          {activeNav === 'notifications' && (
            <div className="empty-state" style={{ marginTop: '20vh' }}>
              <h2>Notifications View Placeholder</h2>
            </div>
          )}

          {/* Spaces View (Dashboard or Details) */}
          {activeNav === 'spaces' && (
            <>
              {activeSpace ? (
                <div className="space-details-view">
                  {/* ... existing space details content ... */}
                  <div className="container">
                    {/* Header */}
                    <div className="details-header">
                      <button className="back-link" onClick={() => setActiveSpace(null)}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Dashboard
                      </button>

                      <div className="details-title-row">
                        <div className="details-title-left">
                          <h1 className="details-space-name">{activeSpace.name}</h1>
                          <span className={`status-badge-lg ${activeSpace.isOnline ? 'online' : 'offline'}`}>
                            {activeSpace.isOnline ? 'On' : 'Off'}line ({activeSpace.isOnline ? activeSpace.userCount : 0})
                          </span>
                        </div>
                        <div className="details-actions">
                          <button
                            className="btn btn-primary"
                            style={{ marginRight: '0.5rem' }}
                            onClick={handleJoinSession}
                          >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Join Session
                          </button>
                          {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                            <button className="btn btn-icon" onClick={() => { setIsCreateModalOpen(true); setCreateStep(3); setInviteMode('link'); }} title="Share Space">
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                          )}
                          <button className="btn btn-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </button>
                        </div>
                      </div>
                      <p className="details-description">{activeSpace.description || "A collaborative space for creative projects and design work."}</p>
                    </div>

                    <div className="details-tabs">
                      <button className={`detail-tab ${activeDetailTab === 'files' ? 'active' : ''}`} onClick={() => setActiveDetailTab('files')}>FILES</button>
                      <button className={`detail-tab ${activeDetailTab === 'boards' ? 'active' : ''}`} onClick={() => setActiveDetailTab('boards')}>BOARDS</button>
                    </div>


                    {/* Details Content Layout */}
                    <div className="details-content-layout">
                      {/* Left Main Content */}
                      <div className="details-main">

                        {activeDetailTab === 'files' && (
                          <>
                            <div className="files-toolbar">
                              <div className="files-controls">
                                <button className="btn-icon-sm active">
                                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" /></svg>
                                </button>
                                <button className="btn-icon-sm">
                                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                                </button>
                                <div className="files-filter" style={{ position: 'relative' }}>
                                  <span style={{ textTransform: 'capitalize' }}>
                                    {activeFileFilter === 'all' ? 'All Files' : (activeFileFilter === 'doc' ? 'Documents' : activeFileFilter + 's')}
                                  </span>
                                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                  <select
                                    value={activeFileFilter}
                                    onChange={(e) => setActiveFileFilter(e.target.value)}
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      opacity: 0,
                                      cursor: 'pointer',
                                      width: '100%',
                                      height: '100%'
                                    }}
                                  >
                                    <option value="all">All Files</option>
                                    <option value="image">Images</option>
                                    <option value="doc">Documents</option>
                                    <option value="video">Videos</option>
                                    <option value="3d">3D</option>
                                  </select>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                  className="btn-icon-sm"
                                  onClick={() => setIsFileTypesOpen(true)}
                                  title="Supported File Types"
                                  style={{ border: 'none' }}
                                >
                                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                <button
                                  className="btn btn-dark"
                                  onClick={() => setIsUploadModalOpen(true)}
                                >
                                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                  Upload File
                                </button>
                              </div>
                            </div>

                            <div className="files-grid">
                              {/* Placeholder Files */}
                              {files
                                .filter(file => activeFileFilter === 'all' || file.icon === activeFileFilter)
                                .map((file, i) => (
                                  <div key={i} className="file-card">
                                    <div className="file-preview">
                                      {file.icon === 'image' && (
                                        <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      )}
                                      {file.icon === 'doc' && (
                                        <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                      )}
                                      {file.icon === 'video' && (
                                        <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      )}
                                      {file.icon === '3d' && (
                                        <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                      )}
                                    </div>
                                    <div className="file-info">
                                      <h4 className="file-name">{file.name}</h4>
                                      <span className="file-meta">{file.size}</span>
                                    </div>
                                    <div className="file-footer">
                                      <div className="file-user">S</div>
                                      <span className="file-time">{file.time}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}

                        {activeDetailTab === 'boards' && (
                          <>
                            <div className="files-toolbar">
                              <div className="files-controls">
                                <button className="btn-icon-sm active">
                                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" /></svg>
                                </button>
                                <button className="btn-icon-sm">
                                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                                </button>
                              </div>
                            </div>

                            <div className="files-grid">
                              {[
                                { title: 'Product Roadmap', collaborators: 5, author: 'Sarah Chen', time: '1 hour ago' },
                                { title: 'UI Design Sprint', collaborators: 8, author: 'Mike Ross', time: '3 hours ago' },
                                { title: 'Marketing Strategy', collaborators: 4, author: 'Jessica Day', time: '1 day ago' },
                                { title: 'Team Brainstorming', collaborators: 12, author: 'Tom Wilson', time: '2 days ago' },
                              ].map((board, i) => (
                                <div key={i} className="board-card">
                                  <div className="board-thumbnail">
                                    <svg width="64" height="64" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </div>
                                  <div className="board-info">
                                    <h3 className="board-title">{board.title}</h3>
                                    <span className="board-time">{board.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right Sidebar */}
                      <div className="details-sidebar">
                        <div className="info-card">
                          <h3 className="info-card-title">WORKSPACE INFO</h3>
                          <div className="info-row">
                            <span className="info-label">Owner</span>
                            {activeSpaceMembers.find(m => m.role === 'Owner') && (
                              <div className="user-row">
                                <div className="user-avatar-sm" style={{ background: activeSpaceMembers.find(m => m.role === 'Owner').avatarColor }}>
                                  {activeSpaceMembers.find(m => m.role === 'Owner').initials}
                                </div>
                                <span>{activeSpaceMembers.find(m => m.role === 'Owner').name}</span>
                              </div>
                            )}
                          </div>
                          <div className="info-row">
                            <span className="info-label">Created</span>
                            <span className="info-value">Nov 15, 2024</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Storage Used</span>
                            <div className="storage-bar">
                              <div className="storage-fill" style={{ width: '25%' }}></div>
                            </div>
                            <span className="info-value-sm">184.5 MB</span>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-card-header">
                            <h3 className="info-card-title">MEMBERS ({activeSpaceMembers.length})</h3>
                            {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                              <button className="btn-link" onClick={() => { setIsMembersModalOpen(true); }}>Invite</button>
                            )}
                          </div>
                          <div className="members-list">
                            {activeSpaceMembers.slice(0, 4).map(member => (
                              <div key={member.id} className="member-item">
                                <div className="user-avatar-sm" style={{ background: member.avatarColor }}>{member.initials}</div>
                                <div className="member-info">
                                  <span className="member-name">{member.name}</span>
                                  <span className="member-role">{member.role}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {activeSpaceMembers.length > 4 && (
                            <button className="btn-text-sm" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setIsMembersModalOpen(true)}>
                              Show all members
                            </button>
                          )}
                          {activeSpaceMembers.length <= 4 && (
                            <button className="btn-text-sm" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setIsMembersModalOpen(true)}>
                              {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? 'Manage Members' : 'View Members'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dashboard View */
                <>
                  {/* Navigation */}
                  <section className="nav-section">
                    <div className="container">
                      <div className="nav-content">
                        <div className="nav-tabs">
                          <button
                            className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                          >
                            All
                          </button>
                          <button
                            className={`nav-tab ${activeTab === 'member' ? 'active' : ''}`}
                            onClick={() => setActiveTab('member')}
                          >
                            Member
                          </button>
                          <button
                            className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                          >
                            Favorites
                          </button>
                          <button
                            className={`nav-tab ${activeTab === 'owned' ? 'active' : ''}`}
                            onClick={() => setActiveTab('owned')}
                          >
                            Owned
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div className="filter-wrapper">
                            <select
                              className="status-select"
                              value={activeCategory}
                              onChange={(e) => setActiveCategory(e.target.value)}
                            >
                              <option value="all">All Categories</option>
                              <option value="CREATIVE">Creative</option>
                              <option value="TECH">Tech</option>
                              <option value="EDUCATION">Education</option>
                              <option value="MEETING">Meeting</option>
                            </select>
                          </div>

                          <div className="status-filter">
                            <select
                              className="status-select"
                              value={activeStatus}
                              onChange={(e) => setActiveStatus(e.target.value)}
                            >
                              <option value="all">All Status</option>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>

                          <div className="view-toggle">
                            <button
                              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                              onClick={() => setViewMode('grid')}
                              aria-label="Grid View"
                            >
                              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" />
                              </svg>
                            </button>
                            <button
                              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                              onClick={() => setViewMode('list')}
                              aria-label="List View"
                            >
                              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                              </svg>
                            </button>
                          </div>

                          <div className="search-box">
                            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                              type="text"
                              className="search-input"
                              placeholder="Search"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Spaces Grid */}
                  <section className="spaces-section">
                    <div className="container">
                      {filteredSpaces.length > 0 ? (
                        <div className={viewMode === 'grid' ? "spaces-grid" : "spaces-list"}>
                          {filteredSpaces.map((space, index) => (
                            <div
                              key={space.id}
                              className="space-card fade-in"
                              style={{ animationDelay: `${index * 50}ms` }}
                              onClick={() => setActiveSpace(space)}
                            >
                              <div className="space-thumbnail">
                                <div style={{
                                  width: '100%',
                                  height: '100%',
                                  background: space.thumbnail || `linear-gradient(135deg, 
                                  hsl(${(space.id * 60) % 360}, 70%, 85%) 0%, 
                                  hsl(${(space.id * 60 + 40) % 360}, 70%, 90%) 100%)`,
                                  position: 'relative'
                                }}>
                                  <span className={`space-status-badge ${space.isOnline ? 'status-online' : 'status-offline'}`}>
                                    {space.isOnline ? `online(${space.userCount})` : 'offline'}
                                  </span>

                                  <button
                                    className={`favorite-btn-thumb ${space.isFavorite ? 'active' : ''}`}
                                    onClick={(e) => toggleFavorite(e, space.id)}
                                    title={space.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill={space.isFavorite ? "#ef4444" : "none"}
                                      stroke={space.isFavorite ? "#ef4444" : "white"}
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                  </button>

                                  <div className="space-overlay">
                                    <span className="overlay-text">Click to enter space</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-info">
                                <div className="space-details">
                                  <h1 className="space-name">{space.name}</h1>
                                  <h3 className="space-members">{space.memberCount} members</h3>
                                </div>
                                <div className="space-category">
                                  {space.type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <p className="empty-state-text">
                            Looking for your V1 space?
                            <span className="empty-state-link"> Open V1 dashboard</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Floating Create Button */}
                  <button
                    className="btn btn-primary floating-create-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Space
                  </button>
                </>
              )}


            </>
          )}





          {/* Manage Members Modal */}
          {isMembersModalOpen && (
            <div className="modal-overlay" onClick={() => setIsMembersModalOpen(false)}>
              <div className="modal-content modal-members" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 className="modal-title-sm">
                      {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? 'Manage Members' : 'Members'}
                    </h2>
                    <span className="member-count-badge">{activeSpaceMembers.length} Members</span>
                  </div>
                  <button className="close-btn" onClick={() => setIsMembersModalOpen(false)}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="modal-sub-header">
                  <div className="search-box sm">
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" className="search-input" placeholder="Search members" />
                  </div>

                  <select
                    className="files-filter"
                    value={memberRoleFilter}
                    onChange={(e) => setMemberRoleFilter(e.target.value)}
                    style={{ marginLeft: '10px', height: '38px' }}
                  >
                    <option value="All">All Roles</option>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>

                  {/* Conditionally render the Invite New Members button */}
                  {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                    <button className="btn btn-primary-sm" onClick={() => { setIsMembersModalOpen(false); setIsCreateModalOpen(true); setCreateStep(3); setInviteMode('email'); }} style={{ marginLeft: '10px', padding: '0.5rem' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  )}
                </div>

                <div className="modal-body scrollable members-list-view">
                  {activeSpaceMembers
                    .filter(m => memberRoleFilter === 'All' || m.role === memberRoleFilter)
                    .map(member => (
                      <div key={member.id} className="member-row-large">
                        <div className="member-info-large">
                          <div className="user-avatar" style={{ background: member.avatarColor }}>{member.initials}</div>
                          <div className="member-details">
                            <span className="member-name-lg">{member.name}</span>
                            <span className="member-email-lg">{member.name.toLowerCase().replace(' ', '.')}@example.com</span>
                          </div>
                        </div>
                        <div className="member-actions">
                          {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? (
                            <>
                              <select
                                className="role-select"
                                value={member.role}
                                disabled={member.role === 'Owner'}
                                onChange={(e) => {
                                  const newRole = e.target.value;
                                  if (newRole === 'Owner') {
                                    if (window.confirm(`Transfer ownership to ${member.name}? The current owner will become an Admin.`)) {
                                      setActiveSpaceMembers(prev => prev.map(m => {
                                        if (m.id === member.id) return { ...m, role: 'Owner' };
                                        if (m.role === 'Owner') return { ...m, role: 'Admin' };
                                        return m;
                                      }));
                                    }
                                  } else {
                                    setActiveSpaceMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
                                  }
                                }}
                              >
                                <option value="Owner">Owner</option>
                                <option value="Admin">Admin</option>
                                <option value="Member">Member</option>
                              </select>
                              <button
                                className={`btn-icon-danger ${member.role === 'Owner' ? 'invisible' : ''}`}
                                title="Remove Member"
                                onClick={() => {
                                  if (member.role !== 'Owner') {
                                    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                                      setActiveSpaceMembers(prev => prev.filter(m => m.id !== member.id));
                                    }
                                  }
                                }}
                              >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </>
                          ) : (
                            <span className="member-role" style={{ marginRight: '1rem' }}>{member.role}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload File Modal */}
          {isUploadModalOpen && (
            <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
              <div className="modal-content modal-upload" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setIsUploadModalOpen(false)}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {isUploading ? (
                  <div className="upload-progress-view">
                    <h2 className="upload-title" style={{ marginBottom: '1.5rem' }}>Uploading {uploadQueue.length} files</h2>
                    <div className="upload-list" style={{ maxHeight: '300px', overflowY: 'auto', width: '100%', marginBottom: '1.5rem' }}>
                      {uploadQueue.map(file => (
                        <div key={file.id} className="upload-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                          <div className="file-icon-sm" style={{ color: file.color }}>
                            {file.icon === 'image' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                            {file.icon === 'doc' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                            {file.icon === 'video' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{file.name}</span>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{Math.round(file.progress)}%</span>
                            </div>
                            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${file.progress}%`, height: '100%', background: '#10b981', transition: 'width 0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="upload-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => { setIsUploading(false); setUploadQueue([]); }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleConfirmUpload}
                        disabled={uploadQueue.some(f => f.progress < 100)}
                      >
                        {uploadQueue.some(f => f.progress < 100) ? 'Uploading...' : 'Done'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="upload-dropzone"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <h2 className="upload-title">Drag files here</h2>
                    <p className="upload-subtitle">
                      We support 3D models, images, videos, documents, and more!
                      <button className="btn-icon-subtle" onClick={() => setIsFileTypesOpen(true)} title="View Supported File Types">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                      </button>
                    </p>

                    <div className="upload-divider">
                      <span>or</span>
                    </div>

                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <button
                      className="btn-black-pill"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      Select From Your Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Space Modal */}
          {isCreateModalOpen && (
            <div className="modal-overlay" onClick={handleFinalizeCreate}>
              <div className={`modal-content ${createStep === 2 ? 'modal-wide' : createStep === 3 ? 'modal-compact' : ''}`} onClick={e => e.stopPropagation()}>

                {createStep === 1 && (
                  <>
                    <div className="modal-left">
                      <div className="modal-logo">
                        <div className="logo small">G</div>
                      </div>

                      <div className="modal-form-content">
                        <h2 className="modal-title">Let's build your space 🎉</h2>

                        <div className="form-group">
                          <label className="form-label">Space Name</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Acme Corp"
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="What is this space for?"
                            value={newSpaceDescription}
                            onChange={(e) => setNewSpaceDescription(e.target.value)}
                          />
                        </div>

                        <button
                          className="btn btn-primary btn-block btn-large"
                          onClick={() => setCreateStep(2)}
                          disabled={!newSpaceName.trim()}
                        >
                          Continue
                        </button>
                      </div>
                    </div>

                    <div className="modal-right">
                      <div className="preview-card">
                        <div className="preview-illustration">
                          <div className="preview-mock-user user-1">😁</div>
                          <div className="preview-mock-user user-2">👩‍�</div>
                          <div className="preview-mock-user user-3">�</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {createStep === 2 && (
                  <div className="modal-step-2">
                    <div className="modal-header-step2">
                      <button className="back-btn" onClick={() => setCreateStep(1)}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h2 className="modal-title-center">Select a Template</h2>
                    </div>

                    <div className="templates-grid">
                      {spaceTemplates.map(template => (
                        <div
                          key={template.id}
                          className="template-card"
                          onClick={() => handleCreateConfirm(template)}
                        >
                          <div className="template-thumbnail" style={{ background: template.gradient }}></div>
                          <div className="template-info">
                            <span className="template-name">{template.name}</span>
                            <span className="template-category">{template.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {createStep === 3 && (
                  <div className="modal-step-3">
                    {inviteMode === 'link' ? (
                      <>
                        <div className="invite-icon-wrapper">
                          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>

                        <h2 className="modal-title-center">Invite members with this link</h2>

                        <div className="invite-link-box">
                          <span className="invite-url">https://app.v2.gather.town/app/{Math.random().toString(36).substring(7)}</span>
                          <button className="btn btn-primary btn-sm">Copy</button>
                        </div>

                        <div className="invite-actions">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setInviteMode('email')}
                          >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Invite with email
                          </button>
                          <button className="btn btn-text" onClick={handleFinalizeCreate}>
                            Skip for now
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="invite-icon-wrapper">
                          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h2 className="modal-title-center">Invite members by email</h2>
                        <div className="invite-email-container">
                          <textarea
                            className="invite-textarea"
                            placeholder="example1@email.com, example2@email.com..."
                          ></textarea>

                        </div>
                        <div className="invite-actions">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setInviteMode('link')}
                          >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Invite with link
                          </button>
                          <button className="btn btn-text" onClick={handleFinalizeCreate}>
                            Skip for now
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
          {/* Supported File Types Modal */}
          {isFileTypesOpen && (
            <div className="modal-overlay" onClick={() => setIsFileTypesOpen(false)}>
              <div className="modal-content modal-file-types" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                  <h2 className="modal-title-sm">Supported File Types</h2>
                  <button className="close-btn" onClick={() => setIsFileTypesOpen(false)}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="modal-body scrollable">
                  <div className="file-type-section">
                    <div className="section-header">
                      <h3>3D Files</h3>
                      <p className="section-note">We recommend that you use a maximum texture size of 2048x2048.</p>
                    </div>
                    <div className="file-type-grid">
                      <div className="type-item"><span className="type-label">OBJ</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">glTF</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">GLB</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">FBX</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">DAE</span><span className="type-value">60 MB</span></div>
                      <div className="type-item"><span className="type-label">PCD</span><span className="type-value">10 MB</span></div>
                      <div className="type-item"><span className="type-label">ZIP</span><span className="type-value">500 MB</span></div>
                    </div>
                  </div>

                  <div className="file-type-section">
                    <h3>Videos</h3>
                    <div className="file-type-row">
                      <span className="type-label-row">MP4, GIFs, MKV, MOV, AVI, WEBM</span>
                      <span className="type-value">1000 MB</span>
                    </div>
                  </div>

                  <div className="file-type-section">
                    <h3>Images</h3>
                    <div className="file-type-grid">
                      <div className="type-item"><span className="type-label">PNG</span><span className="type-value">10 MB</span></div>
                      <div className="type-item"><span className="type-label">JPEG</span><span className="type-value">10 MB</span></div>
                      <div className="type-item"><span className="type-label">TIFF</span><span className="type-value">10 MB</span></div>
                    </div>
                  </div>

                  <div className="file-type-section">
                    <h3>Documents</h3>
                    <div className="file-type-grid">
                      <div className="type-item"><span className="type-label">PDF</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">Microsoft Word .docx</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">Microsoft Powerpoint .pptx</span><span className="type-value">100 MB</span></div>
                      <div className="type-item"><span className="type-label">Microsoft Excel .xlsx</span><span className="type-value">100 MB</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div >
      {/* Switch User Simulation Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          padding: '10px 20px',
          background: '#1f2937',
          color: 'white',
          borderRadius: '30px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }}
        onClick={() => {
          const currentIndex = activeSpaceMembers.findIndex(m => m.id === currentUserId);
          const nextIndex = (currentIndex + 1) % activeSpaceMembers.length;
          setCurrentUserId(activeSpaceMembers[nextIndex].id);
        }}
      >
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: currentUser.role === 'Owner' ? '#10b981' : '#f59e0b'
        }}></div>
        {currentUser.name} ({currentUser.role})
      </button>
    </div>
  );
}

export default App;

