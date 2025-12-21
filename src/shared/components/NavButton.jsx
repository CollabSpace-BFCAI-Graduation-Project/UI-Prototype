import React from 'react';

export default function NavButton({ icon, active, tooltip, onClick }) {
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
