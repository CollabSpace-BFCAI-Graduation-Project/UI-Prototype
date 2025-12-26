import React from 'react';
import { Heart, Lock, Globe } from 'lucide-react';
import { getImageUrl, isImageThumbnail, getSpaceThumbnailStyle, getSpaceThumbnailUrl } from '../../../shared/utils/helpers';
import { useAuthStore } from '../../../store';

export default function SpaceCard({ space, viewMode, onEnter, isFavorite, onToggleFavorite }) {
    const { user } = useAuthStore();
    const memberCount = space.members?.length || space.memberCount || 0;
    const isOwner = user?.id === space.ownerId;

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(space.id);
        }
    };

    // List View - Compact horizontal layout
    if (viewMode === 'list') {
        return (
            <div
                onClick={() => onEnter(space)}
                className="group relative bg-white border-2 border-black rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center h-20"
            >
                {/* Thumbnail - fixed size square */}
                <div
                    className="relative h-full w-24 shrink-0 border-r-2 border-black"
                    style={getSpaceThumbnailStyle(space.thumbnail)}
                >
                    {isImageThumbnail(space.thumbnail) && (
                        <img
                            src={getSpaceThumbnailUrl(space.thumbnail)}
                            alt={space.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    {/* Online badge - small */}
                    <div className="absolute top-1 left-1 z-10">
                        {space.isOnline ? (
                            <span className="bg-green-400 border border-black text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">
                                LIVE
                            </span>
                        ) : (
                            <span className="bg-gray-200 text-gray-600 border border-black text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">
                                OFF
                            </span>
                        )}
                    </div>
                </div>

                {/* Content - horizontal layout */}
                <div className="flex-1 flex items-center justify-between px-4 py-2 min-w-0">
                    {/* Left: Name & Description */}
                    <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-base font-black text-gray-900 truncate group-hover:text-pink-600 transition-colors" title={space.name}>
                                {space.name}
                            </h3>
                            {space.isPrivate ? (
                                <Lock size={12} className="text-pink-500 shrink-0" />
                            ) : (
                                <Globe size={12} className="text-cyan-600 shrink-0" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{space.description || 'No description'}</p>
                    </div>

                    {/* Center: Category & Members */}
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase border border-blue-200">
                            {space.category}
                        </span>
                        <div className="flex -space-x-1">
                            {(space.members || []).slice(0, 3).map((member, i) => (
                                <div
                                    key={member.memberId || i}
                                    className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white overflow-hidden"
                                    style={{ backgroundColor: member.avatarImage ? 'transparent' : (member.avatarColor || '#6b7280') }}
                                    title={member.name}
                                >
                                    {getImageUrl(member.avatarImage) ? (
                                        <img src={getImageUrl(member.avatarImage)} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name?.[0] || '?'
                                    )}
                                </div>
                            ))}
                            {memberCount > 3 && (
                                <div className="w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                    +{memberCount - 3}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Favorite button */}
                    <button
                        onClick={handleFavoriteClick}
                        className="ml-4 p-1.5 rounded-lg border-2 border-black hover:bg-pink-50 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none shrink-0"
                    >
                        <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    </button>
                </div>
            </div>
        );
    }

    // Grid View - Original card layout
    return (
        <div
            onClick={() => onEnter(space)}
            className="group relative bg-white border-2 border-black rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
            <div
                className="relative h-40 overflow-hidden"
                style={getSpaceThumbnailStyle(space.thumbnail)}
            >
                {isImageThumbnail(space.thumbnail) && (
                    <img
                        src={getSpaceThumbnailUrl(space.thumbnail)}
                        alt={space.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {space.isOnline ? (
                        <span className="bg-green-400 text-black border-2 border-black text-xs font-bold px-2 py-1 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                            LIVE {space.userCount > 0 && `(${space.userCount})`}
                        </span>
                    ) : (
                        <span className="bg-gray-200 text-gray-600 border-2 border-black text-xs font-bold px-2 py-1 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            OFFLINE
                        </span>
                    )}
                </div>
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 z-10 bg-white p-2 rounded-lg border-2 border-black hover:bg-pink-50 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[1px] active:translate-x-[1px]"
                >
                    <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                </button>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2 h-[60px]">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold tracking-wider uppercase border border-blue-200">
                                {space.category}
                            </span>
                            {space.isPrivate ? (
                                <div className="p-1 rounded-md bg-pink-100 text-pink-500 border border-pink-200" title="Private Space">
                                    <Lock size={14} />
                                </div>
                            ) : (
                                <div className="p-1 rounded-md bg-cyan-100 text-cyan-600 border border-cyan-200" title="Public Space">
                                    <Globe size={14} />
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-pink-600 transition-colors line-clamp-1 break-words" title={space.name}>{space.name}</h3>
                    </div>
                </div>
                <div className="h-[40px] mb-4">
                    <p className="text-sm text-gray-500 font-medium line-clamp-2">{space.description}</p>
                </div>
                <div className="flex items-center justify-between border-t-2 border-gray-100 pt-3 mt-auto">
                    <div className="flex -space-x-2">
                        {(space.members || []).slice(0, 3).map((member, i) => (
                            <div
                                key={member.memberId || i}
                                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                                style={{ backgroundColor: member.avatarImage ? 'transparent' : (member.avatarColor || '#6b7280') }}
                                title={member.name}
                            >
                                {getImageUrl(member.avatarImage) ? (
                                    <img src={getImageUrl(member.avatarImage)} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    member.name?.[0] || '?'
                                )}
                            </div>
                        ))}
                        {memberCount > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                +{memberCount - 3}
                            </div>
                        )}
                        {memberCount === 0 && (
                            <span className="text-xs text-gray-400 font-medium">No members yet</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
