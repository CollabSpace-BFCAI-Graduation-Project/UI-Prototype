import React from 'react';
import { Send, X, Reply } from 'lucide-react';
import { useChatStore } from '../../../store';

export default function ChatInput({
    chatInput,
    setChatInput,
    handleSendMessage,
    spaceName
}) {
    const { replyingTo, clearReplyingTo } = useChatStore();

    return (
        <div className="border-t-2 border-black bg-white">
            {/* Reply Preview */}
            {replyingTo && (
                <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-gray-200 border-l-4 border-l-accent rounded-xl">
                        <Reply size={16} className="text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-accent block">Replying to {replyingTo.sender}</span>
                            <p className="text-sm text-gray-600 truncate">{replyingTo.text}</p>
                        </div>
                        <button
                            onClick={clearReplyingTo}
                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-black transition-colors flex-shrink-0"
                            title="Cancel reply (Esc)"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        id="chat-input"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && replyingTo) {
                                clearReplyingTo();
                            }
                        }}
                        autoComplete='off'
                        className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 pl-4 pr-14 font-medium focus:outline-none focus:ring-2 focus:ring-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                        placeholder={replyingTo ? `Reply to ${replyingTo.sender}...` : `Message #${spaceName}...`}
                    />
                    <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-accent border-2 border-black rounded-xl flex items-center justify-center hover:bg-accent-dark active:scale-95 transition-all"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
