import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { calculateDistance } from '../utils/distanceUtils';
import useIsMobile from "../hooks/useIsMobile.jsx";

import mockMatches from '../mocks/matches.json';
import MatchCard from '../components/MatchCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import MobileNavbar from '../components/MobileNavbar.jsx';

import { FilterContext } from '../context/FilterContext.jsx';
import { calculateAge } from '../utils/ageUtils';
import { getPublicAssetUrl } from '../utils/assetPaths';

function MatchFeedPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userIdToDisplay, isFromMessages } = location.state || {};

    const myId = localStorage.getItem("loginId");
    const myData = mockMatches.find(match => match.id === myId) || null;

    const [matches, setMatches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    const { ageRange, searchGender, maxDistance: filterMaxDistance } = useContext(FilterContext);
    const [showMatchAnimation, setShowMatchAnimation] = useState(false);
    const [matchedUser, setMatchedUser] = useState(null);

    const userLocation = myData?.location || null;
    const isMobile = useIsMobile();

    // Effect 1: 檢查登入狀態和 myData.location (保持不變)
    useEffect(() => {
        if (!myId || !myData) {
            console.log("未登入或找不到用戶資料，導向登入頁");
            navigate('/login');
            return;
        }

        if (myData.location) {
            setLoading(false);
            // 如果是從訊息頁面過來，不需要顯示地理位置缺失的提示
            if (!isFromMessages) {
                setStatusMessage('');
            }
        } else {
            setLoading(false);
            if (!isFromMessages) {
                setStatusMessage('您的用戶資料沒有地理位置信息，可能無法進行距離篩選。');
                console.error('用戶資料中缺少地理位置信息！');
            }
        }
    }, [myId, myData, navigate, isFromMessages]);

    // Effect 2: 在 userLocation 和篩選條件改變時，篩選匹配對象
    useEffect(() => {
        // userIdToDisplay存在時不需要userLocation，所以這裡的判斷要修改
        // 如果是從訊息頁面過來，即使沒有 userLocation 也應該載入目標用戶
        if (loading || !myData || (!userLocation && !userIdToDisplay)) {
            console.log("等待數據載入或用戶位置信息。Loading:", loading, "myData:", !!myData, "userLocation:", !!userLocation, "userIdToDisplay:", !!userIdToDisplay);
            // 但如果是從訊息頁面來且有 userIdToDisplay，則不用等 userLocation
            if (isFromMessages && userIdToDisplay && myData) {
                setLoading(false);
            } else {
                return;
            }
        }

        let tempMatches = mockMatches.filter(match => match.id !== myId);

        if (userIdToDisplay) {
            const targetMatch = tempMatches.find(match => match.id === userIdToDisplay);
            if (targetMatch) {
                setMatches([targetMatch]);
                setCurrentIndex(0);
            } else {
                setMatches([]);
                setStatusMessage(`找不到用戶 ID: ${userIdToDisplay} 的資料。`);
            }
        } else {
            // 正常篩選流程：排除已配對的，然後進行篩選
            const filteredNormalMatches = tempMatches
                .filter(match => !match.isMatchedWithMe)
                .filter(match => {
                    const isGenderMatch = (() => {
                        if (searchGender.male && searchGender.female && searchGender.other) return true;
                        if (searchGender.male && searchGender.female && !searchGender.other && (match.gender === '男性' || match.gender === '女性')) return true;
                        if (searchGender.male && match.gender === '男性') return true;
                        if (searchGender.female && match.gender === '女性') return true;
                        if (searchGender.other && match.gender === '其他') return true;
                        return false;
                    })();

                    const age = calculateAge(match.birth_date);
                    const isAgeMatch = age >= ageRange[0] && age <= ageRange[1];

                    let isDistanceMatch = false;
                    if (match.location && userLocation) {
                        const distance = calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            match.location.latitude,
                            match.location.longitude
                        );
                        isDistanceMatch = distance <= filterMaxDistance;
                    } else {
                        console.log(`- 用戶 ${match.name} (ID: ${match.id}) 沒有位置資訊或我的位置缺失。`);
                        return false;
                    }
                    return isGenderMatch && isAgeMatch && isDistanceMatch;
                });
            setMatches(filteredNormalMatches);
            setCurrentIndex(0);
            setStatusMessage('');
        }
    }, [userLocation, filterMaxDistance, myId, ageRange, searchGender, myData, loading, userIdToDisplay, isFromMessages]);


    // 用來觸發動畫顯示
    const showMatchSuccessAnimation = (targetUser) => {
        setMatchedUser(targetUser); // 設定配對到的用戶資料
        setShowMatchAnimation(true); // 顯示動畫

        // 動畫持續 3 秒後自動隱藏
        setTimeout(() => {
            setShowMatchAnimation(false);
            setMatchedUser(null); // 清除配對用戶資料
        }, 3000);
    };

    const handleCardAction = (userId, action) => {
        if (action === 'superlike' || action === 'like') {
            // 設定配對成功機率為 80%
            const matchSuccessChance = 0.8;
            const isMatch = Math.random() < matchSuccessChance;
            const targetUser = mockMatches.find(match => match.id === userId)

            if (isMatch && targetUser) {
                showMatchSuccessAnimation(targetUser);
            } else {
                // 配對失敗，可以選擇性地顯示一個提示或不執行任何操作
                console.log("未配對成功。");
            }
        }

        // 如果是從 /messages 導航過來的單一卡片，執行動作後應該回到 /messages
        if (isFromMessages) {
            navigate('/messages');
        } else {
            setMatches(prevMatches => prevMatches.filter(match => match.id !== userId));

            if (matches.length > 1) {
                setCurrentIndex(prevIndex => prevIndex % (matches.length - 1));
            } else {
                setCurrentIndex(0);
            }
        }
    }

    // 新增返回訊息頁面的函數
    const handleReturnToMessages = () => {
        navigate('/messages');
    };

    // 渲染邏輯
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500 text-lg">載入中...</div>;
    }

    if (!myData) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">
            無法載入用戶資料，請<Link to="/login" className="text-blue-500 underline ml-1">重新登入</Link>。
        </div>;
    }

    // 如果沒有用戶位置且不是顯示特定用戶 (且不是從訊息頁面來)
    // 只有在正常配對模式下，才需要檢查 userLocation
    if (!userLocation && !userIdToDisplay && !isFromMessages) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">
            {statusMessage || '您的用戶資料中沒有地理位置信息，無法進行匹配篩選。'}
        </div>;
    }

    const mainHeightClass = isMobile ? 'h-[calc(100vh-4rem)]' : 'h-screen';
    const currentMatchUser = matches[currentIndex];

    return (
        <div className="flex h-screen overflow-hidden">
            {/* 根據 isFromMessages 決定 Sidebar 的 activeTab，預設為 'messages' */}
            <Sidebar myData={myData} activeTab={isFromMessages ? 'messages' : 'matchfeed'} />

            <main className={`flex w-full flex-1 overflow-y-auto ${mainHeightClass}`}>
                <div className="flex flex-col flex-1 w-full">
                    {/* 僅在非從訊息頁面跳轉時才顯示 statusMessage */}
                    {statusMessage && !isFromMessages && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                            <p className="font-bold">提示:</p>
                            <p>{statusMessage}</p>
                        </div>
                    )}
                    {matches.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-gray-500 text-lg">
                            {userIdToDisplay ? '找不到指定的用戶資料。' : '沒有新的配對了。請嘗試調整篩選設定。'}
                            {/* 如果是從訊息頁面來且找不到用戶，可以提示返回 */}
                            {isFromMessages && (
                                <button
                                    onClick={handleReturnToMessages}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    返回訊息
                                </button>
                            )}
                        </div>
                    ) : (
                        <MatchCard
                            key={currentMatchUser.id}
                            user={currentMatchUser}
                            onSwiped={handleCardAction}
                            myLocation={userLocation}
                            // 如果是從訊息頁面過來，禁用滑動，只顯示一個按鈕用於返回
                            enableSwipe={!isFromMessages && isMobile}
                            // 新增一個屬性來控制是否顯示"返回訊息"按鈕
                            showReturnToMessagesButton={!!isFromMessages}
                            onReturnToMessages={handleReturnToMessages}
                        />
                    )}
                </div>
            </main>

            {isMobile && <MobileNavbar />}

            {/* 配對成功動畫模態框 */}
            {showMatchAnimation && matchedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center w-[320px] animate-fadeIn">
                        <h2 className="text-red-400 text-2xl font-bold mb-4">
                            🎉配對成功！
                        </h2>
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-red-300 overflow-hidden mx-auto shadow-md">
                                <img
                                    src={getPublicAssetUrl(matchedUser.photos[0].url)}
                                    alt={matchedUser.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <p className="text-gray-800 text-lg font-medium">
                            你和 <span className="text-red-400 font-bold">{matchedUser.name}</span> 配對成功了！
                        </p>
                    </div>
                </div>

            )}
        </div>
    );
}

export default MatchFeedPage;