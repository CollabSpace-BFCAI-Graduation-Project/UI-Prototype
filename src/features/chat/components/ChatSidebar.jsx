import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useChatStore } from '../../../store';

export default function ChatSidebar() {
    const { activeChatSpace, setActiveChatSpace } = useChatStore();

    if (!activeChatSpace) return null;

    return (
        <div className="w-80 bg-white border-2 border-black rounded-3xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden hidden lg:flex flex-col">
            <div className="p-6 border-b-2 border-black bg-pink-50 flex items-center gap-2">
                <button onClick={() => setActiveChatSpace(null)} className="p-1 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={20} /></button>
                <h2 className="text-xl font-black truncate">{activeChatSpace.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="p-3 bg-accent-100 border-2 border-black rounded-xl font-bold flex justify-between items-center cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"><span># General</span></div>
            </div>
        </div>
    );
}
