import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";

const ChatContainer = ({ selectedConversation, selectedConversationMessages, handleAddMessage, userId }) => {
    // useEffect(() => {
    //     console.log(selectedConversationMessages);
    // }, [selectedConversationMessages])

    return (
        <div className="at-chat_messages">
            <ChatHeader selectedConversation={selectedConversation}  selectedConversationMessages={selectedConversationMessages}></ChatHeader>
            <ChatMessages selectedConversation={selectedConversation}
                handleAddMessage={handleAddMessage}
                userId={userId}
                selectedConversationMessages={selectedConversationMessages}></ChatMessages>
        </div>
    )
};

export default ChatContainer;