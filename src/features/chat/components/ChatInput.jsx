import React from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({
    chatInput,
    setChatInput,
    handleSendMessage,
    spaceName
}) {
    return (
        <div className="p-4 border-t-2 border-black bg-white">
            <form onSubmit={handleSendMessage} className="relative">
                <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-black rounded-2xl py-4 pl-4 pr-14 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                    placeholder={`Message #${spaceName}...`}
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
    );
}
