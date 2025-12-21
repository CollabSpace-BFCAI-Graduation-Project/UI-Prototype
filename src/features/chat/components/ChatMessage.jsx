import React from 'react';

export default function ChatMessage({ msg }) {
    if (!msg) return null;

    const userName = msg.user || 'User';
    const avatarColor = msg.avatarColor || 'bg-gray-200';
    const time = msg.time || '';

    return (
        <div className={`flex gap-4 max-w-[80%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-10 h-10 rounded-full border-2 border-black flex-shrink-0 flex items-center justify-center font-bold text-xs ${avatarColor}`}>{userName[0]}</div>
            <div className={`${msg.isMe ? 'flex flex-col items-end' : ''}`}>
                <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}><span className="font-black text-sm">{userName}</span><span className="text-xs text-gray-500 font-bold">{time}</span></div>
                <div className={`border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${msg.isMe ? 'bg-black text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]' : 'bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'}`}><p className="font-medium">{msg.text}</p></div>
            </div>
        </div>
    );
}

