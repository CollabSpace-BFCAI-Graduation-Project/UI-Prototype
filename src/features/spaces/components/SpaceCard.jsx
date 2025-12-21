import React from 'react';
import { Heart } from 'lucide-react';

export default function SpaceCard({ space, viewMode, onEnter, onToggleFavorite }) {
    return (
        <div
            onClick={() => onEnter(space)}
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
                <button onClick={(e) => onToggleFavorite(e, space.id)} className="absolute top-3 right-3 bg-white p-2 rounded-lg border-2 border-black hover:bg-pink-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
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
    );
}
