import React, { useState } from 'react';
import { useAuthStore, useChatStore, useUIStore } from '../../../store';
import { getImageUrl } from '../../../shared/utils/helpers';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export default function ChatMessage({ msg }) {
    const { user: currentUser } = useAuthStore();
    const { updateMessage, deleteMessage } = useChatStore();
    const { openConfirmation } = useUIStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');

    if (!msg) return null;

    // Support both formats: sender (backend) and user (legacy)
    const userName = msg.sender || msg.user || 'User';
    const senderId = msg.senderId || msg.userId;
    const time = msg.time || '';

    // Check if this message is from the current user
    const isMe = currentUser && senderId && senderId === currentUser.id;

    // Permissions
    const { activeChatSpace } = useChatStore();
    const isOwner = activeChatSpace?.ownerId === currentUser?.id;
    const isAdmin = activeChatSpace?.members?.find(m => m.userId === currentUser?.id)?.role === 'Admin';

    // Time limit (15 mins)
    const isWithinTimeLimit = (Date.now() - new Date(msg.createdAt).getTime() < 15 * 60 * 1000);

    const canEdit = isMe && isWithinTimeLimit;
    const canDelete = canEdit || isOwner || isAdmin;

    // Avatar - use message avatar data directly (server already joins user data)
    const avatarImage = getImageUrl(msg.avatarImage);
    const avatarColor = msg.avatarColor || '#ec4899';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const handleEdit = () => {
        setEditText(msg.text);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editText.trim() !== msg.text) {
            await updateMessage(msg.id, editText, currentUser.id);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        openConfirmation({
            title: 'Delete Message',
            message: 'Are you sure you want to delete this message? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                await deleteMessage(msg.id, currentUser.id);
            }
        });
    };

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

    // Deleted messages - show placeholder
    if (msg.deletedAt) {
        const deletedLabel = msg.deletedByRole === 'author'
            ? 'This message was deleted'
            : `This message was removed by ${msg.deletedByRole}`;

        return (
            <div className={`flex gap-4 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''} animate-in fade-in duration-300`}>
                <div className={`${isMe ? 'flex flex-col items-end' : ''} max-w-full`}>
                    <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="font-black text-sm text-gray-400">{isMe ? 'You' : userName}</span>
                        <span className="text-xs text-gray-400 font-bold">{time}</span>
                    </div>
                    <div className={`border-2 border-dashed border-gray-300 p-4 rounded-2xl bg-gray-50 ${isMe ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' : 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'}`}>
                        <p className="text-gray-400 italic text-sm">{deletedLabel}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex gap-4 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300 group relative`}>
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
            <div className={`${isMe ? 'flex flex-col items-end' : ''} max-w-full`}>
                <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-black text-sm">{isMe ? 'You' : userName}</span>
                    <span className="text-xs text-gray-500 font-bold">{time}</span>
                </div>

                <div className="group relative w-fit">
                    {isEditing ? (
                        <div className="flex gap-2 items-center w-full min-w-[200px]">
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <button onClick={handleSave} className="p-1 hover:bg-green-100 rounded text-green-600"><Check size={16} /></button>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-red-100 rounded text-red-600"><X size={16} /></button>
                        </div>
                    ) : (
                        <div className={`border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${isMe ? 'bg-black text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]' : 'bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'} transition-all`}>
                            <p className="font-medium break-words">{msg.text}</p>
                        </div>
                    )}

                    {/* Actions (Hover) */}
                    {(canEdit || canDelete) && !isEditing && (
                        <div className={`absolute top-full mt-3 ${isMe ? 'right-0' : 'left-0'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                            {canEdit && (
                                <button
                                    onClick={handleEdit}
                                    className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-blue-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                    title="Edit message"
                                >
                                    <Edit2 size={12} />
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-red-50 text-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                    title="Delete message"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
