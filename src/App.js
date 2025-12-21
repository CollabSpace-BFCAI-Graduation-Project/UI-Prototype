import { useState, useRef, useEffect } from 'react';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import DebugMenu from './components/common/DebugMenu';
import SpacesDashboard from './components/features/dashboard/SpacesDashboard';
import SpaceDetails from './components/features/space/SpaceDetails';
import ChatView from './components/features/chat/ChatView';
import SessionView from './components/features/session/SessionView';
import CreateSpaceModal from './components/modals/CreateSpaceModal';
import MembersModal from './components/modals/MembersModal';
import UploadModal from './components/modals/UploadModal';
import FileTypesModal from './components/modals/FileTypesModal';

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
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "John Doe",
    role: "Owner",
    initials: "JD",
    avatarColor: "#3b82f6"
  });
  // ... (keeping other lines same is hard with replace_file_content if I want non-contiguous changes)
  // I will have to do this in two steps or use MultiReplace.

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
  const [activeSpaceMembers, setActiveSpaceMembers] = useState([
    { id: 1, name: "John Doe", role: "Owner", initials: "JD", avatarColor: "#3b82f6" },
    { id: 2, name: "Sarah Chen", role: "Admin", initials: "SC", avatarColor: "#10b981" },
    { id: 3, name: "Mike Ross", role: "Member", initials: "MR", avatarColor: "#f59e0b" },
    { id: 4, name: "Jessica Day", role: "Member", initials: "JD", avatarColor: "#ec4899" },
    { id: 5, name: "Tom Wilson", role: "Member", initials: "TW", avatarColor: "#8b5cf6" },
  ]);
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');
  const [activeFileFilter, setActiveFileFilter] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isFileTypesOpen, setIsFileTypesOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  // Mock Data
  const [files, setFiles] = useState([
    { name: 'Project_Specs.pdf', type: 'PDF', size: '2.4 MB', time: '2h ago', icon: 'doc', color: '#ef4444' },
    { name: 'Lobby_Render_Final.png', type: 'PNG', size: '14.2 MB', time: '4h ago', icon: 'image', color: '#3b82f6' },
    { name: 'Walkthrough_v3.mp4', type: 'MP4', size: '45.8 MB', time: '1d ago', icon: 'video', color: '#10b981' },
    { name: 'Assets_Bundle.zip', type: 'ZIP', size: '156 MB', time: '2d ago', icon: '3d', color: '#f59e0b' },
    { name: 'Meeting_Notes.docx', type: 'DOCX', size: '15 KB', time: '3d ago', icon: 'doc', color: '#3b82f6' },
  ]);

  const [spaces, setSpaces] = useState([
    { id: 1, name: "Acme Corp HQ", thumbnail: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", lastVisited: "2 mins ago", type: "Office", isOnline: true, userCount: 12, memberCount: 24, isFavorite: true, category: 'TECH' },
    { id: 2, name: "Design Weekly", thumbnail: "linear-gradient(135deg, #10b981 0%, #059669 100%)", lastVisited: "2 hours ago", type: "Meeting", isOnline: false, userCount: 0, memberCount: 8, isFavorite: false, category: 'CREATIVE' },
    { id: 3, name: "Project Alpha", thumbnail: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", lastVisited: "1 day ago", type: "Project", isOnline: true, userCount: 3, memberCount: 15, isFavorite: true, category: 'TECH' },
    { id: 4, name: "Chill Zone", thumbnail: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", lastVisited: "3 days ago", type: "Social", isOnline: true, userCount: 8, memberCount: 42, isFavorite: false, category: 'MEETING' },
    { id: 5, name: "Town Hall", thumbnail: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", lastVisited: "1 week ago", type: "Event", isOnline: false, userCount: 0, memberCount: 150, isFavorite: false, category: 'MEETING' },
    { id: 6, name: "Dev Standup", thumbnail: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", lastVisited: "1 week ago", type: "Meeting", isOnline: true, userCount: 5, memberCount: 12, isFavorite: true, category: 'TECH' },
  ]);

  const handleJoinSession = () => {
    setIsSessionLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsSessionLoading(false);
      setIsSessionActive(true);
    }, 2000);
  };

  const handleLeaveSession = () => {
    if (window.confirm("Are you sure you want to leave the session?")) {
      setIsSessionActive(false);
    }
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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeSpace) return;
    const msg = {
      id: Date.now(),
      sender: "You", // In real app, use currentUser.name
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
      avatarColor: currentUser.avatarColor
    };
    setChatMessages(prev => ({
      ...prev,
      [activeSpace.id]: [...(prev[activeSpace.id] || []), msg]
    }));
    setNewMessage('');
  };

  const handleCreateConfirm = (template) => {
    // Logic to create space from template
    const newSpace = {
      id: Date.now(),
      name: newSpaceName,
      thumbnail: template.gradient,
      lastVisited: "Just now",
      type: template.category, // Simplification
      isOnline: true,
      userCount: 0,
      memberCount: 1,
      isFavorite: false,
      category: template.category,
      description: newSpaceDescription
    };
    setSpaces(prev => [newSpace, ...prev]);
    setCreateStep(3); // Go to Invite step
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

  return (
    <div className="App">
      <div className="app-layout">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          currentUser={currentUser}
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
