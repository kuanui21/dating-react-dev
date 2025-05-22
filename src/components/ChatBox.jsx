import { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

function ChatBox({ chat, onCloseChat, onSendMessage, onViewMatchCard }) {
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);
    const isMobile = useIsMobile();

    // 每次 chat 或 messages 變化時，自動滾動到最新訊息
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat.messages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            onSendMessage(chat.id, messageInput, 'me');
            setMessageInput('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !isMobile) { // 桌面版按 Enter 發送
            event.preventDefault(); // 防止換行
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                    <button
                        onClick={onCloseChat}
                        className="mr-3 p-2 rounded-full hover:bg-gray-100 lg:hidden" // 在小螢幕上顯示返回按鈕
                        aria-label="返回訊息列表"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    {/* 可點擊的頭像和姓名 */}
                    <div
                        className="flex items-center cursor-pointer transition-opacity duration-200"
                        onClick={() => onViewMatchCard(chat.id)} // 點擊時觸發事件，傳遞聊天對象的 ID
                    >
                        <img
                            src={chat.img}
                            alt={chat.senderName}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-gray-800 hover:text-red-400">{chat.senderName}</h2>
                    </div>
                </div>
                <FaTimes size={24}
                    onClick={onCloseChat}
                    className="text-gray-500 hover:text-gray-700 text-sm" />
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.map((message, index) => (
                    <div
                        key={message.id || index}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${message.sender === 'me'
                                ? 'bg-red-400 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-red-100' : 'text-gray-500'}`}>
                                {message.time}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* 滾動到的目標 */}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 flex items-center">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="輸入訊息..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-3 mb-2.5 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-lg transition duration-200"
                >
                    <FaPaperPlane size={20} />
                </button>
            </div>
        </div>
    );
}

export default ChatBox;