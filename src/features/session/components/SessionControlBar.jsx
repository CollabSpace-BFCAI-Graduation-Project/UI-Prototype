import React from 'react';

export default function SessionControlBar() {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md p-2 rounded-xl border-2 border-white/20 flex gap-2">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold text-white hover:bg-white/20 transition-colors cursor-pointer">
                Mic
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold text-white hover:bg-white/20 transition-colors cursor-pointer">
                Cam
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 font-bold text-white hover:bg-white/20 transition-colors cursor-pointer">
                Emo
            </div>
        </div>
    );
}
