import React from 'react';
import { ArrowLeft, Gamepad2, MessageSquare, Link, FileText, Users, Eye } from 'lucide-react';
import SpaceStats from './components/SpaceStats';

export default function SpaceDetailsView({
    activeSpace,
    onBack,
    onLaunchUnity,
    onTextChat,
    onInvite,
    onFilesClick,
    onMembersClick,
    getFileIcon,
    setViewingFile
}) {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-black hover:-translate-x-1 transition-all"><ArrowLeft size={20} /> Back to Dashboard</button>

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
                        <button onClick={onLaunchUnity} className="flex-1 min-w-[200px] bg-green-400 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-green-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 group">
                            <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Join Space (3D)</span>
                        </button>
                        <button onClick={onTextChat} className="flex-1 min-w-[140px] bg-yellow-300 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                            <MessageSquare size={20} /> Text Chat
                        </button>
                        <button onClick={onInvite} className="flex-1 min-w-[140px] bg-white text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                            <Link size={20} /> Invite
                        </button>
                    </div>

                    {/* Stats */}
                    <SpaceStats memberCount={activeSpace.memberCount} userCount={activeSpace.userCount} />

                    {/* RECENT FILES */}
                    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black flex items-center gap-2"><FileText size={20} /> Shared Files</h3>
                            <button onClick={onFilesClick} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ArrowLeft size={16} className="rotate-180" /></button>
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
                    <div onClick={onMembersClick} className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-colors group">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black flex items-center gap-2"><Users size={20} /> Members</h3>
                            <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(activeSpace.members || []).slice(0, 6).map((m, i) => (
                                <div key={i} className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold text-xs ${m.avatar}`}>{m.name[0]}</div>
                            ))}
                            <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-bold text-xs">+{(activeSpace.memberCount || 0) - (activeSpace.members?.length || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
