import { createContext, useState } from 'react';
import initialChatMessages from '../mocks/chatMessages.json';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatMessages, setChatMessages] = useState(initialChatMessages);
    const [chattingWith, setChattingWith] = useState(null); // 當前聊天對象

    return (
        <ChatContext.Provider value={{
            chatMessages,
            setChatMessages,
            chattingWith,
            setChattingWith
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext };