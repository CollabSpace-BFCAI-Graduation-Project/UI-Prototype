import React, { useState } from 'react';
import { X, ArrowLeft, Copy, Check, Mail, Send, UserPlus, Loader2, AlertCircle } from 'lucide-react';

export default function CreateSpaceModal({
    isOpen,
    onClose,
    createStep,
    setCreateStep,
    newSpaceName,
    setNewSpaceName,
    newSpaceDescription,
    setNewSpaceDescription,
    spaceTemplates,
    createdSpaceLink,
    onConfirm,
    onFinalize,
    currentUser
}) {
    const [copied, setCopied] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSent, setInviteSent] = useState(false);
    const [inviteEmails, setInviteEmails] = useState([]);
    const [isAddingInvite, setIsAddingInvite] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(createdSpaceLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAddInvite = async () => {
        if (!inviteEmail.trim()) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) return;

        // Check for self-invite or duplicate
        if (currentUser && inviteEmail === currentUser.email) {
            setAddError(true);
            setErrorMessage("You can't invite yourself!");
            setTimeout(() => {
                setAddError(false);
                setErrorMessage('');
            }, 2000);
            return;
        }

        if (inviteEmails.includes(inviteEmail)) {
            setAddError(true);
            setErrorMessage("Already invited!");
            setTimeout(() => {
                setAddError(false);
                setErrorMessage('');
            }, 2000);
            return;
        }

        setIsAddingInvite(true);
        // Simulate small delay for feedback
        await new Promise(resolve => setTimeout(resolve, 600));

        setInviteEmails(prev => [...prev, inviteEmail]);
        // Clear input immediately when successful
        setInviteEmail('');
        setIsAddingInvite(false);
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 1500);
    };

    const handleRemoveInvite = (email) => {
        setInviteEmails(prev => prev.filter(e => e !== email));
    };

    const handleSendInvites = async () => {
        if (inviteEmails.length === 0) return;
        // TODO: Call API to send invites
        setInviteSent(true);
        setTimeout(() => {
            setInviteSent(false);
            setInviteEmails([]);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>

                {createStep === 1 && (
                    <>
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-yellow-50">
                            <div className="mb-6"><span className="inline-block px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-4">Step 1/3</span><h2 className="text-4xl font-black text-gray-900 mb-2">Let's build your<br />dream space! 🚀</h2><p className="text-gray-600 font-medium">Give it a cool name to get started.</p></div>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold text-gray-900 mb-2">Space Name</label><input autoFocus value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} className="w-full px-4 py-3 text-lg font-bold border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-shadow" placeholder="e.g. The Bat Cave" /></div>
                                <div><label className="block text-sm font-bold text-gray-900 mb-2">Description</label><textarea value={newSpaceDescription} onChange={(e) => setNewSpaceDescription(e.target.value)} className="w-full px-4 py-3 font-medium border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] h-24 resize-none" placeholder="What happens in this space?" /></div>
                            </div>
                            <button disabled={!newSpaceName.trim()} onClick={() => setCreateStep(2)} className="mt-8 w-full bg-black text-white font-bold text-lg py-4 rounded-xl border-2 border-black hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px] active:shadow-none">Next Step →</button>
                        </div>
                        <div className="hidden md:flex w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-500 items-center justify-center relative overflow-hidden border-l-4 border-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-90"></div>
                            <div className="relative z-10 text-center p-8">
                                <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rotate-3 max-w-xs mx-auto">
                                    <div className="h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-4xl">🏰</div>
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                                <p className="text-white font-bold mt-8 text-xl drop-shadow-md">Previewing: {newSpaceName || 'Untitled Space'}</p>
                            </div>
                        </div>
                    </>
                )}

                {createStep === 2 && (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-6 border-b-2 border-black flex items-center bg-pink-50"><button onClick={() => setCreateStep(1)} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={24} /></button><div><span className="text-xs font-bold uppercase tracking-wider text-pink-600">Step 2/3</span><h2 className="text-2xl font-black">Choose a Vibe</h2></div></div>
                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{spaceTemplates.map((t) => (<button key={t.id} onClick={() => onConfirm(t)} className="group text-left border-2 border-black rounded-2xl p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none bg-white"><div className="h-32 rounded-xl mb-4 border-2 border-black flex items-center justify-center text-white" style={{ background: t.gradient }}>{t.icon}</div><h3 className="font-bold text-lg">{t.name}</h3><span className="text-xs font-bold text-gray-400 uppercase">{t.category}</span></button>))}</div>
                        </div>
                    </div>
                )}

                {createStep === 3 && (
                    <div className="w-full p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#FFFDF5]">
                        <h2 className="text-3xl font-black mb-2">Space Created! 🎉</h2>
                        <p className="text-gray-600 font-medium mb-6 max-w-md">Your space is ready. Share the link or invite teammates!</p>

                        {/* Copy Link Section */}
                        <div className="w-full max-w-md bg-white border-2 border-black rounded-xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-6">
                            <div className="flex-1 px-4 font-mono text-sm truncate text-gray-600">{createdSpaceLink}</div>
                            <button
                                onClick={handleCopyLink}
                                className={`p-2.5 rounded-lg border-2 border-black font-bold transition-all ${copied ? 'bg-green-400' : 'bg-yellow-300 hover:bg-yellow-400'}`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>

                        {/* Invite by Email Section */}
                        <div className="w-full max-w-md mb-6">
                            <div className="bg-white border-2 border-black rounded-xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
                                    placeholder="teammate@example.com"
                                    className="flex-1 px-4 text-sm font-mono font-medium focus:outline-none bg-transparent text-gray-600 text-center placeholder:text-gray-600"
                                />
                                <button
                                    onClick={handleAddInvite}
                                    disabled={isAddingInvite || addSuccess || addError}
                                    className={`p-2.5 rounded-lg border-2 border-black font-bold transition-all disabled:opacity-50 ${addSuccess ? 'bg-green-400 text-black' :
                                        addError ? 'bg-red-400 text-white' :
                                            'bg-yellow-300 hover:bg-yellow-400'
                                        }`}
                                >
                                    {isAddingInvite ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : addSuccess ? (
                                        <Check size={18} />
                                    ) : addError ? (
                                        <AlertCircle size={18} />
                                    ) : (
                                        <UserPlus size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="text-red-500 text-xs font-bold mt-2 animate-in slide-in-from-top-1">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Email Tags */}

                            {/* Email Tags */}
                            {inviteEmails.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {inviteEmails.map(email => (
                                        <span
                                            key={email}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            {email}
                                            <button
                                                onClick={() => handleRemoveInvite(email)}
                                                className="hover:text-red-500 ml-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Send Invites Button */}
                            {inviteEmails.length > 0 && (
                                <button
                                    onClick={handleSendInvites}
                                    disabled={inviteSent}
                                    className={`w-full mt-3 py-2.5 rounded-xl border-2 border-black font-bold transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${inviteSent ? 'bg-green-400' : 'bg-yellow-300 hover:bg-yellow-400'}`}
                                >
                                    {inviteSent ? <><Check size={18} /> Invites Sent!</> : <><Send size={18} /> Send {inviteEmails.length} Invite{inviteEmails.length > 1 ? 's' : ''}</>}
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button onClick={onFinalize} className="px-6 py-3 bg-white border-2 border-black rounded-xl font-bold hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">Skip for Now</button>
                            <button onClick={onFinalize} className="px-6 py-3 bg-black text-white border-2 border-black rounded-xl font-bold hover:shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] transition-shadow">Go to Space →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
