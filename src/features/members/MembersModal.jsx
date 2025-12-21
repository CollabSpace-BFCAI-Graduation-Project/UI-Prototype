import React from 'react';
import { X, UserCog, Trash2 } from 'lucide-react';

export default function MembersModal({
    isOpen,
    onClose,
    activeSpace,
    onRoleChange
}) {
    if (!isOpen || !activeSpace) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95">
                <div className="p-6 border-b-2 border-black bg-purple-50 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2"><UserCog size={24} /> Manage Members</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Space: {activeSpace.name}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-2 mb-6">
                        <input type="text" placeholder="Add by email..." className="flex-1 border-2 border-black rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-purple-300" />
                        <button className="bg-black text-white px-6 rounded-xl font-bold border-2 border-black hover:bg-gray-800">Invite</button>
                    </div>
                    <div className="space-y-4">
                        {activeSpace.members?.map(member => (
                            <div key={member.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-transparent hover:border-black transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold ${member.avatar}`}>{member.name[0]}</div>
                                    <div>
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-xs text-gray-500 font-bold">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        defaultValue={member.role}
                                        onChange={(e) => onRoleChange(member.id, e.target.value)}
                                        className="bg-white border-2 border-black rounded-lg px-2 py-1 text-sm font-bold outline-none cursor-pointer"
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Member">Member</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                    {member.role !== 'Owner' && (
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Remove User"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
