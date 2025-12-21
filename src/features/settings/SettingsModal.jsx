import React from 'react';
import { X, Settings, Bell, LogOut } from 'lucide-react';

export default function SettingsModal({
    isOpen,
    onClose,
    settingsTab,
    setSettingsTab
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-[#FFFDF5] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[600px] overflow-hidden animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-r-2 border-black p-6 flex flex-col">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings size={24} /> Settings</h2>
                    <div className="space-y-2">
                        {['General', 'Notifications', 'Profile', 'Billing'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSettingsTab(tab.toLowerCase())}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold border-2 transition-all ${settingsTab === tab.toLowerCase() ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t-2 border-gray-100">
                        <button className="flex items-center gap-2 text-red-500 font-bold hover:underline"><LogOut size={18} /> Log Out</button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {settingsTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-black mb-4">Workspace Settings</h3>
                                <div className="bg-white border-2 border-black rounded-2xl p-6">
                                    <div className="mb-4">
                                        <label className="block font-bold mb-2">Workspace Name</label>
                                        <input type="text" defaultValue="Maryam's Workspace" className="w-full border-2 border-black rounded-xl p-3 font-medium focus:ring-2 focus:ring-yellow-300 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block font-bold mb-2">Theme Color</label>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-300 border-2 border-black cursor-pointer ring-2 ring-offset-2 ring-black"></div>
                                            <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-black cursor-pointer hover:scale-110 transition-transform"></div>
                                            <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-black cursor-pointer hover:scale-110 transition-transform"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {settingsTab === 'notifications' && (
                        <div className="text-center py-20">
                            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold text-gray-500">Notifications settings go here</h3>
                        </div>
                    )}

                    {settingsTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-pink-200 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black">M</div>
                                <div>
                                    <button className="bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black hover:bg-gray-800 mb-2 block">Change Avatar</button>
                                    <p className="text-sm text-gray-500 font-bold">Max size: 5MB</p>
                                </div>
                            </div>
                            <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4">
                                <div>
                                    <label className="block font-bold mb-2">Display Name</label>
                                    <input type="text" defaultValue="Maryam" className="w-full border-2 border-black rounded-xl p-3 font-medium outline-none" />
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Email</label>
                                    <input type="email" defaultValue="maryam@example.com" disabled className="w-full border-2 border-gray-300 bg-gray-100 rounded-xl p-3 font-medium text-gray-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {settingsTab === 'billing' && (
                        <div className="text-center py-20">
                            <h3 className="font-bold text-gray-500">Billing settings go here</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
