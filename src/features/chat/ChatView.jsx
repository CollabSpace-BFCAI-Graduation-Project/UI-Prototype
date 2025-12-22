import React, { useRef, useEffect } from 'react';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatSidebar from './components/ChatSidebar';
import { useChatStore, useSpacesStore, useAuthStore } from '../../store';

export default function ChatView() {
    // Get state directly from stores
    const {
        activeChatSpace,
        setActiveChatSpace,
        chatInput,
        setChatInput,
        sendMessage,
        getCurrentMessages
    } = useChatStore();

    const { spaces } = useSpacesStore();
    const { user } = useAuthStore();

    const messagesEndRef = useRef(null);
    const currentMessages = getCurrentMessages();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!chatInput.trim() || !activeChatSpace) return;

        const messageData = {
            senderId: user?.id,
            text: chatInput,
            type: 'user',
            mentions: []
        };

        await sendMessage(messageData);
        setChatInput('');
    };

    // Chat Lobby - No active space selected
    if (!activeChatSpace) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><MessageSquare size={32} /></div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Jump into Chat</h2>
                    <p className="text-gray-500 text-lg font-medium">Choose a space to start chatting.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {spaces.map(space => (
                        <button key={space.id} onClick={() => setActiveChatSpace(space)} className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-2xl hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group">
                            <div className="w-12 h-12 rounded-xl border-2 border-black flex-shrink-0" style={{ background: space.thumbnail }}></div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg group-hover:text-pink-600 transition-colors truncate">{space.name}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase">{space.category}</p>
                            </div>
                            <ArrowLeft size={20} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Active Chat View
    return (
        <div className="h-[calc(100vh-4rem)] flex gap-6">
            <ChatSidebar />

            <div className="flex-1 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative">
                <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChatSpace(null)} className="lg:hidden p-2 hover:bg-white rounded-lg"><ArrowLeft size={20} /></button>
                        <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold text-lg" style={{ background: activeChatSpace.thumbnail }}>#</div>
                        <div><h3 className="font-black text-lg">General</h3><p className="text-xs font-bold text-gray-500">Weekly Updates</p></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                    {currentMessages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <ChatInput
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    handleSendMessage={handleSendMessage}
                    spaceName={activeChatSpace.name}
                />
            </div>
        </div>
    );
}
