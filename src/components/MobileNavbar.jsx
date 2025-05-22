import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSlidersH, FaComments, FaUsers } from "react-icons/fa";

// MobileNavbar 現在不需要接收 onNavigateToMatch 和 onNavigateToMessages
function MobileNavbar() {
    const location = useLocation(); // 獲取當前路由對象

    // 輔助函數，用於根據當前路徑判斷連結的活躍狀態
    const getLinkClass = (path) => {
        return `flex flex-col items-center cursor-pointer text-xs ${location.pathname === path ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg z-50 flex justify-around items-center md:hidden">
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
        </div>
    );
}

export default MobileNavbar;