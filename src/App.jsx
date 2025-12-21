import React, { useState, useEffect, useRef } from 'react';

// Data & API
import { SPACE_TEMPLATES, INITIAL_CHAT_HISTORY } from './data/mockData.jsx';
import { getFileIcon } from './shared/utils/helpers.jsx';
import api from './services/api';
import { useSpaces, useMessages } from './hooks/useApi';
import { useAuthContext } from './context/AuthContext.jsx';

// Shared Components
import Sidebar from './shared/components/Sidebar';

// Feature: Auth
import AuthPage from './features/auth/AuthPage';

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
  // --- Auth Context ---
  const { user, isAuthenticated, login, register, logout, loading: authLoading, error: authError } = useAuthContext();

  // --- Global State ---
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSpace, setActiveSpace] = useState(null);
  const [activeChatSpace, setActiveChatSpace] = useState(null);

  // --- Dashboard Filters State ---
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // --- Chat State ---
  const [chatInput, setChatInput] = useState('');
  const [localChatHistory, setLocalChatHistory] = useState(INITIAL_CHAT_HISTORY);
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

  // User favorites (user-specific)
  const [userFavorites, setUserFavorites] = useState([]);
  const currentUserId = user?.id || 'user-1'; // Use authenticated user's ID

  const {
    spaces,
    loading: spacesLoading,
    error: spacesError,
    createSpace,
    setSpaces
  } = useSpaces();

  // --- API Integration: Messages ---
  const {
    messages: apiMessages,
    sendMessage: apiSendMessage,
    refetch: refetchMessages
  } = useMessages(activeChatSpace?.id);

  // --- File Upload Hook ---
  const {
    uploadState,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    triggerFileUpload
  } = useFileUpload({ activeSpace, setActiveSpace, setSpaces });

  // --- Merge API messages with local fallback ---
  const currentMessages = activeChatSpace
    ? (apiMessages.length > 0 ? apiMessages : (localChatHistory[activeChatSpace.id] || []))
    : [];

  useEffect(() => {
    if (currentView === 'chat' && activeChatSpace) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, currentView, activeChatSpace]);

  // Refetch messages when switching chat spaces
  useEffect(() => {
    if (activeChatSpace?.id) {
      refetchMessages();
    }
  }, [activeChatSpace?.id, refetchMessages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !activeChatSpace) return;

    const messageData = {
      user: 'Maryam',
      avatarColor: 'bg-pink-200',
      text: chatInput,
      isMe: true
    };

    try {
      // Try API first
      await apiSendMessage(messageData);
    } catch (err) {
      // Fallback to local state
      const newMessage = {
        id: Date.now(),
        ...messageData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLocalChatHistory(prev => ({
        ...prev,
        [activeChatSpace.id]: [...(prev[activeChatSpace.id] || []), newMessage]
      }));
    }

    setChatInput('');
  };

  const handleCreateConfirm = async (template) => {
    const spaceData = {
      name: newSpaceName,
      thumbnail: template.gradient,
      category: template.category,
      description: newSpaceDescription || "A brand new shiny space!",
      files: [],
      members: [{ memberId: 'm1', userId: 'u1', name: 'Maryam', username: 'maryam', role: 'Owner', avatarColor: '#ec4899' }]
    };

    try {
      // Try API first
      await createSpace(spaceData);
    } catch (err) {
      // Fallback to local state
      const newId = spaces.length + 1;
      const newSpace = {
        id: newId,
        ...spaceData,
      };
      setSpaces(prev => [...prev, newSpace]);
      setLocalChatHistory(prev => ({ ...prev, [newId]: [] }));
    }

    setCreatedSpaceLink(`https://gathering.fun/space/${Math.random().toString(36).substring(7)}`);
    setCreateStep(3);
  };

  const handleFinalizeCreate = () => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewSpaceName('');
    setNewSpaceDescription('');
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
    if (activeTab === 'favorites') matchesTab = userFavorites.includes(space.id);
    let matchesCategory = true;
    if (activeCategory !== 'all') matchesCategory = space.category === activeCategory;
    let matchesStatus = true;
    if (activeStatus === 'online') matchesStatus = space.isOnline === true;
    if (activeStatus === 'offline') matchesStatus = space.isOnline === false;
    return matchesSearch && matchesTab && matchesCategory && matchesStatus;
  });

  // Fetch user favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await api.users.getFavorites(currentUserId);
        setUserFavorites(favs);
      } catch (err) {
        console.log('Could not fetch favorites');
      }
    };
    fetchFavorites();
  }, [currentUserId]);

  const handleToggleFavorite = async (spaceId) => {
    try {
      const result = await api.users.toggleFavorite(currentUserId, spaceId);
      if (result.isFavorite) {
        setUserFavorites(prev => [...prev, spaceId]);
      } else {
        setUserFavorites(prev => prev.filter(id => id !== spaceId));
      }
    } catch (err) {
      // Optimistic toggle for offline support
      setUserFavorites(prev =>
        prev.includes(spaceId)
          ? prev.filter(id => id !== spaceId)
          : [...prev, spaceId]
      );
    }
  };

  const enterUnityWorld = () => {
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

  // Invite Logic - with API integration
  const handleCopyLink = () => {
    setInviteStatus('generating');
    setTimeout(() => {
      setInviteStatus('copied');
      setTimeout(() => setInviteStatus('idle'), 3000);
    }, 1000);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !activeSpace) return;
    setInviteStatus('sending');

    try {
      await api.members.invite(activeSpace.id, {
        emails: [inviteEmail],
        inviterName: 'Maryam',
        inviterId: 'current-user-id'
      });
      setInviteStatus('sent');
      setInviteEmail('');
      setTimeout(() => setInviteStatus('idle'), 2000);
    } catch (err) {
      // Fallback - just show success
      setInviteStatus('sent');
      setInviteEmail('');
      setTimeout(() => setInviteStatus('idle'), 2000);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!activeSpace) return;

    try {
      await api.members.updateRole(activeSpace.id, memberId, newRole);
    } catch (err) {
      // Fallback to local state
    }

    setSpaces(prev => prev.map(s => {
      if (s.id === activeSpace.id) {
        const updatedMembers = s.members?.map(m => m.id === memberId ? { ...m, role: newRole } : m) || [];
        const updatedSpace = { ...s, members: updatedMembers };
        setActiveSpace(updatedSpace);
        return updatedSpace;
      }
      return s;
    }));
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={login}
        onRegister={register}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans text-gray-900 selection:bg-pink-300 selection:text-black relative overflow-x-hidden">

      {/* Custom Scrollbar Styles */}
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

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        enterChatLobby={enterChatLobby}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        user={user}
      />

      {/* Main Content Area */}
      <main className="md:ml-28 p-4 md:p-8 min-h-screen transition-all duration-300">

        {/* Loading State */}
        {spacesLoading && currentView === 'dashboard' && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-black border-t-yellow-300 rounded-full"></div>
          </div>
        )}

        {/* Error State */}
        {spacesError && currentView === 'dashboard' && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-4 text-red-700">
            <p className="font-bold">⚠️ Could not connect to server</p>
            <p className="text-sm">Using local data instead.</p>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && !spacesLoading && (
          <DashboardView
            filteredSpaces={filteredSpaces}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            enterSpace={enterSpace}
            onCreateClick={() => setIsCreateModalOpen(true)}
            userFavorites={userFavorites}
            onToggleFavorite={handleToggleFavorite}
            userName={user?.name}
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

      {/* MODALS */}

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
        user={user}
        onLogout={logout}
        onUpdateProfile={async (data) => {
          // Update profile via API
          try {
            const updated = await api.users.update(user.id, data);
            // Refresh user in localStorage
            localStorage.setItem('collabspace_user', JSON.stringify(updated));
            window.location.reload(); // Simple refresh to update context
          } catch (err) {
            console.error('Failed to update profile:', err);
          }
        }}
        onDeleteAccount={async () => {
          try {
            await api.users.delete(user.id);
            logout();
          } catch (err) {
            console.error('Failed to delete account:', err);
          }
        }}
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