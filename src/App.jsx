import React, { useState, useEffect, useRef } from 'react';

// Data
import { INITIAL_SPACES, SPACE_TEMPLATES, INITIAL_CHAT_HISTORY } from './data/mockData.jsx';
import { getFileIcon } from './shared/utils/helpers.jsx';

// Shared Components
import Sidebar from './shared/components/Sidebar';

// Feature: Spaces
import DashboardView from './features/spaces/DashboardView';
import SpaceDetailsView from './features/spaces/SpaceDetailsView';
import CreateSpaceModal from './features/spaces/CreateSpaceModal';

// Feature: Chat
import ChatView from './features/chat/ChatView';

// Feature: Files
import useFileUpload from './features/files/hooks/useFileUpload';
import FilesModal from './features/files/FilesModal';
import FilePreviewModal from './features/files/FilePreviewModal';

// Feature: Members
import InviteModal from './features/members/InviteModal';
import MembersModal from './features/members/MembersModal';
import TeamView from './features/members/TeamView';

// Feature: Settings
import SettingsModal from './features/settings/SettingsModal';

// Feature: Session (3D World)
import UnitySessionView from './features/session/UnitySessionView';

export default function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSpace, setActiveSpace] = useState(null);
  const [activeChatSpace, setActiveChatSpace] = useState(null);

  // --- Dashboard Filters State ---
  const [activeTab, setActiveTab] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // --- Chat State ---
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState(INITIAL_CHAT_HISTORY);
  const messagesEndRef = useRef(null);

  // --- Modals State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [createdSpaceLink, setCreatedSpaceLink] = useState('');

  // File Mgmt
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [fileFilter, setFileFilter] = useState('all');

  // Invite & Settings
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [unityLoadingProgress, setUnityLoadingProgress] = useState(0);
  const [inviteStatus, setInviteStatus] = useState('idle');
  const [inviteEmail, setInviteEmail] = useState('');

  // --- Spaces Data ---
  const [spaces, setSpaces] = useState(INITIAL_SPACES);

  // --- File Upload Hook ---
  const {
    uploadState,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    triggerFileUpload
  } = useFileUpload({ activeSpace, setActiveSpace, setSpaces });

  // --- Logic Helpers ---
  const currentMessages = activeChatSpace ? (chatHistory[activeChatSpace.id] || []) : [];

  useEffect(() => {
    if (currentView === 'chat' && activeChatSpace) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, currentView, activeChatSpace]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !activeChatSpace) return;
    const newMessage = {
      id: Date.now(),
      user: 'Maryam',
      avatarColor: 'bg-pink-200',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setChatHistory(prev => ({
      ...prev,
      [activeChatSpace.id]: [...(prev[activeChatSpace.id] || []), newMessage]
    }));
    setChatInput('');
  };

  const handleCreateConfirm = (template) => {
    const newId = spaces.length + 1;
    const newSpace = {
      id: newId,
      name: newSpaceName,
      thumbnail: template.gradient,
      type: template.category,
      isOnline: true,
      userCount: 1,
      memberCount: 1,
      isFavorite: false,
      description: newSpaceDescription || "A brand new shiny space!",
      files: [],
      members: [{ id: 1, name: 'Maryam', role: 'Owner', avatar: 'bg-pink-200' }]
    };
    setSpaces([...spaces, newSpace]);
    setChatHistory(prev => ({ ...prev, [newId]: [] }));
    setCreatedSpaceLink(`https://gathering.fun/space/${Math.random().toString(36).substring(7)}`);
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

  const enterSpace = (space) => {
    setActiveSpace(space);
    setCurrentView('space-details');
  };

  const enterChatLobby = () => {
    setCurrentView('chat');
    setActiveChatSpace(null);
  };

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTab = true;
    if (activeTab === 'favorites') matchesTab = space.isFavorite;
    let matchesStatus = true;
    if (activeStatus === 'online') matchesStatus = space.isOnline;
    if (activeStatus === 'offline') matchesStatus = !space.isOnline;
    let matchesCategory = true;
    if (activeCategory !== 'all') matchesCategory = space.type === activeCategory;
    return matchesSearch && matchesTab && matchesStatus && matchesCategory;
  });

  const enterUnityWorld = () => {
    // Simulate loading
    setUnityLoadingProgress(0);
    setCurrentView('unity-view');
    const interval = setInterval(() => {
      setUnityLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Invite Logic
  const handleCopyLink = () => {
    setInviteStatus('generating');
    setTimeout(() => {
      setInviteStatus('copied');
      setTimeout(() => setInviteStatus('idle'), 3000);
    }, 1000);
  };

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
      setInviteEmail('');
      setTimeout(() => setInviteStatus('idle'), 2000);
    }, 1000);
  };

  const handleRoleChange = (memberId, newRole) => {
    setSpaces(prev => prev.map(s => {
      if (s.id === activeSpace.id) {
        const updatedMembers = s.members.map(m => m.id === memberId ? { ...m, role: newRole } : m);
        const updatedSpace = { ...s, members: updatedMembers };
        setActiveSpace(updatedSpace);
        return updatedSpace;
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans text-gray-900 selection:bg-pink-300 selection:text-black relative overflow-x-hidden">

      {/* --- Custom Scrollbar Styles --- */}
      <style>{`
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-left: 2px solid black;
        }
        ::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border: 2px solid black;
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>

      {/* --- Sidebar --- */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        enterChatLobby={enterChatLobby}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      {/* --- Main Content Area --- */}
      <main className="md:ml-28 p-4 md:p-8 min-h-screen transition-all duration-300">

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <DashboardView
            filteredSpaces={filteredSpaces}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            toggleFavorite={toggleFavorite}
            enterSpace={enterSpace}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* VIEW: SPACE DETAILS */}
        {currentView === 'space-details' && activeSpace && (
          <SpaceDetailsView
            activeSpace={activeSpace}
            onBack={() => setCurrentView('dashboard')}
            onLaunchUnity={enterUnityWorld}
            onTextChat={() => { setActiveChatSpace(activeSpace); setCurrentView('chat'); }}
            onInvite={() => setIsInviteModalOpen(true)}
            onFilesClick={() => setIsFilesModalOpen(true)}
            onMembersClick={() => setIsMembersModalOpen(true)}
            getFileIcon={getFileIcon}
            setViewingFile={setViewingFile}
          />
        )}

        {/* VIEW: CHAT */}
        {currentView === 'chat' && (
          <ChatView
            spaces={spaces}
            activeChatSpace={activeChatSpace}
            setActiveChatSpace={setActiveChatSpace}
            currentMessages={currentMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
        )}

        {/* VIEW: TEAM */}
        {currentView === 'team' && <TeamView />}

        {/* VIEW: UNITY SESSION */}
        {currentView === 'unity-view' && (
          <UnitySessionView
            loadingProgress={unityLoadingProgress}
            onLeave={() => setCurrentView('space-details')}
          />
        )}

      </main>

      {/* --- MODALS --- */}

      <FilesModal
        isOpen={isFilesModalOpen}
        onClose={() => setIsFilesModalOpen(false)}
        activeSpace={activeSpace}
        fileFilter={fileFilter}
        setFileFilter={setFileFilter}
        uploadState={uploadState}
        uploadProgress={uploadProgress}
        triggerFileUpload={triggerFileUpload}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        getFileIcon={getFileIcon}
        setViewingFile={setViewingFile}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        activeSpace={activeSpace}
        inviteStatus={inviteStatus}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        onCopyLink={handleCopyLink}
        onSendInvite={handleSendInvite}
      />

      <FilePreviewModal
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />

      <CreateSpaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        createStep={createStep}
        setCreateStep={setCreateStep}
        newSpaceName={newSpaceName}
        setNewSpaceName={setNewSpaceName}
        newSpaceDescription={newSpaceDescription}
        setNewSpaceDescription={setNewSpaceDescription}
        spaceTemplates={SPACE_TEMPLATES}
        createdSpaceLink={createdSpaceLink}
        onConfirm={handleCreateConfirm}
        onFinalize={handleFinalizeCreate}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
      />

      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        activeSpace={activeSpace}
        onRoleChange={handleRoleChange}
      />

    </div>
  );
}