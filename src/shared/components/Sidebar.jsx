import React from 'react';
import { Grid, MessageSquare, Users, Settings } from 'lucide-react';
import NavButton from './NavButton';
import { getAvatarProps } from '../utils/helpers';

export default function Sidebar({
    currentView,
    setCurrentView,
    enterChatLobby,
    onSettingsClick,
    user
}) {
    const { imageUrl, initials, backgroundColor } = getAvatarProps(user);

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 bg-white border-2 border-black rounded-full flex flex-col items-center py-8 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:flex">
            <div
                onClick={() => setCurrentView('dashboard')}
                className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-8 transform hover:scale-110 transition-transform cursor-pointer"
            >
                G
            </div>

            <div className="flex-1 w-full flex flex-col items-center gap-4">
                <NavButton
                    icon={<Grid size={20} />}
                    active={currentView === 'dashboard'}
                    tooltip="Spaces"
                    onClick={() => setCurrentView('dashboard')}
                />
                <NavButton
                    icon={<MessageSquare size={20} />}
                    active={currentView === 'chat'}
                    tooltip="Chat"
                    onClick={enterChatLobby}
                />
                <NavButton
                    icon={<Users size={20} />}
                    active={currentView === 'team'}
                    tooltip="Team"
                    onClick={() => setCurrentView('team')}
                />
            </div>

            <div className="flex flex-col items-center gap-3">
                <button
                    onClick={onSettingsClick}
                    className="w-10 h-10 text-gray-400 hover:text-black hover:rotate-90 transition-all"
                    title="Settings"
                >
                    <Settings size={24} />
                </button>

                <button
                    onClick={onSettingsClick}
                    className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center hover:opacity-80 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none overflow-hidden"
                    style={{ backgroundColor: imageUrl ? 'transparent' : backgroundColor }}
                    title={user?.name || 'User'}
                >
                    {imageUrl ? (
                        <img src={imageUrl} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-bold text-sm text-white">{initials}</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
