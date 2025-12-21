import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Grid, List, Plus, Heart, Users, Monitor, 
  Coffee, BookOpen, Zap, X, ArrowLeft, Copy, Mail, 
  MoreVertical, Smile, Send, Bug, MessageSquare, Settings,
  Hash, Bell, FileText, Image as ImageIcon, Film, Download,
  UploadCloud, Eye, CheckCircle2, Loader2, Gamepad2, Shield,
  MoreHorizontal, Moon, Sun, Globe, User, BellRing
} from 'lucide-react';

export default function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'chat', 'space-details', 'team', 'unity-view'
  const [activeSpace, setActiveSpace] = useState(null); 
  const [activeChatSpace, setActiveChatSpace] = useState(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  
  // --- App Appearance State ---
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  const [language, setLanguage] = useState('english');

  // --- Dashboard Filters State ---
  const [activeTab, setActiveTab] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // --- Chat State ---
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState({
    1: [ 
      { id: 1, user: 'Alex', avatarColor: 'bg-purple-300', text: 'Hey team! Anyone up for a coffee break? ☕️', time: '10:42 AM', isMe: false },
      { id: 2, user: 'Sarah', avatarColor: 'bg-green-300', text: 'I need 5 mins then I am in!', time: '10:43 AM', isMe: false },
    ],
    2: [
      { id: 1, user: 'Mike', avatarColor: 'bg-blue-300', text: 'Just uploaded the new logo vector. Check files tab!', time: '09:00 AM', isMe: false },
      { id: 2, user: 'Maryam', avatarColor: 'bg-pink-200', text: 'Got it, looks sharp! 🎨', time: '09:15 AM', isMe: true },
    ],
    3: [
      { id: 1, user: 'DevBot', avatarColor: 'bg-gray-300', text: 'Build failed: error in main.js line 42 🐛', time: '11:00 AM', isMe: false },
      { id: 2, user: 'Alex', avatarColor: 'bg-purple-300', text: 'On it. Looking into the CI pipeline now.', time: '11:02 AM', isMe: false },
    ]
  });
  const messagesEndRef = useRef(null);

  // --- Modals State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState('general'); // For Settings Modal Sidebar

  // --- Create Wizard State ---
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [createStep, setCreateStep] = useState(1);
  const [createdSpaceLink, setCreatedSpaceLink] = useState('');

  // --- File/Unity/Invite State ---
  const [viewingFile, setViewingFile] = useState(null); 
  const [uploadState, setUploadState] = useState('idle'); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [unityLoadingProgress, setUnityLoadingProgress] = useState(0);
  const [inviteStatus, setInviteStatus] = useState('idle'); // 'idle', 'copied'

  // --- Mock Data ---
  const [spaces, setSpaces] = useState([
    {
      id: 1,
      name: 'The Chill Zone',
      thumbnail: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
      type: 'MEETING',
      isOnline: true,
      userCount: 6,
      memberCount: 24,
      isFavorite: true,
      description: "Weekly syncs and coffee chats ☕️",
      myRole: 'admin', // You are admin here
      members: [
        { id: 'u1', name: 'Maryam', role: 'owner', avatar: 'bg-pink-200' },
        { id: 'u2', name: 'Alex', role: 'admin', avatar: 'bg-purple-300' },
        { id: 'u3', name: 'Sarah', role: 'member', avatar: 'bg-green-300' },
        { id: 'u4', name: 'Mike', role: 'viewer', avatar: 'bg-blue-300' },
      ],
      files: [
        { id: 'f1', name: 'Q3_Goals.pdf', type: 'pdf', user: 'Alex', time: '2h ago', size: '2.4 MB' },
        { id: 'f2', name: 'Team_Photo.png', type: 'image', user: 'Sarah', time: '5h ago', size: '4.1 MB' }
      ]
    },
    {
      id: 2,
      name: 'Design Studio',
      thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      type: 'CREATIVE',
      isOnline: false,
      userCount: 0,
      memberCount: 8,
      isFavorite: false,
      description: "Where the magic happens ✨",
      myRole: 'member', // Regular member here
      members: [
        { id: 'u1', name: 'Maryam', role: 'member', avatar: 'bg-pink-200' },
        { id: 'u4', name: 'Mike', role: 'owner', avatar: 'bg-blue-300' },
      ],
      files: [
        { id: 'f3', name: 'Logo_V2.svg', type: 'image', user: 'Mike', time: '1d ago', size: '150 KB' },
        { id: 'f4', name: 'Brand_Guidelines.pdf', type: 'pdf', user: 'Maryam', time: '2d ago', size: '12 MB' }
      ]
    },
    {
      id: 3,
      name: 'Dev Bunker',
      thumbnail: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      type: 'TECH',
      isOnline: true,
      userCount: 12,
      memberCount: 42,
      isFavorite: false,
      description: "Code, debug, repeat 🐛",
      myRole: 'admin',
      members: [],
      files: []
    },
    {
      id: 4,
      name: 'Library',
      thumbnail: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      type: 'EDUCATION',
      isOnline: false,
      userCount: 0,
      memberCount: 156,
      isFavorite: true,
      description: "Resources and docs 📚",
      myRole: 'viewer',
      members: [],
      files: [
        { id: 'f5', name: 'Onboarding_Video.mp4', type: 'video', user: 'Admin', time: '1w ago', size: '450 MB' }
      ]
    }
  ]);

  const spaceTemplates = [
    { id: 't1', name: 'Art Gallery', category: 'CREATIVE', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', icon: <Zap size={24} /> },
    { id: 't2', name: 'Cyber Lab', category: 'TECH', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: <Monitor size={24} /> },
    { id: 't3', name: 'Cozy Lounge', category: 'MEETING', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', icon: <Coffee size={24} /> },
    { id: 't4', name: 'Classroom', category: 'EDUCATION', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', icon: <BookOpen size={24} /> },
  ];

  // --- Effects ---
  useEffect(() => {
    if (currentView === 'chat' && activeChatSpace) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, currentView, activeChatSpace]);

  // --- Logic Helpers ---
  const currentMessages = activeChatSpace ? (chatHistory[activeChatSpace.id] || []) : [];

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
      myRole: 'owner',
      members: [{ id: 'u1', name: 'Maryam', role: 'owner', avatar: 'bg-pink-200' }],
      files: []
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
  
  const enterChatLobby = () => {
    setCurrentView('chat');
    setActiveChatSpace(null); 
  };

  // Member Management Logic
  const handleRoleChange = (memberId, newRole) => {
    if (!activeSpace) return;
    const updatedSpace = {
      ...activeSpace,
      members: activeSpace.members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      )
    };
    // Update both local active space and global spaces list
    setActiveSpace(updatedSpace);
    setSpaces(spaces.map(s => s.id === updatedSpace.id ? updatedSpace : s));
  };

  const handleInviteMember = () => {
    setInviteStatus('copied');
    // In a real app, navigator.clipboard.writeText(...)
    setTimeout(() => setInviteStatus('idle'), 2000);
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

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      case 'image': return <ImageIcon size={20} className="text-blue-500" />;
      case 'video': return <Film size={20} className="text-purple-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const handleFileUpload = () => {
    setUploadState('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20);
      });
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState('success');
      const newFile = { 
        id: `f${Date.now()}`, 
        name: 'New_Awesome_Idea.png', 
        type: 'image', 
        user: 'Maryam', 
        time: 'Just now', 
        size: '1.2 MB' 
      };
      setSpaces(prevSpaces => prevSpaces.map(s => {
        if (s.id === activeSpace.id) {
          const updatedSpace = { ...s, files: [newFile, ...s.files] };
          setActiveSpace(updatedSpace);
          return updatedSpace;
        }
        return s;
      }));
      setTimeout(() => {
        setUploadState('idle');
        setUploadProgress(0);
      }, 2000);
    }, 3000);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900 text-white selection:bg-purple-500' : 'bg-[#FFFDF5] text-gray-900 selection:bg-pink-200'}`}>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: ${theme === 'dark' ? '#1f2937' : '#fff'}; border-left: 2px solid ${theme === 'dark' ? '#000' : '#e5e7eb'}; }
        ::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? '#fbbf24' : '#fbbf24'}; border: 2px solid ${theme === 'dark' ? '#000' : '#000'}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
      `}</style>

      {/* --- Sidebar (Floating Style) --- */}
      <aside className={`fixed left-4 top-4 bottom-4 w-20 border-2 border-black rounded-full flex flex-col items-center py-8 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:flex ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-8 transform hover:scale-110 transition-transform cursor-pointer"
        >
          G
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center gap-4">
          <NavButton icon={<Grid size={20} />} active={currentView === 'dashboard'} tooltip="Spaces" onClick={() => setCurrentView('dashboard')} theme={theme} />
          <NavButton icon={<MessageSquare size={20} />} active={currentView === 'chat'} tooltip="Chat" onClick={enterChatLobby} theme={theme} />
          <NavButton icon={<Users size={20} />} active={currentView === 'team'} tooltip="Team" onClick={() => setCurrentView('team')} theme={theme} />
        </div>

        <div className="flex flex-col items-center gap-4">
           {/* Global Settings Button */}
           <button 
             onClick={() => setIsGlobalSettingsOpen(true)}
             className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:rotate-90 ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100 hover:text-black'}`}
             title="Settings"
           >
             <Settings size={20} />
           </button>
           
           <button className="w-12 h-12 bg-pink-200 border-2 border-black rounded-full flex items-center justify-center hover:bg-pink-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
             <span className="font-bold text-sm text-black">M</span>
           </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="md:ml-28 p-4 md:p-8 min-h-screen transition-all duration-300">
        
        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className={`text-4xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Spaces</h1>
                <p className="text-gray-500 font-medium">Welcome back, Maryam! 👋</p>
              </div>
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                <span>Create Space</span>
              </button>
            </header>

            {/* Controls Bar */}
            <div className={`border-2 border-black rounded-2xl p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-30 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <div className="flex p-1 bg-gray-100 rounded-xl border-2 border-black w-full lg:w-auto overflow-x-auto">
                {['all', 'member', 'favorites', 'owned'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                 {/* Filters */}
                 <div className="relative group min-w-[140px]">
                   <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 w-full text-black"
                  >
                    <option value="all">All Categories</option>
                    <option value="CREATIVE">🎨 Creative</option>
                    <option value="TECH">💻 Tech</option>
                    <option value="EDUCATION">📚 Education</option>
                    <option value="MEETING">☕️ Meeting</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black"><MoreVertical size={16} /></div>
                </div>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search spaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium placeholder-gray-400 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Grid/List Display */}
            {filteredSpaces.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-4"
              }>
                {filteredSpaces.map((space) => (
                  <div 
                    key={space.id}
                    onClick={() => enterSpace(space)} // Entire card is clickable
                    className={`group relative bg-white border-2 border-black rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${viewMode === 'list' ? 'flex items-center' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div 
                      className={`relative ${viewMode === 'grid' ? 'h-40' : 'h-full w-48 shrink-0'}`}
                      style={{ background: space.thumbnail }}
                    >
                      <div className="absolute top-3 left-3 flex gap-2">
                        {space.isOnline && (
                          <span className="bg-green-400 text-black border-2 border-black text-xs font-bold px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                            LIVE ({space.userCount})
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(e, space.id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-lg border-2 border-black hover:bg-pink-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                      >
                        <Heart size={16} className={space.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold tracking-wider uppercase mb-2 border border-blue-200">
                            {space.type}
                          </span>
                          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">
                            {space.name}
                          </h3>
                        </div>
                        {/* Admin Badge if applicable */}
                        {space.myRole === 'admin' || space.myRole === 'owner' ? (
                            <span className="bg-yellow-300 text-black border-2 border-black text-[10px] font-bold px-2 py-0.5 rounded-full" title="You are Admin">
                                ADMIN
                            </span>
                        ) : null}
                      </div>
                      
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4">
                        {space.description}
                      </p>

                      <div className="flex items-center justify-between border-t-2 border-gray-100 pt-3 mt-auto">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            +{space.memberCount}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 underline decoration-2 decoration-yellow-400 underline-offset-2 hover:decoration-pink-400 transition-all">
                          Enter Space
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-gray-300 rounded-3xl">
                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl grayscale opacity-50">👻</div>
                 <h3 className="text-xl font-black text-gray-900">No spaces found</h3>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SPACE DETAILS */}
        {currentView === 'space-details' && activeSpace && (
           <div className="animate-in fade-in slide-in-from-right-8 duration-300">
             <button 
               onClick={() => setCurrentView('dashboard')}
               className={`mb-6 flex items-center gap-2 font-bold hover:-translate-x-1 transition-all ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'}`}
             >
               <ArrowLeft size={20} /> Back to Dashboard
             </button>

             {/* Hero Banner */}
             <div className="w-full h-64 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-8" style={{ background: activeSpace.thumbnail }}>
               <div className="absolute inset-0 bg-black/10"></div>
               <div className="absolute bottom-6 left-6 md:left-10 text-white drop-shadow-md">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="bg-white/90 text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{activeSpace.type}</span>
                   {activeSpace.isOnline && <span className="bg-green-400 text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider animate-pulse">LIVE NOW</span>}
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-shadow-lg">{activeSpace.name}</h1>
                 <p className="text-white/90 font-bold text-lg max-w-2xl">{activeSpace.description}</p>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left: Content */}
               <div className="lg:col-span-2 space-y-6">
                 {/* Quick Actions */}
                 <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4">
                    {/* JOIN SPACE (UNITY) BUTTON */}
                    <button 
                      onClick={enterUnityWorld}
                      className="w-full mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 px-6 rounded-xl border-2 border-black hover:from-indigo-600 hover:to-purple-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      <Gamepad2 size={28}/> JOIN SPACE (Interactive 3D)
                    </button>

                    <div className="flex gap-4 w-full">
                        <button 
                        onClick={() => { setActiveChatSpace(activeSpace); setCurrentView('chat'); }}
                        className="flex-1 bg-green-400 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-green-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                        <MessageSquare size={20}/> Chat
                        </button>
                        
                        {/* Settings - Admin Only */}
                        {(activeSpace.myRole === 'admin' || activeSpace.myRole === 'owner') && (
                            <button className="flex-1 bg-yellow-300 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                                <Settings size={20}/> Settings
                            </button>
                        )}
                        
                        <button className="flex-1 bg-white text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                            <Copy size={20}/> Share
                        </button>
                    </div>
                 </div>

                 {/* Stats Cards */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       <h3 className="text-gray-500 font-bold text-sm uppercase mb-1">Total Members</h3>
                       <p className="text-3xl font-black text-gray-900">{activeSpace.memberCount}</p>
                    </div>
                    <div className="bg-pink-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       <h3 className="text-gray-500 font-bold text-sm uppercase mb-1">Active Now</h3>
                       <p className="text-3xl font-black text-gray-900">{activeSpace.userCount}</p>
                    </div>
                 </div>

                 {/* Shared Files */}
                 <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black flex items-center gap-2 text-black"><FileText size={20}/> Shared Files</h3>
                      <button 
                        onClick={() => setIsFilesModalOpen(true)}
                        className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View All <ArrowLeft size={16} className="rotate-180" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {activeSpace.files && activeSpace.files.length > 0 ? (
                        activeSpace.files.slice(0, 3).map((file, i) => (
                          <div 
                            key={i} 
                            onClick={() => setViewingFile(file)}
                            className="flex items-center gap-4 p-3 rounded-xl border-2 border-transparent hover:border-black hover:bg-gray-50 transition-all cursor-pointer group"
                          >
                             <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                               {getFileIcon(file.type)}
                             </div>
                             <div className="flex-1">
                               <p className="font-bold text-gray-900">{file.name}</p>
                               <p className="text-xs text-gray-500 font-medium">Shared by {file.user} • {file.time}</p>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400 font-medium italic">
                          No files shared yet. Be the first! 📂
                        </div>
                      )}
                    </div>
                 </div>
               </div>

               {/* Right: Sidebar Info */}
               <div className="space-y-6">
                  {/* MEMBERS CARD */}
                  <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black flex items-center gap-2 text-black"><Users size={20}/> Members</h3>
                        {(activeSpace.myRole === 'admin' || activeSpace.myRole === 'owner') && (
                            <button 
                                onClick={() => setIsMembersModalOpen(true)}
                                className="text-xs font-bold bg-gray-100 px-2 py-1 rounded border border-gray-300 hover:bg-gray-200"
                            >
                                MANAGE
                            </button>
                        )}
                        {!['admin', 'owner'].includes(activeSpace.myRole) && (
                             <button 
                                onClick={() => setIsMembersModalOpen(true)}
                                className="text-xs font-bold text-blue-600 hover:underline"
                             >
                                See All
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(activeSpace.members || []).slice(0, 8).map((m,i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl ${m.avatar} border-2 border-black flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform cursor-pointer`} title={`${m.name} (${m.role})`}>
                          {m.name[0]}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-bold text-xs cursor-pointer">+12</div>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        )}

        {/* VIEW: UNITY WEBGL PLACEHOLDER */}
        {currentView === 'unity-view' && (
            <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center text-white">
                {unityLoadingProgress < 100 ? (
                    <div className="text-center w-full max-w-md p-8">
                        <Loader2 size={64} className="animate-spin text-yellow-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-black mb-4">Entering 3D World...</h2>
                        <div className="w-full h-4 bg-gray-700 rounded-full border-2 border-black overflow-hidden relative">
                             <div 
                               className="h-full bg-yellow-300 transition-all duration-100" 
                               style={{width: `${unityLoadingProgress}%`}}
                             ></div>
                        </div>
                        <p className="mt-4 font-mono text-gray-400">Loading assets... {unityLoadingProgress}%</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* Fake 3D World UI */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-indigo-900 flex items-center justify-center">
                             <div className="text-center">
                                 <Gamepad2 size={100} className="mx-auto mb-4 text-white/20" />
                                 <h1 className="text-5xl font-black text-white/30">GAME WORLD CANVAS</h1>
                                 <p className="text-white/30 font-mono mt-4">Interactive Unity WebGL Build running here...</p>
                             </div>
                        </div>

                        {/* Game UI Overlay */}
                        <div className="absolute top-4 left-4 p-4">
                            <button onClick={() => setCurrentView('space-details')} className="bg-red-500 border-2 border-black text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                                LEAVE WORLD
                            </button>
                        </div>
                        
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md p-2 rounded-xl border-2 border-white/20 flex gap-2">
                             <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold">Mic</div>
                             <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold">Cam</div>
                             <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold">Emo</div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* ... (Chat View and Team View remain similar) ... */}
        {currentView === 'chat' && (
             <div className="h-[calc(100vh-4rem)] animate-in fade-in zoom-in-95 duration-300">
               {/* Chat Lobby... (Abbreviated for brevity, assumes logic is same as previous version) */}
               {!activeChatSpace ? (
                 <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
                    <h2 className={`text-4xl font-black mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Jump into Chat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {spaces.map(space => (
                            <button 
                                key={space.id}
                                onClick={() => setActiveChatSpace(space)}
                                className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-2xl hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group"
                            >
                                <div className="w-12 h-12 rounded-xl border-2 border-black flex-shrink-0" style={{background: space.thumbnail}}></div>
                                <div className="flex-1">
                                <h3 className="font-bold text-lg text-black">{space.name}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                 </div>
               ) : (
                 /* Active Chat View */
                 <div className="h-full flex gap-6">
                    <div className="flex-1 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative">
                        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveChatSpace(null)} className="p-2 hover:bg-white rounded-lg"><ArrowLeft size={20}/></button>
                                <h3 className="font-black text-lg">{activeChatSpace.name}</h3>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                            {currentMessages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full border-2 border-black flex-shrink-0 flex items-center justify-center font-bold text-xs ${msg.avatarColor}`}>{msg.user[0]}</div>
                                    <div className={`${msg.isMe ? 'flex flex-col items-end' : ''}`}>
                                        <div className={`border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${msg.isMe ? 'bg-black text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' : 'bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'}`}>
                                            <p className="font-medium">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t-2 border-black bg-white">
                           <form onSubmit={handleSendMessage} className="relative">
                             <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 pl-4 pr-14 font-medium focus:outline-none" placeholder="Message..." />
                             <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center hover:bg-yellow-400"><Send size={20} /></button>
                           </form>
                        </div>
                    </div>
                 </div>
               )}
             </div>
        )}

      </main>

      {/* --- MEMBERS MODAL (NEW) --- */}
      {isMembersModalOpen && activeSpace && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMembersModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-95 flex flex-col max-h-[80vh]">
               <div className="p-6 border-b-2 border-black bg-purple-50 flex justify-between items-center rounded-t-2xl">
                  <h2 className="text-2xl font-black flex items-center gap-2"><Users size={24}/> Team Members</h2>
                  <button onClick={() => setIsMembersModalOpen(false)} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6">
                  {(activeSpace.members || []).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border-b-2 border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center font-bold text-lg ${member.avatar}`}>
                                {member.name[0]}
                             </div>
                             <div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase">{member.role}</p>
                             </div>
                          </div>
                          
                          {/* Admin Role Editor */}
                          {(activeSpace.myRole === 'admin' || activeSpace.myRole === 'owner') && activeSpace.myRole !== 'viewer' ? (
                             <select 
                               value={member.role}
                               disabled={member.role === 'owner'}
                               onChange={(e) => handleRoleChange(member.id, e.target.value)}
                               className="bg-white border-2 border-black rounded-lg px-3 py-1 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="viewer">Viewer</option>
                                <option value="owner" disabled>Owner</option>
                             </select>
                          ) : (
                             <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 uppercase">{member.role}</span>
                          )}
                      </div>
                  ))}
                  {(activeSpace.members || []).length === 0 && (
                      <div className="text-center py-8 text-gray-400 italic">No members found.</div>
                  )}
               </div>
               
               <div className="p-6 border-t-2 border-black bg-gray-50 rounded-b-2xl">
                   <button 
                     onClick={handleInviteMember}
                     className="w-full bg-black text-white font-bold py-3 rounded-xl border-2 border-black hover:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                   >
                       {inviteStatus === 'copied' ? <CheckCircle2 size={18} className="text-green-400" /> : <Plus size={18}/>}
                       {inviteStatus === 'copied' ? 'Invite Link Copied!' : 'Invite New Member'}
                   </button>
               </div>
            </div>
         </div>
      )}

      {/* --- GLOBAL SETTINGS MODAL (REFACTORED) --- */}
      {isGlobalSettingsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsGlobalSettingsOpen(false)}></div>
            <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in slide-in-from-bottom-10 flex flex-col md:flex-row h-[600px] overflow-hidden">
                
                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-gray-50 border-r-2 border-black p-6 flex flex-col">
                    <h2 className="text-2xl font-black flex items-center gap-2 mb-8"><Settings size={24}/> Settings</h2>
                    <nav className="space-y-2">
                        {['general', 'appearance', 'notifications', 'account', 'security'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSettingsActiveTab(tab)}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all border-2 ${
                                    settingsActiveTab === tab 
                                    ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                    : 'border-transparent text-gray-500 hover:bg-white hover:border-black'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto bg-white relative">
                    <button 
                        onClick={() => setIsGlobalSettingsOpen(false)} 
                        className="absolute top-6 right-6 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none z-10"
                    >
                        <X size={20} />
                    </button>

                    {settingsActiveTab === 'general' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><Globe size={28}/> General</h3>
                            <div className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Language</label>
                                    <select 
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="english">English (US)</option>
                                        <option value="french">French</option>
                                        <option value="arabic">Arabic</option>
                                        <option value="spanish">Spanish</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Timezone</label>
                                    <select className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-100">
                                        <option>UTC (GMT+0)</option>
                                        <option>EST (GMT-5)</option>
                                        <option>PST (GMT-8)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {settingsActiveTab === 'appearance' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><Monitor size={28}/> Appearance</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`p-6 rounded-2xl border-2 border-black text-center transition-all ${theme === 'light' ? 'bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <Sun size={48} className="mx-auto mb-4" />
                                    <span className="font-black text-lg block">Light Mode</span>
                                </button>
                                <button 
                                    onClick={() => setTheme('dark')}
                                    className={`p-6 rounded-2xl border-2 border-black text-center transition-all ${theme === 'dark' ? 'bg-gray-800 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    <Moon size={48} className="mx-auto mb-4" />
                                    <span className="font-black text-lg block">Dark Mode</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {settingsActiveTab === 'notifications' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><BellRing size={28}/> Notifications</h3>
                            <div className="space-y-4">
                                {['Email Notifications', 'Desktop Alerts', 'Sound Effects', 'Marketing Emails'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-black transition-colors">
                                        <span className="font-bold text-lg">{item}</span>
                                        <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" defaultChecked={i < 3} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-black appearance-none cursor-pointer checked:right-0 right-6 checked:bg-green-400"/>
                                            <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 border-2 border-black cursor-pointer"></label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {settingsActiveTab === 'account' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><User size={28}/> Account</h3>
                            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-pink-200 border-2 border-black flex items-center justify-center font-black text-2xl">M</div>
                                    <div>
                                        <p className="font-black text-xl">Maryam</p>
                                        <p className="text-gray-600 font-medium">maryam@example.com</p>
                                    </div>
                                </div>
                                <button className="bg-white px-4 py-2 rounded-lg border-2 border-black font-bold text-sm hover:bg-gray-50">Edit Profile</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* --- Other Modals (Create, Files, etc. - kept as they were) --- */}
      {isFilesModalOpen && activeSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilesModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b-2 border-black bg-blue-50 flex justify-between items-center rounded-t-2xl">
                <div>
                   <h2 className="text-2xl font-black flex items-center gap-2"><FileText size={24} /> File Library</h2>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Workspace: {activeSpace.name}</p>
                </div>
                <button onClick={() => setIsFilesModalOpen(false)} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Upload Card */}
                  <div 
                    onClick={uploadState === 'idle' ? handleFileUpload : undefined}
                    className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all group min-h-[160px]"
                  >
                     {uploadState === 'idle' ? (
                       <>
                         <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center mb-3 group-hover:border-blue-500 group-hover:scale-110 transition-all"><UploadCloud size={24} /></div>
                         <p className="font-bold">Click to Upload</p>
                       </>
                     ) : uploadState === 'uploading' ? (
                       <div className="w-full">
                          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
                          <div className="w-full h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden relative">
                             <div className="h-full bg-blue-400 transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                          </div>
                       </div>
                     ) : (
                       <div className="animate-in zoom-in">
                          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-2" />
                          <p className="font-black text-green-600">Done!</p>
                       </div>
                     )}
                  </div>
                  {/* File Cards */}
                  {activeSpace.files && activeSpace.files.map((file, i) => (
                    <div key={i} className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer min-h-[160px]">
                       <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent">{getFileIcon(file.type)}</div>
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{file.type.toUpperCase()}</span>
                       </div>
                       <div>
                          <p className="font-bold text-sm line-clamp-2 leading-tight mb-1">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} • {file.user}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

function NavButton({ icon, active, tooltip, onClick, theme }) {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${active ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(168,85,247,1)] scale-110' : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-black')}`}
    >
      {icon}
      <span className="absolute left-14 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {tooltip}
      </span>
    </button>
  );
}