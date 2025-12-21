import React from 'react';
import { Search, Grid, List, MoreVertical } from 'lucide-react';

export default function SpaceFilters({
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode
}) {
    return (
        <div className="bg-white border-2 border-black rounded-2xl p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-30">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl border-2 border-black w-full lg:w-auto overflow-x-auto">
                {['all', 'member', 'favorites', 'owned'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab
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
    );
}
