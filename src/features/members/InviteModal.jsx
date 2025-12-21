import React from 'react';
import { X, Link, Copy, Mail, CheckCircle2, Loader2 } from 'lucide-react';

export default function InviteModal({
    isOpen,
    onClose,
    activeSpace,
    inviteStatus,
    inviteEmail,
    setInviteEmail,
    onCopyLink,
    onSendInvite
}) {
    if (!isOpen || !activeSpace) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 border-b-2 border-black bg-yellow-50 flex justify-between items-center">
                    <h2 className="text-2xl font-black">Invite People 🚀</h2>
                    <button onClick={onClose} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-8">
                    {/* Option 1: Link */}
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Link size={20} /> Share Link</h3>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-100 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm text-gray-600 truncate">
                                https://gathering.fun/join/{activeSpace.id}
                            </div>
                            <button onClick={onCopyLink} className="bg-black text-white px-4 rounded-xl font-bold border-2 border-black active:scale-95 transition-transform">
                                {inviteStatus === 'copied' ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t-2 border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 font-bold text-sm">OR</span>
                        <div className="flex-grow border-t-2 border-gray-200"></div>
                    </div>

                    {/* Option 2: Email */}
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Mail size={20} /> Invite by Email</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="friend@example.com"
                                className="flex-1 border-2 border-black rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-300 outline-none"
                            />
                            <button
                                onClick={onSendInvite}
                                disabled={!inviteEmail || inviteStatus === 'sending'}
                                className="bg-yellow-300 text-black px-6 rounded-xl font-bold border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                            >
                                {inviteStatus === 'sending' ? <Loader2 size={20} className="animate-spin" /> : (inviteStatus === 'sent' ? 'Sent!' : 'Send')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
