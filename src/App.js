import { useState, useRef, useEffect } from 'react';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import DebugMenu from './components/common/DebugMenu';
import SpacesDashboard from './components/features/dashboard/SpacesDashboard';
import SpaceDetails from './components/features/space/SpaceDetails';
import ChatView from './components/features/chat/ChatView';
import SessionView from './components/features/session/SessionView';
import NotificationsView from './components/features/notifications/NotificationsView';
import HomeView from './components/features/home/HomeView';
import CreateSpaceModal from './components/modals/CreateSpaceModal';
import MembersModal from './components/modals/MembersModal';
import UploadModal from './components/modals/UploadModal';
import FileTypesModal from './components/modals/FileTypesModal';
import ProfileModal from './components/modals/ProfileModal';
import SearchModal from './components/modals/SearchModal';
import DeviceSettingsModal from './components/modals/DeviceSettingsModal';
import SpaceSettingsModal from './components/modals/SpaceSettingsModal';
import LoginPage from './components/auth/LoginPage';
import { authApi, spacesApi, notificationsApi, messagesApi, spaceMembersApi } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [inviteMode, setInviteMode] = useState('link');
  const [activeNav, setActiveNav] = useState('spaces');
  const [activeSpace, setActiveSpace] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('collabspace_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { id: 1, name: "John Doe", role: "Owner", initials: "JD", avatarColor: "#3b82f6" };
      }
    }
    return { id: 1, name: "John Doe", role: "Owner", initials: "JD", avatarColor: "#3b82f6" };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('collabspace_user') !== null;
  });

  const [notifications, setNotifications] = useState([]);

  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: "Sarah Chen", text: "Hey team! Just uploaded the new designs for review.", time: "10:30 AM", type: "user", avatarColor: "#10b981" },
      { id: 2, sender: "System", text: "uploaded 'Design_v2.fig'", time: "10:30 AM", type: "system" },
      { id: 3, sender: "Mike Ross", text: "Thanks Sarah! I'll take a look shortly.", time: "10:32 AM", type: "user", avatarColor: "#f59e0b" }
    ]
  });
  const [newMessage, setNewMessage] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState('files');
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeSpaceMembers, setActiveSpaceMembers] = useState([]);
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');
  const [activeFileFilter, setActiveFileFilter] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isFileTypesOpen, setIsFileTypesOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  // New modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] = useState(false);
  const [isSpaceSettingsOpen, setIsSpaceSettingsOpen] = useState(false);
  const [userStatus, setUserStatus] = useState('online'); // online, away, dnd, offline

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock Data
  const [files, setFiles] = useState([
    { name: 'Project_Specs.pdf', type: 'PDF', size: '2.4 MB', time: '2h ago', icon: 'doc', color: '#ef4444' },
    { name: 'Lobby_Render_Final.png', type: 'PNG', size: '14.2 MB', time: '4h ago', icon: 'image', color: '#3b82f6' },
    { name: 'Walkthrough_v3.mp4', type: 'MP4', size: '45.8 MB', time: '1d ago', icon: 'video', color: '#10b981' },
    { name: 'Assets_Bundle.zip', type: 'ZIP', size: '156 MB', time: '2d ago', icon: '3d', color: '#f59e0b' },
    { name: 'Meeting_Notes.docx', type: 'DOCX', size: '15 KB', time: '3d ago', icon: 'doc', color: '#3b82f6' },
  ]);

  const [spaces, setSpaces] = useState([]);

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn && currentUser?.id) {
      // Fetch spaces
      spacesApi.getAll()
        .then(data => setSpaces(data))
        .catch(err => console.error('Failed to fetch spaces:', err));

      // Fetch notifications
      notificationsApi.getAll(currentUser.id)
        .then(data => setNotifications(data))
        .catch(err => console.error('Failed to fetch notifications:', err));
    }
  }, [isLoggedIn, currentUser?.id]);

  // Fetch members when activeSpace changes
  useEffect(() => {
    if (activeSpace?.id) {
      spaceMembersApi.getBySpace(activeSpace.id)
        .then(data => setActiveSpaceMembers(data))
        .catch(err => console.error('Failed to fetch space members:', err));
    } else {
      setActiveSpaceMembers([]);
    }
  }, [activeSpace?.id]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Add notification helper
  const addNotification = (type, author, text, target) => {
    const newNotif = {
      id: Date.now(),
      type,
      author,
      text,
      target,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleJoinSession = () => {
    // Show device settings modal first
    setIsDeviceSettingsOpen(true);
  };

  const handleConfirmJoinSession = () => {
    setIsDeviceSettingsOpen(false);
    setIsSessionLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsSessionLoading(false);
      setIsSessionActive(true);
    }, 2000);
  };

  const handleLeaveSession = () => {
    setIsSessionActive(false);
  };

  const handleFileUpload = (uploadedFiles) => {
    const newQueue = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      progress: 0,
      icon: file.type.includes('image') ? 'image' : file.type.includes('video') ? 'video' : 'doc',
      color: '#6b7280'
    }));
    setUploadQueue(newQueue);
    setIsUploading(true);

    // Simulate upload progress
    newQueue.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadQueue(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
      }, 500);
    });
  };

  const handleConfirmUpload = () => {
    const completedFiles = uploadQueue.filter(f => f.progress === 100).map(f => ({
      name: f.name,
      type: f.name.split('.').pop().toUpperCase(),
      size: '2.0 MB', // Mock size
      time: 'Just now',
      icon: f.icon,
      color: f.icon === 'image' ? '#3b82f6' : '#10b981'
    }));

    setFiles(prev => [...completedFiles, ...prev]);
    setUploadQueue([]);
    setIsUploading(false);
    setIsUploadModalOpen(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSpace) return;

    // Parse @mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = newMessage.match(mentionRegex) || [];

    const msgData = {
      sender: currentUser.name,
      senderId: currentUser.id,
      text: newMessage,
      type: 'user',
      avatarColor: currentUser.avatarColor,
      avatarImage: currentUser.avatarImage || null,
      mentions: mentions.map(m => m.substring(1))
    };

    // Save to backend
    try {
      const savedMsg = await messagesApi.send(activeSpace.id, msgData);
      setChatMessages(prev => ({
        ...prev,
        [activeSpace.id]: [...(prev[activeSpace.id] || []), savedMsg]
      }));

      // Create notifications for mentions
      mentions.forEach(mention => {
        notificationsApi.create({
          userId: currentUser.id,
          type: 'mention',
          author: currentUser.name,
          text: 'mentioned you in',
          target: activeSpace.name
        });
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      // Fallback to local
      const msg = { id: Date.now(), ...msgData, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => ({
        ...prev,
        [activeSpace.id]: [...(prev[activeSpace.id] || []), msg]
      }));
    }

    setNewMessage('');
  };

  const handleCreateConfirm = async (template) => {
    const spaceData = {
      name: newSpaceName,
      thumbnail: template.gradient,
      type: template.category,
      category: template.category,
      description: newSpaceDescription,
      ownerId: currentUser.id
    };
    console.log(spaceData);

    try {
      const newSpace = await spacesApi.create(spaceData);
      setSpaces(prev => [newSpace, ...prev]);
      setActiveSpace(newSpace);
    } catch (err) {
      console.error('Failed to create space:', err);
      // Fallback to local
      const localSpace = { id: Date.now(), ...spaceData, lastVisited: 'Just now', isOnline: true, userCount: 0, memberCount: 1, isFavorite: false };
      setSpaces(prev => [localSpace, ...prev]);
    }
    setCreateStep(3);
  };

  const handleFinalizeCreate = () => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewSpaceName('');
    setNewSpaceDescription('');
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setSpaces(spaces.map(space =>
      space.id === id ? { ...space, isFavorite: !space.isFavorite } : space
    ));
  };


  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'favorites' && space.isFavorite) ||
      (activeTab === 'owned' && currentUser.role === 'Owner') || // Simplified logic
      (activeTab === 'member'); // Simplified logic

    const matchesStatus = activeStatus === 'all' ||
      (activeStatus === 'online' && space.isOnline) ||
      (activeStatus === 'offline' && !space.isOnline);

    const matchesCategory = activeCategory === 'all' || space.category === activeCategory;

    return matchesSearch && matchesTab && matchesStatus && matchesCategory;
  });

  // Auth handlers
  const handleLogin = async (email, password, name = null) => {
    try {
      let user;
      if (name) {
        // Signup
        user = await authApi.register(name, email, password);
      } else {
        // Login
        user = await authApi.login(email, password);
      }
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('collabspace_user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('collabspace_user');
    setCurrentUser({ id: 1, name: "John Doe", role: "Owner", initials: "JD", avatarColor: "#3b82f6" });
  };

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (isSessionLoading) {
    return (
      <div className="session-loading">
        <div className="loading-spinner"></div>
        <h2 className="loading-text">Joining {activeSpace?.name}...</h2>
        <p className="loading-subtext">Loading environment...</p>
      </div>
    )
  }

  if (isSessionActive) {
    return (
      <SessionView
        activeSpace={activeSpace}
        currentUser={currentUser}
        handleLeaveSession={handleLeaveSession}
        chatMessages={chatMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    );
  }

  const handleInvite = async (emails) => {
    if (activeSpace?.id) {
      try {
        const result = await spaceMembersApi.invite(activeSpace.id, emails, currentUser.name, currentUser.id);
        alert(`Invitations sent to ${result.invited} user(s)! They will be notified.`);
      } catch (err) {
        console.error('Failed to invite:', err);
        alert('Failed to send invitations.');
      }
    }
  };

  return (
    <div className="App">
      <div className="app-layout">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          currentUser={currentUser}
          setIsProfileModalOpen={setIsProfileModalOpen}
          onLogout={handleLogout}
        />

        <main className="app-main">
          {activeNav === 'chats' && (
            <ChatView
              chatSearchQuery={chatSearchQuery}
              setChatSearchQuery={setChatSearchQuery}
              spaces={spaces}
              activeSpace={activeSpace}
              setActiveSpace={setActiveSpace}
              chatMessages={chatMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          )}

          {activeNav === 'home' && (
            <HomeView
              currentUser={currentUser}
              spaces={spaces}
              notifications={notifications}
              setActiveNav={setActiveNav}
              setActiveSpace={setActiveSpace}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          )}

          {activeNav === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
            />
          )}

          {activeNav === 'spaces' && (
            activeSpace ? (
              <SpaceDetails
                space={activeSpace}
                setActiveSpace={setActiveSpace}
                currentUser={currentUser}
                activeDetailTab={activeDetailTab}
                setActiveDetailTab={setActiveDetailTab}
                files={files}
                activeFileFilter={activeFileFilter}
                setActiveFileFilter={setActiveFileFilter}
                setIsFileTypesOpen={setIsFileTypesOpen}
                setIsUploadModalOpen={setIsUploadModalOpen}
                setIsMembersModalOpen={setIsMembersModalOpen}
                activeSpaceMembers={activeSpaceMembers}
                handleJoinSession={handleJoinSession}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setCreateStep={setCreateStep}
                setInviteMode={setInviteMode}
                setIsSpaceSettingsOpen={setIsSpaceSettingsOpen}
              />
            ) : (
              <SpacesDashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredSpaces={filteredSpaces}
                setActiveSpace={setActiveSpace}
                toggleFavorite={toggleFavorite}
                setIsCreateModalOpen={setIsCreateModalOpen}
              />
            )
          )}

          <CreateSpaceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            createStep={createStep}
            setCreateStep={setCreateStep}
            newSpaceName={newSpaceName}
            setNewSpaceName={setNewSpaceName}
            newSpaceDescription={newSpaceDescription}
            setNewSpaceDescription={setNewSpaceDescription}
            handleCreateConfirm={handleCreateConfirm}
            inviteMode={inviteMode}
            setInviteMode={setInviteMode}
            handleFinalizeCreate={handleFinalizeCreate}
            activeSpace={activeSpace}
            onInvite={handleInvite}
          />

          <MembersModal
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            activeSpaceMembers={activeSpaceMembers}
            setActiveSpaceMembers={setActiveSpaceMembers}
            currentUser={currentUser}
            memberRoleFilter={memberRoleFilter}
            setMemberRoleFilter={setMemberRoleFilter}
            setIsCreateModalOpen={setIsCreateModalOpen}
            setCreateStep={setCreateStep}
            setInviteMode={setInviteMode}
          />

          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            uploadQueue={uploadQueue}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setUploadQueue={setUploadQueue}
            handleConfirmUpload={handleConfirmUpload}
            setIsFileTypesOpen={setIsFileTypesOpen}
          />

          <FileTypesModal
            isOpen={isFileTypesOpen}
            onClose={() => setIsFileTypesOpen(false)}
          />

          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onLogout={handleLogout}
          />

          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            spaces={spaces}
            activeSpaceMembers={activeSpaceMembers}
            setActiveSpace={setActiveSpace}
            setActiveNav={setActiveNav}
          />

          <DeviceSettingsModal
            isOpen={isDeviceSettingsOpen}
            onClose={() => setIsDeviceSettingsOpen(false)}
            onJoin={handleConfirmJoinSession}
          />

          <SpaceSettingsModal
            isOpen={isSpaceSettingsOpen}
            onClose={() => setIsSpaceSettingsOpen(false)}
            space={activeSpace}
            onSpaceUpdate={(updatedSpace) => {
              setSpaces(prev => prev.map(s => s.id === updatedSpace.id ? updatedSpace : s));
              setActiveSpace(updatedSpace);
            }}
            onSpaceDelete={(spaceId) => {
              setSpaces(prev => prev.filter(s => s.id !== spaceId));
              setActiveSpace(null);
            }}
            isOwner={activeSpaceMembers.find(m => m.userId === currentUser.id)?.role === 'Owner'}
          />

        </main>

        <DebugMenu
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activeSpaceMembers={activeSpaceMembers}
        />
      </div>
    </div>
  );
}

export default App;
