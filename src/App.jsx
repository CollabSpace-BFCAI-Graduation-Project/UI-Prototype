import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Grid, List, Plus, Heart, Users, Monitor, 
  Coffee, BookOpen, Zap, X, ArrowLeft, Copy, Mail, 
  MoreVertical, Smile, Send, Bug, MessageSquare, Settings,
  Hash, Bell, FileText, Image as ImageIcon, Film, Download,
  UploadCloud, Eye, CheckCircle2, Loader2, UserCog, Shield, 
  Trash2, LogOut, User, Gamepad2, Link, File, Presentation, 
  Filter
} from 'lucide-react';

export default function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [activeSpace, setActiveSpace] = useState(null); 
  const [activeChatSpace, setActiveChatSpace] = useState(null); 
  const [isDebugOpen, setIsDebugOpen] = useState(false);

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
  const [createStep, setCreateStep] = useState(1);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [createdSpaceLink, setCreatedSpaceLink] = useState('');
  
  // File Mgmt
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileFilter, setFileFilter] = useState('all'); // 'all', 'image', 'video', 'doc', 'presentation'
  const fileInputRef = useRef(null); // Reference to hidden file input

  // Invite & Settings
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // New Invite Modal
  const [settingsTab, setSettingsTab] = useState('general');
  const [isUnityLaunching, setIsUnityLaunching] = useState(false); 
  const [inviteStatus, setInviteStatus] = useState('idle'); 
  const [inviteEmail, setInviteEmail] = useState('');

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
      files: [
        { id: 'f1', name: 'Q3_Goals.pdf', type: 'doc', user: 'Alex', time: '2h ago', size: '2.4 MB' },
        { id: 'f2', name: 'Team_Photo.png', type: 'image', user: 'Sarah', time: '5h ago', size: '4.1 MB' }
      ],
      members: [
        { id: 1, name: 'Maryam', role: 'Owner', avatar: 'bg-pink-200' },
        { id: 2, name: 'Alex', role: 'Admin', avatar: 'bg-purple-300' },
        { id: 3, name: 'Sarah', role: 'Member', avatar: 'bg-green-300' },
        { id: 4, name: 'Mike', role: 'Viewer', avatar: 'bg-blue-300' },
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
      files: [
        { id: 'f3', name: 'Logo_V2.svg', type: 'image', user: 'Mike', time: '1d ago', size: '150 KB' },
        { id: 'f4', name: 'Brand_Guidelines.pdf', type: 'doc', user: 'Maryam', time: '2d ago', size: '12 MB' },
        { id: 'f6', name: 'Pitch_Deck.pptx', type: 'presentation', user: 'Maryam', time: '3d ago', size: '5.5 MB' }
      ],
      members: [
        { id: 1, name: 'Maryam', role: 'Owner', avatar: 'bg-pink-200' },
        { id: 4, name: 'Mike', role: 'Admin', avatar: 'bg-blue-300' },
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
      files: [],
      members: []
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
      files: [
        { id: 'f5', name: 'Onboarding_Video.mp4', type: 'video', user: 'Admin', time: '1w ago', size: '450 MB' },
        { id: 'f7', name: 'Curriculum_2025.docx', type: 'doc', user: 'Admin', time: '2w ago', size: '1.2 MB' }
      ],
      members: []
    }
  ]);

  const spaceTemplates = [
    { id: 't1', name: 'Art Gallery', category: 'CREATIVE', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', icon: <Zap size={24} /> },
    { id: 't2', name: 'Cyber Lab', category: 'TECH', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: <Monitor size={24} /> },
    { id: 't3', name: 'Cozy Lounge', category: 'MEETING', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', icon: <Coffee size={24} /> },
    { id: 't4', name: 'Classroom', category: 'EDUCATION', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', icon: <BookOpen size={24} /> },
  ];

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

  const getFileIcon = (type) => {
    switch(type) {
      case 'doc': return <FileText size={20} className="text-blue-500" />;
      case 'image': return <ImageIcon size={20} className="text-pink-500" />;
      case 'video': return <Film size={20} className="text-purple-500" />;
      case 'presentation': return <Presentation size={20} className="text-orange-500" />;
      default: return <File size={20} className="text-gray-500" />;
    }
  };

  // --- Real File Upload Simulation ---
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine mock type based on basic extension check or default to 'doc'
    let mockType = 'doc';
    if (file.type.startsWith('image/')) mockType = 'image';
    else if (file.type.startsWith('video/')) mockType = 'video';
    else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) mockType = 'presentation';

    // Start Animation
    setUploadState('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25);
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState('success');

      const newFile = { 
        id: `f${Date.now()}`, 
        name: file.name, 
        type: mockType, 
        user: 'Maryam', 
        time: 'Just now', 
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB' 
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
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }, 2000);
    }, 2500);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLaunchUnity = () => {
    setIsUnityLaunching(true);
    setTimeout(() => {
      setIsUnityLaunching(false);
      alert("🚀 Launching Unity WebGL Experience!\n(This is a mock interaction)");
    }, 2500);
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
    if(!inviteEmail) return;
    setInviteStatus('sending');
    setTimeout(() => {
        setInviteStatus('sent');
        setInviteEmail('');
        setTimeout(() => setInviteStatus('idle'), 2000);
    }, 1000);
  }

  const handleRoleChange = (memberId, newRole) => {
    setSpaces(prev => prev.map(s => {
       if(s.id === activeSpace.id) {
         const updatedMembers = s.members.map(m => m.id === memberId ? {...m, role: newRole} : m);
         const updatedSpace = {...s, members: updatedMembers};
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
      <aside className="fixed left-4 top-4 bottom-4 w-20 bg-white border-2 border-black rounded-full flex flex-col items-center py-8 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:flex">
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-8 transform hover:scale-110 transition-transform cursor-pointer"
        >
          G
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center gap-4">
          <NavButton 
            icon={<Grid size={20} />} 
            active={currentView === 'dashboard'} 
            tooltip="Spaces" 
            onClick={() => setCurrentView('dashboard')}
          />
          <NavButton 
            icon={<MessageSquare size={20} />} 
            active={currentView === 'chat'} 
            tooltip="Chat" 
            onClick={enterChatLobby}
          />
          <NavButton 
            icon={<Users size={20} />} 
            active={currentView === 'team'} 
            tooltip="Team" 
            onClick={() => setCurrentView('team')}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-10 h-10 text-gray-400 hover:text-black hover:rotate-90 transition-all"
            title="Settings"
          >
            <Settings size={24} />
          </button>
          
          <button className="w-12 h-12 bg-pink-200 border-2 border-black rounded-full flex items-center justify-center hover:bg-pink-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
            <span className="font-bold text-sm">M</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="md:ml-28 p-4 md:p-8 min-h-screen transition-all duration-300">
        
        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">My Spaces</h1>
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
            <div className="bg-white border-2 border-black rounded-2xl p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-30">
              {/* Tabs */}
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

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                <div className="relative group min-w-[140px]">
                   <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 w-full"
                  >
                    <option value="all">All Categories</option>
                    <option value="CREATIVE">🎨 Creative</option>
                    <option value="TECH">💻 Tech</option>
                    <option value="EDUCATION">📚 Education</option>
                    <option value="MEETING">☕️ Meeting</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><MoreVertical size={16} /></div>
                </div>

                <div className="relative group min-w-[140px]">
                   <select 
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value)}
                    className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-green-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 w-full"
                  >
                    <option value="all">Any Status</option>
                    <option value="online">🟢 Online</option>
                    <option value="offline">⚫️ Offline</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><MoreVertical size={16} /></div>
                </div>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search spaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium placeholder-gray-400"
                  />
                </div>

                <div className="flex bg-white rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <button onClick={() => setViewMode('grid')} className={`p-2.5 hover:bg-gray-100 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}><Grid size={20} /></button>
                  <div className="w-0.5 bg-black"></div>
                  <button onClick={() => setViewMode('list')} className={`p-2.5 hover:bg-gray-100 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}><List size={20} /></button>
                </div>
              </div>
            </div>

            {/* Spaces Grid */}
            {filteredSpaces.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                {filteredSpaces.map((space) => (
                  <div 
                    key={space.id}
                    onClick={() => enterSpace(space)}
                    className={`group relative bg-white border-2 border-black rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${viewMode === 'list' ? 'flex items-center' : ''}`}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'h-40' : 'h-full w-48 shrink-0'}`} style={{ background: space.thumbnail }}>
                      <div className="absolute top-3 left-3 flex gap-2">
                        {space.isOnline ? (
                          <span className="bg-green-400 text-black border-2 border-black text-xs font-bold px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">LIVE ({space.userCount})</span>
                        ) : (
                          <span className="bg-gray-200 text-gray-600 border-2 border-black text-xs font-bold px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">OFFLINE</span>
                        )}
                      </div>
                      <button onClick={(e) => toggleFavorite(e, space.id)} className="absolute top-3 right-3 bg-white p-2 rounded-lg border-2 border-black hover:bg-pink-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
                        <Heart size={16} className={space.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                      </button>
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold tracking-wider uppercase mb-2 border border-blue-200">{space.type}</span>
                          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">{space.name}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4">{space.description}</p>
                      <div className="flex items-center justify-between border-t-2 border-gray-100 pt-3 mt-auto">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">{String.fromCharCode(65 + i)}</div>
                          ))}
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">+{space.memberCount}</div>
                        </div>
                        <button className="text-sm font-bold text-gray-900 underline decoration-2 decoration-yellow-400 underline-offset-2 hover:decoration-pink-400 transition-all">Enter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-gray-300 rounded-3xl">
                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl grayscale opacity-50">👻</div>
                 <h3 className="text-xl font-black text-gray-900">No spaces found</h3>
                 <p className="text-gray-500">Try adjusting your filters or create a new one!</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SPACE DETAILS */}
        {currentView === 'space-details' && activeSpace && (
           <div className="animate-in fade-in slide-in-from-right-8 duration-300">
             <button onClick={() => setCurrentView('dashboard')} className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-black hover:-translate-x-1 transition-all"><ArrowLeft size={20} /> Back to Dashboard</button>

             {/* Hero */}
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
               <div className="lg:col-span-2 space-y-6">
                 {/* Quick Actions */}
                 <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4">
                    <button onClick={handleLaunchUnity} className="flex-1 min-w-[200px] bg-green-400 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-green-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 group">
                      <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-lg">Join Space (3D)</span>
                    </button>
                    <button onClick={() => { setActiveChatSpace(activeSpace); setCurrentView('chat'); }} className="flex-1 min-w-[140px] bg-yellow-300 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={20}/> Text Chat
                    </button>
                    <button onClick={() => setIsInviteModalOpen(true)} className="flex-1 min-w-[140px] bg-white text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                      <Link size={20}/> Invite
                    </button>
                 </div>

                 {/* Stats */}
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

                 {/* RECENT FILES */}
                 <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black flex items-center gap-2"><FileText size={20}/> Shared Files</h3>
                      <button onClick={() => setIsFilesModalOpen(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ArrowLeft size={16} className="rotate-180" /></button>
                    </div>
                    <div className="space-y-3">
                      {activeSpace.files && activeSpace.files.length > 0 ? (
                        activeSpace.files.slice(0, 3).map((file, i) => (
                          <div key={i} onClick={() => setViewingFile(file)} className="flex items-center gap-4 p-3 rounded-xl border-2 border-transparent hover:border-black hover:bg-gray-50 transition-all cursor-pointer group">
                             <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                               {getFileIcon(file.type)}
                             </div>
                             <div className="flex-1">
                               <p className="font-bold text-gray-900">{file.name}</p>
                               <p className="text-xs text-gray-500 font-medium">Shared by {file.user} • {file.time}</p>
                             </div>
                             <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"><Eye size={18} /></button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400 font-medium italic">No files shared yet. Be the first! 📂</div>
                      )}
                    </div>
                 </div>
               </div>

               {/* Right Info */}
               <div className="space-y-6">
                  <div onClick={() => setIsMembersModalOpen(true)} className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-colors group">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-lg font-black flex items-center gap-2"><Users size={20}/> Members</h3>
                       <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(activeSpace.members || []).slice(0, 6).map((m,i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold text-xs ${m.avatar}`}>{m.name[0]}</div>
                      ))}
                      <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-bold text-xs">+{(activeSpace.memberCount || 0) - (activeSpace.members?.length || 0)}</div>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        )}

        {/* VIEW: CHAT & TEAM (Hidden for brevity, essentially same structure as before but fully functional in full code block) */}
        {currentView === 'chat' && !activeChatSpace && (
           <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><MessageSquare size={32} /></div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Jump into Chat</h2>
                <p className="text-gray-500 text-lg font-medium">Choose a space to start chatting.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {spaces.map(space => (
                  <button key={space.id} onClick={() => setActiveChatSpace(space)} className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-2xl hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group">
                     <div className="w-12 h-12 rounded-xl border-2 border-black flex-shrink-0" style={{background: space.thumbnail}}></div>
                     <div className="flex-1"><h3 className="font-bold text-lg group-hover:text-pink-600 transition-colors">{space.name}</h3><p className="text-xs text-gray-500 font-bold uppercase">{space.type}</p></div>
                     <ArrowLeft size={20} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
           </div>
        )}
        {currentView === 'chat' && activeChatSpace && (
           <div className="h-[calc(100vh-4rem)] flex gap-6">
             <div className="w-80 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hidden lg:flex flex-col">
                <div className="p-6 border-b-2 border-black bg-pink-50 flex items-center gap-2">
                  <button onClick={() => setActiveChatSpace(null)} className="p-1 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={20}/></button>
                  <h2 className="text-xl font-black truncate">{activeChatSpace.name}</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <div className="p-3 bg-yellow-100 border-2 border-black rounded-xl font-bold flex justify-between items-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><span># General</span></div>
                </div>
             </div>
             <div className="flex-1 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative">
                <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveChatSpace(null)} className="lg:hidden p-2 hover:bg-white rounded-lg"><ArrowLeft size={20}/></button>
                    <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold text-lg" style={{background: activeChatSpace.thumbnail}}>#</div>
                    <div><h3 className="font-black text-lg">General</h3><p className="text-xs font-bold text-gray-500">Weekly Updates</p></div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                   {currentMessages.map((msg) => (
                     <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`w-10 h-10 rounded-full border-2 border-black flex-shrink-0 flex items-center justify-center font-bold text-xs ${msg.avatarColor}`}>{msg.user[0]}</div>
                        <div className={`${msg.isMe ? 'flex flex-col items-end' : ''}`}>
                          <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}><span className="font-black text-sm">{msg.user}</span><span className="text-xs text-gray-500 font-bold">{msg.time}</span></div>
                          <div className={`border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${msg.isMe ? 'bg-black text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]' : 'bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'}`}><p className="font-medium">{msg.text}</p></div>
                        </div>
                     </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t-2 border-black bg-white">
                   <form onSubmit={handleSendMessage} className="relative">
                     <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 pl-4 pr-14 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow" placeholder={`Message #${activeChatSpace.name}...`} />
                     <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-2 bottom-2 aspect-square bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center hover:bg-yellow-400 active:scale-95 transition-all"><Send size={20} /></button>
                   </form>
                </div>
             </div>
           </div>
        )}
        {currentView === 'team' && (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-32 h-32 bg-blue-200 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"><Users size={64} /></div>
              <h2 className="text-4xl font-black mb-4">Team Directory</h2>
              <p className="text-xl font-medium text-gray-500 max-w-md">Manage your team members here.</p>
           </div>
        )}

      </main>

      {/* --- FILES MODAL (Updated) --- */}
      {isFilesModalOpen && activeSpace && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilesModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
             
             {/* Header with Filter */}
             <div className="p-6 border-b-2 border-black bg-blue-50 rounded-t-2xl">
                <div className="flex justify-between items-center mb-4">
                   <div>
                      <h2 className="text-2xl font-black flex items-center gap-2"><FileText size={24} /> File Library</h2>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Workspace: {activeSpace.name}</p>
                   </div>
                   <button onClick={() => setIsFilesModalOpen(false)} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                   {['all', 'image', 'video', 'doc', 'presentation'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setFileFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 capitalize transition-all ${fileFilter === f ? 'bg-black text-white border-black' : 'bg-white border-transparent hover:border-black text-gray-500 hover:text-black'}`}
                      >
                        {f}
                      </button>
                   ))}
                </div>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Upload Card */}
                  <div 
                    onClick={uploadState === 'idle' ? triggerFileUpload : undefined}
                    className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all group min-h-[160px]"
                  >
                     {/* Hidden Input */}
                     <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                     
                     {uploadState === 'idle' ? (
                       <>
                         <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center mb-3 group-hover:border-blue-500 group-hover:scale-110 transition-all"><UploadCloud size={24} /></div>
                         <p className="font-bold">Click to Upload</p>
                         <p className="text-xs text-gray-500">Real files supported!</p>
                       </>
                     ) : uploadState === 'uploading' ? (
                       <div className="w-full">
                          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
                          <div className="w-full h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden relative">
                             <div className="h-full bg-blue-400 transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                          </div>
                          <p className="text-xs font-bold mt-2 animate-pulse">Uploading...</p>
                       </div>
                     ) : (
                       <div className="animate-in zoom-in">
                          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-2" />
                          <p className="font-black text-green-600">Done!</p>
                       </div>
                     )}
                  </div>

                  {/* File Cards Filtered */}
                  {activeSpace.files && activeSpace.files
                    .filter(f => fileFilter === 'all' || f.type === fileFilter)
                    .map((file, i) => (
                    <div 
                      key={i}
                      onClick={() => setViewingFile(file)}
                      className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer min-h-[160px]"
                    >
                       <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent">{getFileIcon(file.type)}</div>
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200 uppercase">{file.type}</span>
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

      {/* --- INVITE MODAL (NEW) --- */}
      {isInviteModalOpen && activeSpace && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-95 overflow-hidden">
               <div className="p-6 border-b-2 border-black bg-yellow-50 flex justify-between items-center">
                  <h2 className="text-2xl font-black">Invite People 🚀</h2>
                  <button onClick={() => setIsInviteModalOpen(false)} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20}/></button>
               </div>
               <div className="p-8 space-y-8">
                  {/* Option 1: Link */}
                  <div>
                     <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Link size={20}/> Share Link</h3>
                     <div className="flex gap-2">
                        <div className="flex-1 bg-gray-100 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm text-gray-600 truncate">
                           https://gathering.fun/join/{activeSpace.id}
                        </div>
                        <button onClick={handleCopyLink} className="bg-black text-white px-4 rounded-xl font-bold border-2 border-black active:scale-95 transition-transform">
                           {inviteStatus === 'copied' ? <CheckCircle2 size={20} className="text-green-400"/> : <Copy size={20}/>}
                        </button>
                     </div>
                  </div>

                  <div className="relative flex items-center py-2">
                     <div className="flex-grow border-t-2 border-gray-200"></div>
                     <span className="flex-shrink-0 mx-4 text-gray-400 font-bold text-sm">OR</span>
                     <div className="flex-grow border-t-2 border-gray-200"></div>
                  </div>

                  {/* Option 2: Email */}
                  <div>
                     <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Mail size={20}/> Invite by Email</h3>
                     <div className="flex gap-2">
                        <input 
                           type="email" 
                           value={inviteEmail}
                           onChange={(e) => setInviteEmail(e.target.value)}
                           placeholder="friend@example.com" 
                           className="flex-1 border-2 border-black rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-300 outline-none"
                        />
                        <button 
                           onClick={handleSendInvite}
                           disabled={!inviteEmail || inviteStatus === 'sending'}
                           className="bg-yellow-300 text-black px-6 rounded-xl font-bold border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                        >
                           {inviteStatus === 'sending' ? <Loader2 size={20} className="animate-spin"/> : (inviteStatus === 'sent' ? 'Sent!' : 'Send')}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {viewingFile && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingFile(null)}></div>
           <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[0px_0px_0px_4px_rgba(255,255,255,0.2)] animate-in zoom-in-95">
              <div className="h-64 bg-gray-100 border-b-2 border-black flex items-center justify-center relative pattern-dots">
                 {viewingFile.type === 'image' ? (
                    <div className="text-center">
                       <ImageIcon size={64} className="text-gray-400 mx-auto mb-2" />
                       <p className="font-mono text-xs text-gray-400">Image Preview: {viewingFile.name}</p>
                    </div>
                 ) : viewingFile.type === 'video' ? (
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                       <div className="ml-1 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>
                    </div>
                 ) : viewingFile.type === 'presentation' ? (
                    <div className="text-center">
                       <Presentation size={80} className="text-orange-300 mx-auto mb-2" />
                       <p className="font-mono text-xs text-gray-400">Slides Preview</p>
                    </div>
                 ) : (
                    <FileText size={80} className="text-blue-300" />
                 )}
                 <button onClick={() => setViewingFile(null)} className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
              </div>
              <div className="p-8">
                 <div className="flex items-start justify-between mb-6">
                    <div>
                       <h2 className="text-2xl font-black mb-1">{viewingFile.name}</h2>
                       <p className="text-gray-500 font-medium">Uploaded by <span className="text-black font-bold">{viewingFile.user}</span> • {viewingFile.time}</p>
                    </div>
                    <button className="bg-yellow-300 text-black px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 flex items-center gap-2"><Download size={18} /> Download</button>
                 </div>
                 <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-2">File Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div><p className="text-gray-500">File Type</p><p className="font-bold uppercase">{viewingFile.type}</p></div>
                       <div><p className="text-gray-500">Size</p><p className="font-bold">{viewingFile.size}</p></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- Create Modal, Members Modal, Settings Modal (Existing logic preserved) --- */}
      {/* ... (Create, Members, Settings modals are identical to previous step, included implicitly or I can reprint if you need them fully expanded, but for brevity in this response focusing on the new features) ... */}
      {/* Re-including Create Modal for completeness as user asked for "App.jsx" */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
            {createStep === 1 && (
              <>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-yellow-50">
                   <div className="mb-6"><span className="inline-block px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-4">Step 1/3</span><h2 className="text-4xl font-black text-gray-900 mb-2">Let's build your<br/>dream space! 🚀</h2><p className="text-gray-600 font-medium">Give it a cool name to get started.</p></div>
                   <div className="space-y-4">
                     <div><label className="block text-sm font-bold text-gray-900 mb-2">Space Name</label><input autoFocus value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} className="w-full px-4 py-3 text-lg font-bold border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-shadow" placeholder="e.g. The Bat Cave" /></div>
                     <div><label className="block text-sm font-bold text-gray-900 mb-2">Description</label><textarea value={newSpaceDescription} onChange={(e) => setNewSpaceDescription(e.target.value)} className="w-full px-4 py-3 font-medium border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] h-24 resize-none" placeholder="What happens in this space?" /></div>
                   </div>
                   <button disabled={!newSpaceName.trim()} onClick={() => setCreateStep(2)} className="mt-8 w-full bg-black text-white font-bold text-lg py-4 rounded-xl border-2 border-black hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px] active:shadow-none">Next Step →</button>
                </div>
                <div className="hidden md:flex w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-500 items-center justify-center relative overflow-hidden border-l-4 border-black">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-90"></div>
                   <div className="relative z-10 text-center p-8">
                      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rotate-3 max-w-xs mx-auto">
                        <div className="h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-4xl">🏰</div>
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                      </div>
                      <p className="text-white font-bold mt-8 text-xl drop-shadow-md">Previewing: {newSpaceName || 'Untitled Space'}</p>
                   </div>
                </div>
              </>
            )}
            {createStep === 2 && (
              <div className="w-full h-full flex flex-col">
                <div className="p-6 border-b-2 border-black flex items-center bg-pink-50"><button onClick={() => setCreateStep(1)} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={24} /></button><div><span className="text-xs font-bold uppercase tracking-wider text-pink-600">Step 2/3</span><h2 className="text-2xl font-black">Choose a Vibe</h2></div></div>
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{spaceTemplates.map((t) => (<button key={t.id} onClick={() => handleCreateConfirm(t)} className="group text-left border-2 border-black rounded-2xl p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none bg-white"><div className="h-32 rounded-xl mb-4 border-2 border-black flex items-center justify-center text-white" style={{ background: t.gradient }}>{t.icon}</div><h3 className="font-bold text-lg">{t.name}</h3><span className="text-xs font-bold text-gray-400 uppercase">{t.category}</span></button>))}</div>
                </div>
              </div>
            )}
            {createStep === 3 && (
              <div className="w-full p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#FFFDF5]">
                 <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"><Smile size={40} className="text-black" /></div>
                 <h2 className="text-3xl font-black mb-2">Space Created! 🎉</h2><p className="text-gray-600 font-medium mb-8 max-w-md">Your space is ready for action.</p>
                 <div className="w-full max-w-md bg-white border-2 border-black rounded-xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-6"><div className="flex-1 px-4 font-mono text-sm truncate text-gray-600">{createdSpaceLink}</div><button className="bg-yellow-300 hover:bg-yellow-400 text-black p-2.5 rounded-lg border-2 border-black font-bold transition-colors"><Copy size={18} /></button></div>
                 <div className="flex gap-4"><button onClick={handleFinalizeCreate} className="px-6 py-3 bg-white border-2 border-black rounded-xl font-bold hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">Skip Invite</button><button onClick={handleFinalizeCreate} className="px-6 py-3 bg-black text-white border-2 border-black rounded-xl font-bold hover:shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] transition-shadow">Go to Space →</button></div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Settings Modal - kept but hidden from main view block to save space, assuming it's same as before. If needed I can add back. (Included in previous response, assuming retained) */}
      {isSettingsModalOpen && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsModalOpen(false)}></div>
             <div className="relative w-full max-w-4xl bg-[#FFFDF5] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[600px] overflow-hidden animate-in zoom-in-95">
                <button onClick={() => setIsSettingsModalOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                <div className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-r-2 border-black p-6 flex flex-col"><h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings size={24}/> Settings</h2><div className="space-y-2">{['General', 'Notifications', 'Profile', 'Billing'].map(tab => (<button key={tab} onClick={() => setSettingsTab(tab.toLowerCase())} className={`w-full text-left px-4 py-3 rounded-xl font-bold border-2 transition-all ${settingsTab === tab.toLowerCase() ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent hover:bg-gray-100'}`}>{tab}</button>))}</div><div className="mt-auto pt-6 border-t-2 border-gray-100"><button className="flex items-center gap-2 text-red-500 font-bold hover:underline"><LogOut size={18}/> Log Out</button></div></div>
                <div className="flex-1 p-8 overflow-y-auto">
                   {settingsTab === 'general' && (<div className="space-y-6"><div><h3 className="text-xl font-black mb-4">Workspace Settings</h3><div className="bg-white border-2 border-black rounded-2xl p-6"><div className="mb-4"><label className="block font-bold mb-2">Workspace Name</label><input type="text" defaultValue="Maryam's Workspace" className="w-full border-2 border-black rounded-xl p-3 font-medium focus:ring-2 focus:ring-yellow-300 outline-none" /></div><div><label className="block font-bold mb-2">Theme Color</label><div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-yellow-300 border-2 border-black cursor-pointer ring-2 ring-offset-2 ring-black"></div><div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-black cursor-pointer hover:scale-110 transition-transform"></div><div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-black cursor-pointer hover:scale-110 transition-transform"></div></div></div></div></div></div>)}
                   {settingsTab === 'notifications' && (<div className="text-center py-20"><Bell size={48} className="mx-auto text-gray-300 mb-4"/><h3 className="font-bold text-gray-500">Notifications settings go here</h3></div>)}
                   {settingsTab === 'profile' && (<div className="space-y-6"><div className="flex items-center gap-6"><div className="w-24 h-24 bg-pink-200 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black">M</div><div><button className="bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black hover:bg-gray-800 mb-2 block">Change Avatar</button><p className="text-sm text-gray-500 font-bold">Max size: 5MB</p></div></div><div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4"><div><label className="block font-bold mb-2">Display Name</label><input type="text" defaultValue="Maryam" className="w-full border-2 border-black rounded-xl p-3 font-medium outline-none" /></div><div><label className="block font-bold mb-2">Email</label><input type="email" defaultValue="maryam@example.com" disabled className="w-full border-2 border-gray-300 bg-gray-100 rounded-xl p-3 font-medium text-gray-500" /></div></div></div>)}
                </div>
             </div>
         </div>
      )}
      {/* Members Modal (Retained) */}
      {isMembersModalOpen && activeSpace && (<div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMembersModalOpen(false)}></div><div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95"><div className="p-6 border-b-2 border-black bg-purple-50 flex justify-between items-center rounded-t-2xl"><div><h2 className="text-2xl font-black flex items-center gap-2"><UserCog size={24} /> Manage Members</h2><p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Space: {activeSpace.name}</p></div><button onClick={() => setIsMembersModalOpen(false)} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button></div><div className="flex-1 overflow-y-auto p-6"><div className="flex gap-2 mb-6"><input type="text" placeholder="Add by email..." className="flex-1 border-2 border-black rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-purple-300" /><button className="bg-black text-white px-6 rounded-xl font-bold border-2 border-black hover:bg-gray-800">Invite</button></div><div className="space-y-4">{activeSpace.members?.map(member => (<div key={member.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-transparent hover:border-black transition-all"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold ${member.avatar}`}>{member.name[0]}</div><div><p className="font-bold">{member.name}</p><p className="text-xs text-gray-500 font-bold">{member.role}</p></div></div><div className="flex items-center gap-2"><select defaultValue={member.role} onChange={(e) => handleRoleChange(member.id, e.target.value)} className="bg-white border-2 border-black rounded-lg px-2 py-1 text-sm font-bold outline-none cursor-pointer"><option value="Owner">Owner</option><option value="Admin">Admin</option><option value="Member">Member</option><option value="Viewer">Viewer</option></select>{member.role !== 'Owner' && (<button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Remove User"><Trash2 size={18} /></button>)}</div></div>))}</div></div></div></div>)}

    </div>
  );
}

// Sub-component for nav
function NavButton({ icon, active, tooltip, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${active ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(168,85,247,1)] scale-110' : 'text-gray-400 hover:bg-gray-100 hover:text-black'}`}
    >
      {icon}
      {/* Tooltip */}
      <span className="absolute left-14 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {tooltip}
      </span>
    </button>
  );
}