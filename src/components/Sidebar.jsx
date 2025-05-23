import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaSlidersH, FaComments, FaUsers } from "react-icons/fa";

import { getPublicAssetUrl } from '../utils/assetPaths';
import MessageList from '../components/MessageList.jsx';
// import MobileNavbar from '../components/MobileNavbar.jsx';
import { ChatContext } from '../context/ChatContext.jsx';

function Sidebar({ myData, activeTab }) {
    const navigate = useNavigate();
    const { chatMessages, setChatMessages, chattingWith, setChattingWith } = useContext(ChatContext);

    // 選擇聊天對象
    const handleSelectChat = (chat) => {
        setChatMessages(prevChats =>
            prevChats.map(c =>
                c.id === chat.id ? { ...c, unread: 0 } : c
            )
        );
        setChattingWith(chat);
    };

    const handleLogout = () => {
        localStorage.removeItem("loginId");
        console.log('登出');
        navigate('/login');
    };

    if (!myData) {
        return <div className="hidden md:flex w-90 bg-gray-50 shadow-md flex-shrink-0 p-5 items-center justify-center text-gray-500">載入中...</div>;
    }

    const getLinkClass = (tabName) => {
        return `flex flex-col items-center w-1/4 py-2.5 px-4 text-base rounded-md transition-colors duration-300 ease block text-center ${activeTab === tabName ? 'bg-red-400 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} mb-2.5`;
    };


    return (
        <aside className="w-90 bg-gray-50 shadow-md hidden flex-shrink-0 md:flex flex-col overflow-y-auto">
            <Link to="/profile" className="flex flex-col items-center my-5">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                    <img
                        key={`userImg_${myData.id}`}
                        src={getPublicAssetUrl(myData.photos[0].url)}
                        alt={myData.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="mt-2 text-center font-bold text-lg">{myData.name}</p>
            </Link>

            <nav className="flex flex-grow px-5 gap-3">
                <Link to="/profile" className={getLinkClass("profile")}>
                    <FaUser size={20} />
                    <span className="mt-1"></span>
                </Link>
                <Link to="/filter" className={getLinkClass("filter")}>
                    <FaSlidersH size={20} />
                    <span className="mt-1"></span>
                </Link>
                <Link to="/match-feed" className={getLinkClass("matchfeed")}>
                    <FaUsers size={20} />
                    <span className="mt-1"></span>
                </Link>
                <Link to="/messages" className={getLinkClass("messages")}>
                    <FaComments size={20} />
                    <span className="mt-1"></span>
                </Link>
            </nav>

            {/* <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg z-50 flex justify-around items-center md:hidden">
                <Link to="/profile" className={getLinkClass("/profile")}>
                    <FaUser size={20} />
                    <span className="mt-1">個人資料</span>
                </Link>

                <Link to="/filter" className={getLinkClass("/filter")}>
                    <FaSlidersH size={20} />
                    <span className="mt-1">篩選設定</span>
                </Link>

                <Link to="/match-feed" className={getLinkClass("/match-feed")}>
                    <FaUsers size={20} />
                    <span className="mt-1">配對</span>
                </Link>

                <Link to="/messages" className={getLinkClass("/messages")}>
                    <FaComments size={20} />
                    <span className="mt-1">訊息</span>
                </Link>
            </div> */}

            <MessageList
                messages={chatMessages}
                onSelectChat={handleSelectChat}
            />
        </aside>
    );
}

export default Sidebar;