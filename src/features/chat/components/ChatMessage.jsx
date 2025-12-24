import React from 'react';
import { useAuthStore } from '../../../store';
import { getImageUrl } from '../../../shared/utils/helpers';

export default function ChatMessage({ msg }) {
    const { user: currentUser } = useAuthStore();

    if (!msg) return null;

    // Support both formats: sender (backend) and user (legacy)
    const userName = msg.sender || msg.user || 'User';
    const senderId = msg.senderId || msg.userId;
    const time = msg.time || '';

    // Check if this message is from the current user
    const isMe = currentUser && senderId && senderId === currentUser.id;

    // Avatar - use message avatar data directly (server already joins user data)
    const avatarImage = getImageUrl(msg.avatarImage);
    const avatarColor = msg.avatarColor || '#ec4899';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    // System messages
    if (msg.type === 'system') {
        return (
            <div className="text-center text-sm text-gray-500 font-medium py-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    {msg.text}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex gap-4 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
            {/* Avatar */}
            <div
                className="w-10 h-10 rounded-full border-2 border-black flex-shrink-0 flex items-center justify-center font-bold text-xs overflow-hidden"
                style={{ backgroundColor: avatarImage ? 'transparent' : avatarColor }}
            >
                {avatarImage ? (
                    <img src={avatarImage} alt={userName} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white">{initials}</span>
                )}
            </div>

            {/* Message Content */}
            <div className={`${isMe ? 'flex flex-col items-end' : ''}`}>
                <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-black text-sm">{isMe ? 'You' : userName}</span>
                    <span className="text-xs text-gray-500 font-bold">{time}</span>
                </div>
                <div className={`border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${isMe ? 'bg-black text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]' : 'bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'}`}>
                    <p className="font-medium">{msg.text}</p>
                </div>
            </div>
        </div>
    );
}
