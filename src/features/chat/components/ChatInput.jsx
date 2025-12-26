import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Reply } from 'lucide-react';
import { useChatStore } from '../../../store';
import MentionList from './MentionList';

export default function ChatInput({
    chatInput,
    setChatInput,
    handleSendMessage,
    spaceName
}) {
    const { replyingTo, clearReplyingTo, members } = useChatStore();
    const [mentionFilter, setMentionFilter] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionCoords, setMentionCoords] = useState({ left: 0 });
    const inputRef = useRef(null);

    // Monitor input for @ mentions
    useEffect(() => {
        const lastAtIndex = chatInput.lastIndexOf('@', cursorPosition - 1);

        if (lastAtIndex !== -1) {
            const textAfterAt = chatInput.slice(lastAtIndex + 1, cursorPosition);

            // Check if there's a space before the @ (or it's at start)
            const isStartOrSpace = lastAtIndex === 0 || chatInput[lastAtIndex - 1] === ' ';
            // Check if there are no spaces in the query (simple username matching)
            const hasNoSpaces = !textAfterAt.includes(' ');

            if (isStartOrSpace && hasNoSpaces) {
                setMentionFilter(textAfterAt);
                setShowMentions(true);

                // Calculate position for popup
                // This is a rough estimation. For production, use a library like get-caret-coordinates or a hidden mirror div
                const inputRect = inputRef.current?.getBoundingClientRect();
                if (inputRect) {
                    // Approximate character width (8px)
                    const leftOffset = Math.min((lastAtIndex * 8) + 20, inputRect.width - 220);
                    setMentionCoords({ left: leftOffset });
                }
                return;
            }
        }

        setShowMentions(false);
    }, [chatInput, cursorPosition]);

    const handleMentionSelect = (member) => {
        const lastAtIndex = chatInput.lastIndexOf('@', cursorPosition - 1);
        const textBeforeAt = chatInput.slice(0, lastAtIndex);
        const textAfterCursor = chatInput.slice(cursorPosition);

        const newValue = `${textBeforeAt}@${member.username || member.name.replace(/\s+/g, '')} ${textAfterCursor}`;
        setChatInput(newValue);
        setShowMentions(false);

        // Focus back on input
        if (inputRef.current) {
            inputRef.current.focus();
            // Need slight delay for cursor position update to work after state change
            setTimeout(() => {
                const newCursorPos = lastAtIndex + member.name.length + 2; // @ + name + space
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (showMentions) {
                // Let MentionList handle these
                return;
            }
        }

        if (e.key === 'Enter') {
            if (showMentions) {
                // Prevent send if selecting mention
                e.preventDefault();
                return;
            }
        }

        if (e.key === 'Escape') {
            if (showMentions) {
                e.preventDefault(); // Don't clear reply if closing mentions
                setShowMentions(false);
                return;
            }
            if (replyingTo) {
                clearReplyingTo();
            }
        }

        // Parent handler for send (Enter without Shift)
        // We handle this manually here to coordinate with mentions
        if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
            // Let form submit handler take care of it
        }
    };

    const onInputChange = (e) => {
        setChatInput(e.target.value);
        setCursorPosition(e.target.selectionStart);
    };

    return (
        <div className="border-t-2 border-black bg-white relative">
            {/* Mention List Popup */}
            {showMentions && (
                <MentionList
                    members={members}
                    filter={mentionFilter}
                    onSelect={handleMentionSelect}
                    onClose={() => setShowMentions(false)}
                    position={mentionCoords}
                />
            )}

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
                <form onSubmit={(e) => {
                    if (showMentions) {
                        e.preventDefault();
                        return;
                    }
                    handleSendMessage(e);
                }} className="relative">
                    <input
                        ref={inputRef}
                        id="chat-input"
                        value={chatInput}
                        onChange={onInputChange}
                        onClick={(e) => setCursorPosition(e.target.selectionStart)}
                        onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                        onKeyDown={handleInputKeyDown}
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
