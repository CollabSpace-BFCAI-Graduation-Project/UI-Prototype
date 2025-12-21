import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import '../../../styles/chat.css';

const ChatView = ({
    chatSearchQuery,
    setChatSearchQuery,
    spaces,
    activeSpace,
    setActiveSpace,
    chatMessages,
    newMessage,
    setNewMessage,
    handleSendMessage
}) => {
    return (
        <div className="chats-view">
            <ChatSidebar
                chatSearchQuery={chatSearchQuery}
                setChatSearchQuery={setChatSearchQuery}
                spaces={spaces}
                activeSpace={activeSpace}
                setActiveSpace={setActiveSpace}
            />
            <ChatArea
                activeSpace={activeSpace}
                chatMessages={chatMessages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default ChatView;
