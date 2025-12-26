import React, { useState } from 'react';
import { X, Link, Copy, Mail, CheckCircle2, Loader2, AlertCircle, UserPlus, Send } from 'lucide-react';
import { useUIStore, useSpacesStore, useAuthStore } from '../../store';
import api from '../../services/api';
import ModalWrapper from '../../shared/components/ModalWrapper';
import Button, { CloseButton } from '../../shared/components/Button';

export default function InviteModal() {
    const { isInviteModalOpen, closeInviteModal } = useUIStore();
    const { activeSpace } = useSpacesStore();
    const { user } = useAuthStore();

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteEmails, setInviteEmails] = useState([]);
    const [isAddingInvite, setIsAddingInvite] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSendingInvites, setIsSendingInvites] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [copyStatus, setCopyStatus] = useState('idle');

    if (!isInviteModalOpen || !activeSpace) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`https://gathering.fun/join/${activeSpace.id}`);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAddInvite = () => {
        if (!inviteEmail || !inviteEmail.includes('@')) {
            setErrorMessage('Please enter a valid email');
            setTimeout(() => setErrorMessage(''), 2000);
            return;
        }
        if (inviteEmails.includes(inviteEmail)) {
            setErrorMessage('Email already added');
            setTimeout(() => setErrorMessage(''), 2000);
            return;
        }

        setIsAddingInvite(true);
        setTimeout(() => {
            setInviteEmails([...inviteEmails, inviteEmail]);
            setInviteEmail('');
            setIsAddingInvite(false);
            setAddSuccess(true);
            setTimeout(() => setAddSuccess(false), 1500);
        }, 500);
    };

    const handleRemoveInvite = (email) => {
        setInviteEmails(inviteEmails.filter(e => e !== email));
    };

    const handleSendInvites = async () => {
        if (inviteEmails.length === 0) return;

        setIsSendingInvites(true);
        try {
            await api.members.invite(activeSpace.id, {
                emails: inviteEmails,
                inviterName: user?.name,
                inviterId: user?.id
            });
            setInviteSent(true);
            setInviteEmails([]);
            setTimeout(() => setInviteSent(false), 2000);
        } catch (err) {
            console.error('Failed to send invites:', err);
            setAddError(true);
            setErrorMessage('Failed to send invites');
            setTimeout(() => { setAddError(false); setErrorMessage(''); }, 2000);
        } finally {
            setIsSendingInvites(false);
        }
    };

    return (
        <ModalWrapper isOpen={isInviteModalOpen} onClose={closeInviteModal} size="md" zLevel="medium">
            {/* Header */}
            <div className="p-6 border-b-2 border-black bg-yellow-50 flex justify-between items-center">
                <h2 className="text-2xl font-black">Invite People 🚀</h2>
                <CloseButton onClick={closeInviteModal} />
            </div>

            <div className="p-8 space-y-8">
                {/* Share Link */}
                <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Link size={20} /> Share Link</h3>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-100 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm text-gray-600 truncate">
                            https://gathering.fun/join/{activeSpace.id}
                        </div>
                        <Button variant="primary" onClick={handleCopyLink} className="!bg-black">
                            {copyStatus === 'copied' ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t-2 border-gray-200" />
                    <span className="flex-shrink-0 mx-4 text-gray-400 font-bold text-sm">OR</span>
                    <div className="flex-grow border-t-2 border-gray-200" />
                </div>

                {/* Email Invite */}
                <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Mail size={20} /> Invite by Email</h3>

                    <div className="w-full bg-white border-2 border-black rounded-xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
                            placeholder="friend@example.com"
                            className="flex-1 px-4 text-sm font-mono font-medium focus:outline-none bg-transparent text-gray-600"
                        />
                        <Button
                            onClick={handleAddInvite}
                            disabled={isAddingInvite || addSuccess || addError}
                            variant={addSuccess ? 'success' : addError ? 'danger' : 'warning'}
                            size="sm"
                        >
                            {isAddingInvite ? <Loader2 size={18} className="animate-spin" />
                                : addSuccess ? <CheckCircle2 size={18} />
                                    : addError ? <AlertCircle size={18} />
                                        : <UserPlus size={18} />}
                        </Button>
                    </div>

                    {errorMessage && <div className="text-red-500 text-xs font-bold mt-2">{errorMessage}</div>}

                    {inviteEmails.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {inviteEmails.map(email => (
                                <span key={email} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    {email}
                                    <button onClick={() => handleRemoveInvite(email)} className="hover:text-red-500 ml-1"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    )}

                    {inviteEmails.length > 0 && (
                        <button
                            onClick={handleSendInvites}
                            disabled={inviteSent || isSendingInvites}
                            className={`w-full mt-3 py-3 rounded-xl border-2 border-black font-black text-base flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 ${inviteSent ? 'bg-green-400 hover:bg-green-500' : 'bg-yellow-400 hover:bg-yellow-500'}`}
                        >
                            {isSendingInvites ? <Loader2 size={20} className="animate-spin" /> : inviteSent ? <CheckCircle2 size={20} /> : <Send size={20} />}
                            {isSendingInvites ? 'Sending...' : inviteSent ? 'Invites Sent!' : `Send ${inviteEmails.length} Invite${inviteEmails.length > 1 ? 's' : ''}`}
                        </button>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
}
