import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  MonitorPlay, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  MoreVertical, 
  LogOut, 
  ChevronLeft,
  Clock,
  Video,
  Image as ImageIcon,
  File,
  Music,
  Download,
  Share2,
  Grid,
  List as ListIcon,
  Mic,
  ArrowRight,
  Heart,
  X,
  Copy,
  Mail,
  Check,
  Home,
  Calendar,
  Send
} from 'lucide-react';

// --- MOCK DATA ---

const CURRENT_USER = {
  id: 'u1',
  name: 'Maryam',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maryam',
  role: 'Owner'
};

const WORKSPACE_TYPES = {
  CREATIVE: { label: 'CREATIVE', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  TECH: { label: 'TECH', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  EDUCATION: { label: 'EDUCATION', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  MEETING: { label: 'MEETING', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const INITIAL_WORKSPACES = [
  {
    id: 'ws1',
    name: 'Creative Studio',
    type: 'CREATIVE',
    status: 'online',
    onlineCount: 8,
    totalMembers: 12,
    lastActive: 'Active now',
    description: 'A collaborative space for creative projects and design work.',
    owner: 'Sarah Chen',
    createdAt: 'Nov 15, 2024',
    storageUsed: '184.5 MB',
    isFavorite: true,
    thumbnailGradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'ws2',
    name: 'Tech Office',
    type: 'TECH',
    status: 'offline',
    onlineCount: 0,
    totalMembers: 15,
    lastActive: '1 day ago',
    description: 'Engineering team daily sync and architecture review board.',
    owner: 'Mike Ross',
    createdAt: 'Oct 20, 2024',
    storageUsed: '450.2 MB',
    isFavorite: false,
    thumbnailGradient: 'from-blue-600 to-slate-800'
  },
  {
    id: 'ws3',
    name: 'Classroom 101',
    type: 'EDUCATION',
    status: 'offline',
    onlineCount: 0,
    totalMembers: 24,
    lastActive: '2 hours ago',
    description: 'Virtual classroom for Introduction to Computer Science.',
    owner: 'Prof. Albus',
    createdAt: 'Sep 01, 2024',
    storageUsed: '1.2 GB',
    isFavorite: true,
    thumbnailGradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'ws4',
    name: 'Design Lab',
    type: 'CREATIVE',
    status: 'online',
    onlineCount: 12,
    totalMembers: 18,
    lastActive: 'Active now',
    description: 'Experimental design lab for prototyping 3D assets.',
    owner: 'Jessica Day',
    createdAt: 'Dec 10, 2024',
    storageUsed: '890 MB',
    isFavorite: false,
    thumbnailGradient: 'from-rose-500 to-orange-500'
  }
];

const MOCK_SESSIONS = [
  {
    id: 's1',
    workspaceId: 'ws1',
    name: 'Design Review Meeting',
    status: 'live',
    participants: 8,
    startTime: '30 min ago',
    thumbnail: 'bg-gradient-to-r from-pink-500 to-rose-500'
  },
  {
    id: 's2',
    workspaceId: 'ws1',
    name: 'Brainstorming Session',
    status: 'scheduled',
    participants: 12,
    startTime: 'Tomorrow, 2:00 PM',
    thumbnail: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  },
  {
    id: 's3',
    workspaceId: 'ws1',
    name: 'Product Planning Workshop',
    status: 'ended',
    participants: 15,
    duration: '1h 45m',
    endedTime: '2 days ago',
    thumbnail: 'bg-slate-700'
  }
];

const MOCK_FILES = [
  { id: 'f1', name: 'Project Mockups.png', type: 'image', size: '2.4 MB', owner: 'Sarah Chen', date: '2 hours ago' },
  { id: 'f2', name: 'Brand Guidelines.pdf', type: 'pdf', size: '5.1 MB', owner: 'Mike Ross', date: '5 hours ago' },
  { id: 'f3', name: 'Demo Video.mp4', type: 'video', size: '45.2 MB', owner: 'Jessica Day', date: '1 day ago' },
  { id: 'f4', name: 'Background Music.mp3', type: 'audio', size: '3.8 MB', owner: 'Tom Wilson', date: '2 days ago' },
  { id: 'f5', name: 'Design Assets.zip', type: 'zip', size: '128 MB', owner: 'Sarah Chen', date: '3 days ago' },
  { id: 'f6', name: 'Hero Banner.jpg', type: 'image', size: '1.8 MB', owner: 'Mike Ross', date: '1 day ago' },
];

const MOCK_MEMBERS = [
  { id: 'm1', name: 'Sarah Chen', role: 'Owner', status: 'online', avatar: 'SC' },
  { id: 'm2', name: 'Mike Ross', role: 'Admin', status: 'online', avatar: 'MR' },
  { id: 'm3', name: 'Jessica Day', role: 'Member', status: 'online', avatar: 'JD' },
  { id: 'm4', name: 'Tom Wilson', role: 'Member', status: 'offline', avatar: 'TW' },
  { id: 'm5', name: 'Rachel Green', role: 'Member', status: 'online', avatar: 'RG' },
];

const SPACE_TEMPLATES = [
    { id: 't1', name: 'Aeries Gallery', category: 'CREATIVE', gradient: 'from-purple-500 to-indigo-600' },
    { id: 't2', name: 'Tech Lab', category: 'TECH', gradient: 'from-slate-800 to-black' },
    { id: 't4', name: 'Mountain Lounge', category: 'MEETING', gradient: 'from-amber-400 to-orange-500' },
    { id: 't5', name: 'Agora', category: 'EDUCATION', gradient: 'from-cyan-500 to-blue-600' },
];

// --- COMPONENTS ---

const StatusBadge = ({ status, count }) => {
  const isOnline = status === 'online';
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
      {isOnline ? `Online (${count})` : 'Offline'}
    </div>
  );
};

const FileCard = ({ file }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-purple-500" />;
      case 'video': return <Video className="w-8 h-8 text-rose-500" />;
      case 'audio': return <Music className="w-8 h-8 text-amber-500" />;
      case 'pdf': return <FileText className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
      <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
        {getIcon(file.type)}
      </div>
      <h3 className="text-sm font-medium text-slate-900 truncate">{file.name}</h3>
      <p className="text-xs text-slate-500 mt-1">{file.size}</p>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <div className="w-5 h-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-600">
          {file.owner.charAt(0)}
        </div>
        <span className="text-[10px] text-slate-400">{file.date}</span>
      </div>
      <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50">
        <MoreVertical className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
};

const SessionCard = ({ session, onJoin }) => {
  const isLive = session.status === 'live';
  
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-lg ${session.thumbnail} flex items-center justify-center text-white shadow-inner`}>
          <MonitorPlay className="w-6 h-6 opacity-80" />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{session.name}</h3>
            {isLive ? (
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wide">Live</span>
            ) : session.status === 'scheduled' ? (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">Scheduled</span>
            ) : (
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wide">Ended</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {session.participants} participants
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {isLive ? session.startTime : session.status === 'scheduled' ? session.startTime : session.endedTime}
            </span>
          </div>
        </div>
      </div>

      <div>
        {isLive ? (
          <button 
            onClick={() => onJoin(session)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-slate-200"
          >
            <Video className="w-4 h-4" />
            Join Session
          </button>
        ) : session.status === 'scheduled' ? (
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            Remind Me
          </button>
        ) : (
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
            <MonitorPlay className="w-4 h-4" />
            Watch Replay
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function CollabSpaceApp() {
  const [view, setView] = useState('dashboard'); // dashboard | workspace | lobby
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [launchingSession, setLaunchingSession] = useState(null);

  // --- NEW STATE VARIABLES FOR FILTERING & CREATION ---
  const [spaces, setSpaces] = useState(INITIAL_WORKSPACES);
  const [activeStatus, setActiveStatus] = useState('all'); // 'all', 'online', 'offline'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'favorites', 'owned'

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [createStep, setCreateStep] = useState(1);
  const [generatedLink, setGeneratedLink] = useState('');
  const [inviteMethod, setInviteMethod] = useState('link'); // 'link' | 'email'

  // --- FILTER LOGIC ---
  const filteredSpaces = spaces.filter(space => {
    // Search Filter
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab Filter (Dashboard tabs)
    let matchesTab = true;
    if (filterTab === 'favorites') matchesTab = space.isFavorite;
    if (filterTab === 'owned') matchesTab = space.owner === CURRENT_USER.name; // Simple check based on current user name

    // Status Filter
    let matchesStatus = true;
    if (activeStatus === 'online') matchesStatus = space.status === 'online';
    if (activeStatus === 'offline') matchesStatus = space.status === 'offline';

    // Category Filter
    let matchesCategory = true;
    if (activeCategory !== 'all') matchesCategory = space.type === activeCategory;

    return matchesSearch && matchesTab && matchesStatus && matchesCategory;
  });

  // --- ACTIONS ---
  const handleWorkspaceClick = (ws) => {
    setSelectedWorkspace(ws);
    setView('workspace');
    setActiveTab('sessions');
  };

  const handleJoinSession = (session) => {
    setLaunchingSession(session);
    setView('lobby');
  };

  const handleBack = () => {
    if (view === 'workspace') {
      setView('dashboard');
      setSelectedWorkspace(null);
    } else if (view === 'lobby') {
      setView('workspace');
      setLaunchingSession(null);
    }
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setSpaces(spaces.map(space => 
      space.id === id ? { ...space, isFavorite: !space.isFavorite } : space
    ));
  };

  const handleCreateConfirm = (template) => {
    const newSpace = {
      id: `ws${spaces.length + 1}`,
      name: newSpaceName,
      type: template.category,
      status: 'online',
      onlineCount: 1,
      totalMembers: 1,
      lastActive: 'Just now',
      description: newSpaceDescription || `A new ${template.category} space.`,
      owner: CURRENT_USER.name,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      storageUsed: '0 MB',
      isFavorite: false,
      thumbnailGradient: template.gradient
    };

    setSpaces([...spaces, newSpace]);
    setGeneratedLink(`https://app.collabspace.io/join/${Math.random().toString(36).substring(7)}`);
    setInviteMethod('link'); // Reset to default state
    setCreateStep(3);
  };

  const handleFinalizeCreate = () => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewSpaceName('');
    setNewSpaceDescription('');
    setGeneratedLink('');
  };

  // --- SUB-VIEWS ---

  const DashboardView = () => (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
      
      {/* --- FILTER BAR --- */}
      <div className="flex flex-col gap-6 mb-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Main Tabs (All/Favorites/Owned) */}
          <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit">
             {['all', 'favorites', 'owned'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setFilterTab(tab)}
                 className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${filterTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {tab}
               </button>
             ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
             {/* Search Input (Moved from Header) */}
             <div className="relative group flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spaces..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
             </div>

             <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

             {/* Category Select */}
             <div className="relative group">
               <select 
                 className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:border-slate-300 transition-colors"
                 value={activeCategory}
                 onChange={(e) => setActiveCategory(e.target.value)}
               >
                 <option value="all">All Categories</option>
                 <option value="CREATIVE">Creative</option>
                 <option value="TECH">Tech</option>
                 <option value="EDUCATION">Education</option>
                 <option value="MEETING">Meeting</option>
               </select>
               <ChevronLeft className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
             </div>

             {/* Status Select */}
             <div className="relative group">
               <select 
                 className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:border-slate-300 transition-colors"
                 value={activeStatus}
                 onChange={(e) => setActiveStatus(e.target.value)}
               >
                 <option value="all">All Status</option>
                 <option value="online">Online</option>
                 <option value="offline">Offline</option>
               </select>
               <ChevronLeft className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
             </div>

             {/* View Toggle */}
             <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING CREATE BUTTON --- */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-slate-900 text-white rounded-full shadow-2xl shadow-indigo-500/30 hover:bg-slate-800 hover:scale-110 transition-all z-50 group flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          Create Space
        </span>
      </button>

      {/* --- CONTENT GRID/LIST --- */}
      {filteredSpaces.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24" // Added pb-24 to prevent FAB overlap
          : "flex flex-col gap-3 pb-24"
        }>
          {filteredSpaces.map((ws, index) => (
            <div 
              key={ws.id} 
              onClick={() => handleWorkspaceClick(ws)}
              className={`group bg-white rounded-xl border-2 border-transparent hover:border-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex ${viewMode === 'grid' ? 'flex-col h-[320px]' : 'flex-row items-center h-24 border border-slate-200 hover:border-slate-900'}`}
            >
              {/* Card Header (Grid Mode) or Left Icon (List Mode) */}
              <div className={`${viewMode === 'grid' ? 'h-40 relative' : 'w-24 h-full relative'} bg-slate-100 overflow-hidden shrink-0`}>
                 <div className={`absolute inset-0 bg-gradient-to-br ${ws.thumbnailGradient || 'from-slate-200 to-slate-100'} group-hover:scale-105 transition-transform duration-700`}></div>
                 
                 {/* Icons Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                    <LayoutGrid className={`${viewMode === 'grid' ? 'w-16 h-16' : 'w-8 h-8'} text-white mix-blend-overlay`} />
                 </div>
                 
                 {viewMode === 'grid' && (
                    <>
                      <div className="absolute top-4 left-4">
                        <div className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm">
                           {ws.type === 'CREATIVE' && <ImageIcon className="w-5 h-5 text-purple-600"/>}
                           {ws.type === 'TECH' && <MonitorPlay className="w-5 h-5 text-blue-600"/>}
                           {ws.type === 'EDUCATION' && <FileText className="w-5 h-5 text-emerald-600"/>}
                           {ws.type === 'MEETING' && <Users className="w-5 h-5 text-amber-600"/>}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <StatusBadge status={ws.status} count={ws.onlineCount} />
                      </div>
                    </>
                 )}
                 
                 {/* Favorite Button Overlay */}
                 <button
                    onClick={(e) => toggleFavorite(e, ws.id)}
                    className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${ws.isFavorite ? 'bg-white text-rose-500 shadow-md' : 'bg-black/20 text-white hover:bg-white hover:text-rose-500 opacity-0 group-hover:opacity-100'}`}
                 >
                    <Heart className={`w-4 h-4 ${ws.isFavorite ? 'fill-current' : ''}`} />
                 </button>
              </div>

              {/* Card Body */}
              <div className={`p-5 flex-1 flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center justify-between gap-4'}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{ws.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{ws.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {ws.totalMembers} members
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${WORKSPACE_TYPES[ws.type]?.color || 'bg-slate-100 text-slate-600 border-slate-200'} border`}>
                        {ws.type}
                      </span>
                    </div>
                  </>
                ) : (
                  // LIST VIEW CONTENT
                  <>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 truncate">{ws.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{ws.description}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 w-32">
                       <Users className="w-3.5 h-3.5" />
                       {ws.totalMembers} members
                    </div>
                    <div className="hidden md:flex items-center justify-center w-24">
                       <StatusBadge status={ws.status} count={ws.onlineCount} />
                    </div>
                    <div className="hidden sm:flex justify-end w-24">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${WORKSPACE_TYPES[ws.type]?.color || 'bg-slate-100 text-slate-600 border-slate-200'} border`}>
                          {ws.type}
                        </span>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-slate-300 rotate-180" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Search className="w-8 h-8 text-slate-300" />
           </div>
           <h3 className="text-slate-900 font-medium text-lg">No workspaces found</h3>
           <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your search or filters.</p>
           <button 
             onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveStatus('all'); setFilterTab('all')}}
             className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
           >
             Clear all filters
           </button>
        </div>
      )}

      {/* --- CREATE MODAL --- */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${createStep === 3 ? 'max-w-xl' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            
            {/* STEP 1: Details */}
            {createStep === 1 && (
              <>
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-8">
                     <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                     <span className="font-bold text-slate-900">CollabSpace</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's build your space 🎉</h2>
                  <p className="text-slate-500 mb-8">Create a persistent room for your team to collaborate.</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Space Name</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="e.g. Acme Corp HQ"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Description</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-24 resize-none"
                        placeholder="What is this space for?"
                        value={newSpaceDescription}
                        onChange={(e) => setNewSpaceDescription(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => setCreateStep(2)}
                      disabled={!newSpaceName.trim()}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preview Side */}
                <div className="hidden md:flex flex-1 bg-slate-50 border-l border-slate-100 items-center justify-center p-10 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50"></div>
                   
                   {/* Mock Card Preview */}
                   <div className="relative w-64 bg-white rounded-xl shadow-xl p-4 border border-slate-200 transform rotate-3 transition-transform hover:rotate-0">
                      <div className="h-32 bg-slate-200 rounded-lg mb-4 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                      <div className="flex gap-2 mt-4">
                         <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white"></div>
                         <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white -ml-3"></div>
                      </div>
                   </div>
                </div>
              </>
            )}

            {/* STEP 2: Templates */}
            {createStep === 2 && (
               <div className="flex flex-col h-full w-full">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <button onClick={() => setCreateStep(1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                     </button>
                     <h2 className="text-lg font-bold text-slate-900">Select a Template</h2>
                     <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 overflow-y-auto max-h-[60vh]">
                     {SPACE_TEMPLATES.map(template => (
                        <div 
                           key={template.id}
                           onClick={() => handleCreateConfirm(template)}
                           className="group bg-white rounded-xl border border-slate-200 p-3 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-all"
                        >
                           <div className={`h-32 rounded-lg bg-gradient-to-br ${template.gradient} mb-3 relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                           </div>
                           <div className="flex justify-between items-center px-1">
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{template.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">{template.category}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* STEP 3: Invite */}
            {createStep === 3 && (
               <div className="p-8 flex flex-col items-center text-center w-full">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                     <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Space Created!</h2>
                  <p className="text-slate-500 mb-8 max-w-sm">Your new space <strong>{newSpaceName}</strong> is ready. Invite your team to get started.</p>

                  {/* Dynamic Content Switcher: Link vs Email */}
                  {inviteMethod === 'link' ? (
                     <>
                        {/* LINK VIEW */}
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                           <div className="flex-1 font-mono text-sm text-slate-600 truncate text-left">
                              {generatedLink}
                           </div>
                           <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-indigo-600 transition-all">
                              <Copy className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="flex gap-3 w-full">
                           <button 
                              onClick={() => setInviteMethod('email')}
                              className="flex-1 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                           >
                              <Mail className="w-4 h-4" />
                              Invite by Email
                           </button>
                           <button 
                              onClick={handleFinalizeCreate}
                              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
                           >
                              Go to Space
                           </button>
                        </div>
                     </>
                  ) : (
                     <>
                        {/* EMAIL FORM VIEW */}
                        <div className="w-full mb-6">
                           <label className="block text-left text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Addresses</label>
                           <textarea 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none transition-all"
                              rows="3"
                              placeholder="Enter email addresses separated by commas..."
                              autoFocus
                           />
                           <button className="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
                              <Send className="w-4 h-4" />
                              Send Invites
                           </button>
                        </div>

                        <div className="flex gap-3 w-full">
                           <button 
                              onClick={() => setInviteMethod('link')}
                              className="flex-1 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                           >
                              Back to Link
                           </button>
                           <button 
                              onClick={handleFinalizeCreate}
                              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
                           >
                              Go to Space
                           </button>
                        </div>
                     </>
                  )}
               </div>
            )}

          </div>
        </div>
      )}

    </div>
  );

  const WorkspaceView = () => (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{selectedWorkspace.name}</h1>
                <StatusBadge status={selectedWorkspace.status} count={selectedWorkspace.onlineCount} />
              </div>
              <p className="text-slate-500">{selectedWorkspace.description}</p>
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"><Share2 className="w-5 h-5"/></button>
               <button className="p-2 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"><Settings className="w-5 h-5"/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden max-w-7xl mx-auto w-full p-8 flex gap-8">
        
        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 mb-6">
            {[
              { id: 'sessions', label: 'SESSIONS', icon: Video },
              { id: 'files', label: 'FILES', icon: FileText },
              { id: 'boards', label: 'BOARDS', icon: LayoutGrid },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Upcoming & Active</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded shadow-md hover:bg-slate-800 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    New Session
                  </button>
                </div>
                {MOCK_SESSIONS.map(session => (
                  <SessionCard key={session.id} session={session} onJoin={handleJoinSession} />
                ))}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                      <button className="p-1.5 bg-slate-200 rounded text-slate-700"><Grid className="w-4 h-4"/></button>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><ListIcon className="w-4 h-4"/></button>
                      <div className="h-4 w-px bg-slate-300 mx-2"></div>
                      <select className="text-sm bg-transparent font-medium text-slate-600 focus:outline-none cursor-pointer">
                        <option>All Files</option>
                        <option>Images</option>
                        <option>Documents</option>
                      </select>
                   </div>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded shadow-md hover:bg-slate-800">
                      <Download className="w-3.5 h-3.5" />
                      Upload File
                   </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {MOCK_FILES.map(file => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'boards' && (
               <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <LayoutGrid className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-medium">No Boards Created Yet</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-4">Start visualizing your ideas with a whiteboard.</p>
                  <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg">Create Board</button>
               </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Workspace Info) */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Workspace Info</h4>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-slate-500 text-xs mb-1">Owner</span>
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">SC</div>
                   <span className="font-medium text-slate-900">{selectedWorkspace.owner}</span>
                </div>
              </div>
              <div>
                <span className="block text-slate-500 text-xs mb-1">Created</span>
                <span className="font-medium text-slate-900">{selectedWorkspace.createdAt}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs mb-1">Storage Used</span>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-1 mb-1">
                   <div className="bg-indigo-500 h-2 rounded-full w-[35%]"></div>
                </div>
                <span className="font-medium text-slate-900">{selectedWorkspace.storageUsed}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members ({selectedWorkspace.totalMembers})</h4>
               <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">Invite</button>
            </div>
            
            <div className="space-y-3">
              {MOCK_MEMBERS.map(member => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 leading-none">{member.name}</h5>
                      <span className="text-[10px] text-slate-500">{member.role}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded text-slate-400 transition-all">
                    <Mic className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              View All Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LobbyView = () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
         <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl">
         <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30">
            <MonitorPlay className="w-10 h-10 text-white" />
         </div>
         
         <h2 className="text-2xl font-bold text-white mb-2">Joining Session...</h2>
         <p className="text-slate-300 mb-8">{launchingSession?.name}</p>

         <div className="flex flex-col gap-3 max-w-xs mx-auto mb-8">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
               <span>Loading Assets</span>
               <span>78%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[78%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Connecting to Spatial Audio Gateway...</p>
         </div>

         <div className="flex gap-4 justify-center">
            <button 
               onClick={handleBack}
               className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/5"
            >
               Cancel
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
               Enter Room <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
      
      <div className="absolute bottom-8 text-slate-500 text-xs">
         CollabSpace v2.4.0 • Unity WebGL Client
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* UPDATED SIDEBAR 
          - Fixed width rail (w-[72px])
          - Flex column layout
          - Logo at top, Profile at bottom
          - No text labels, just icons for navigation
      */}
      <aside className="w-[72px] bg-slate-900 text-slate-300 flex flex-col items-center py-6 border-r border-slate-800 shrink-0 z-20">
        
        {/* LOGO AREA */}
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
           <span className="text-white font-bold text-xl">C</span>
        </div>

        {/* NAVIGATION ICONS */}
        <nav className="flex-1 space-y-4 w-full px-2">
          {[
            { id: 'home', icon: Home, label: 'Workspaces' },
          ].map(item => (
             <button 
               key={item.id}
               onClick={() => {
                 setView('dashboard');
                 setSelectedWorkspace(null);
               }}
               className={`w-full aspect-square flex items-center justify-center rounded-xl transition-all group relative ${view === 'dashboard' && item.id === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
             >
               <item.icon className="w-5 h-5" />
               
               {/* Tooltip on Hover */}
               <div className="absolute left-14 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
               </div>
             </button>
          ))}
        </nav>

        {/* BOTTOM PROFILE AREA */}
        <div className="mt-auto space-y-4 w-full px-2 flex flex-col items-center">
           <button className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-indigo-500 transition-colors relative group">
              <img src={CURRENT_USER.avatar} alt="User" className="w-full h-full object-cover bg-indigo-50" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
           </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* TOP HEADER REMOVED: 
            The global <header> that was here is gone. 
            The search bar has been moved into DashboardView.
            Profile avatar is already in sidebar.
        */}

        {/* View Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50">
          {view === 'dashboard' && <DashboardView />}
          {view === 'workspace' && <WorkspaceView />}
          {view === 'lobby' && <LobbyView />}
        </main>
      </div>

    </div>
  );
}