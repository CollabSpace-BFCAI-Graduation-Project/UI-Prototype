import React from 'react';
import { Plus } from 'lucide-react';
import SpaceFilters from './components/SpaceFilters';
import SpaceCard from './components/SpaceCard';

export default function DashboardView({
    filteredSpaces,
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    enterSpace,
    onCreateClick,
    userFavorites,
    onToggleFavorite,
    userName
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">My Spaces</h1>
                    <p className="text-gray-500 font-medium">Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋</p>
                </div>

                <button
                    onClick={onCreateClick}
                    className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span>Create Space</span>
                </button>
            </header>

            <SpaceFilters
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
            />

            {/* Spaces Grid */}
            {filteredSpaces.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                    {filteredSpaces.map((space) => (
                        <SpaceCard
                            key={space.id}
                            space={space}
                            viewMode={viewMode}
                            onEnter={enterSpace}
                            isFavorite={userFavorites?.includes(space.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
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
    );
}
