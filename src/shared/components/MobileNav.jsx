import React from 'react';
import { Grid, MessageSquare, Users, Settings } from 'lucide-react';
import { getAvatarProps } from '../utils/helpers';
import { useUIStore, useAuthStore } from '../../store';
import NotificationBell from '../../features/notifications/NotificationBell';

export default function MobileNav() {
    const { currentView, setCurrentView, openSettingsModal } = useUIStore();
    const { user } = useAuthStore();
    const { imageUrl, initials, backgroundColor } = getAvatarProps(user);

    const navItems = [
        { id: 'dashboard', icon: Grid, label: 'Spaces' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'team', icon: Users, label: 'Team' },
    ];

    return (
        <nav className="fixed bottom-4 left-4 right-4 bg-white border-2 border-black rounded-full z-40 md:hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${currentView === item.id
                            ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(168,85,247,1)] scale-110'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-black'
                            }`}
                    >
                        <item.icon size={20} />
                    </button>
                ))}

                <NotificationBell />

                <button
                    onClick={openSettingsModal}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-black transition-all duration-200"
                >
                    <Settings size={20} />
                </button>

                <button
                    onClick={openSettingsModal}
                    className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: imageUrl ? 'transparent' : backgroundColor }}
                >
                    {imageUrl ? (
                        <img src={imageUrl} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-bold text-xs text-white">{initials}</span>
                    )}
                </button>
            </div>
        </nav>
    );
}
