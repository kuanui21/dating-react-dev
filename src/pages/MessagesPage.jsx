import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from "../hooks/useIsMobile.jsx";

import Sidebar from '../components/Sidebar.jsx';
import MobileNavbar from '../components/MobileNavbar.jsx';
import MessageList from '../components/MessageList.jsx';
import ChatBox from '../components/ChatBox.jsx';

import { ChatContext } from '../context/ChatContext.jsx';
import mockMatches from '../mocks/matches.json';


function MessagesPage() {
    const { chatMessages, setChatMessages, chattingWith, setChattingWith } = useContext(ChatContext);
    const isMobile = useIsMobile();
    const myId = localStorage.getItem("loginId");
    const myData = mockMatches.find(match => match.id === myId) || null;
    const navigate = useNavigate();

    // 檢查 myData 是否存在，如果不存在則導向登入頁
    useEffect(() => {
        if (!myData) {
            navigate('/login');
        }
    }, [myData, navigate]);

    // 關閉聊天框（返回訊息列表）
    const handleCloseChat = () => {
        setChattingWith(null);
    };

    // 選擇聊天對象
    const handleSelectChat = (chat) => {
        setChatMessages(prevChats =>
            prevChats.map(c =>
                c.id === chat.id ? { ...c, unread: 0 } : c
            )
        );
        setChattingWith(chat);
    };

    // 發送訊息
    const handleSendMessage = (chatId, messageText, sender) => {
        const newMessage = {
            id: Date.now(),
            sender: sender,
            text: messageText,
            time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        };

        let updatedChattingWith = null; // 用來儲存更新後的 chattingWith 物件

        setChatMessages(prevChatMessages => {
            return prevChatMessages.map(chat => {
                if (chat.id === chatId) {
                    const updatedMessages = [...chat.messages, newMessage];
                    const updatedChat = { // 建立一個新的聊天物件
                        ...chat,
                        messages: updatedMessages,
                        lastMessage: messageText,
                        unread: (sender === 'me' ? chat.unread : chat.unread + 1),
                    };
                    updatedChattingWith = updatedChat; // 更新 updatedChattingWith
                    return updatedChat;
                }
                return chat;
            });
        });

        // 在 setChatMessages 完成後，更新 chattingWith 狀態
        if (updatedChattingWith) {
            setChattingWith(updatedChattingWith);
        }
    };

    // 點擊頭像或姓名時切換到 MatchCard 視圖
    const handleViewMatchCard = (userId) => {
        navigate('/match-feed', { state: { userIdToDisplay: userId, isFromMessages: true } });
    };

    if (!myData) {
        return <div className="flex justify-center items-center h-full text-red-500 text-lg">載入中或未登入...</div>;
    }

    const mainHeightClass = isMobile ? 'h-[calc(100vh-4rem)]' : 'h-screen';

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar myData={myData} activeTab="messages" />

            <main className={`flex w-full flex-1 overflow-y-auto ${mainHeightClass}`}>
                <div className="flex flex-col flex-1 w-full">
                    {/* 這裡檢查 chatMessages 是否為空，給出提示 */}
                    {chatMessages.length === 0 && !chattingWith ? (
                        <div className="flex justify-center items-center h-full text-gray-500 text-lg">
                            您目前沒有任何訊息。
                        </div>
                    ) : (
                        chattingWith ? (
                            <ChatBox
                                chat={chattingWith}
                                onCloseChat={handleCloseChat}
                                onSendMessage={handleSendMessage}
                                onViewMatchCard={handleViewMatchCard}
                            />
                        ) : (
                            <MessageList
                                messages={chatMessages}
                                onSelectChat={handleSelectChat}
                            />
                        )
                    )}
                </div>
            </main>

            {isMobile && <MobileNavbar />}
        </div>
    );
}

export default MessagesPage;