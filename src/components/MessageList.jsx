import { FaRegMessage } from "react-icons/fa6";
import { getPublicAssetUrl } from '../utils/assetPaths';

function MessageList({ messages, onSelectChat }) {
    return (
        <>
            <div className="flex items-center text-lg font-bold text-gray-700 px-5 py-2">
                <FaRegMessage className='text-xl mr-2' aria-label="chat" />
                訊息列表 ({messages.length})
            </div>
            <ul className="list-none flex-grow overflow-y-auto">
                {messages.map(message => (
                    <li key={message.id}
                        onClick={() => onSelectChat(message)}
                        className={`flex items-center py-4 border-b border-gray-200 last:border-b-0 px-5 hover:bg-gray-100 `}>
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex justify-center items-center mr-2 overflow-hidden flex-shrink-0">
                            <img
                                key={`messageImg_${message.id}`}
                                src={getPublicAssetUrl(message.img)}
                                alt={message.senderName}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="flex-grow w-1/2">
                            <div className="flex justify-between items-center">
                                <div className="font-bold text-gray-800 mb-1">{message.senderName}</div>
                                {message.unread > 0 && (
                                    <div className="bg-red-400 text-white rounded-full px-1.5 py-0.5 text-xs text-center w-5 h-5 flex items-center justify-center">
                                        {message.unread}
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-600 text-sm truncate w-full">
                                {message.messages[message.messages.length - 1].text}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MessageList;