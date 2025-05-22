import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import { calculateDistance } from '../utils/distanceUtils';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaStar, FaHeart, FaX } from "react-icons/fa6";

function MatchCard({ user, onSwiped, myLocation, enableSwipe, showReturnToMessagesButton, onReturnToMessages }) {
    const [region, setRegion] = useState('');
    const [distance, setDistance] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // 照片索引狀態

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => onSwiped(user.id, 'dislike'),
        onSwipedRight: () => onSwiped(user.id, 'like'),
        onSwipedUp: () => onSwiped(user.id, 'superlike'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    // 當 user 改變時重置照片索引
    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [user]);

    // 獲取用戶所在地區
    useEffect(() => {
        const fetchRegion = async () => {
            if (user.location && user.location.latitude && user.location.longitude) {
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${user.location.latitude}&lon=${user.location.longitude}`
                    );
                    if (response.data && response.data.address) {
                        const addressParts = response.data.address.country + " " + response.data.address.city;
                        setRegion(addressParts);
                    }
                } catch (error) {
                    console.error('反向地理編碼錯誤:', error);
                    setRegion('無法取得地區');
                }
            } else {
                setRegion('未提供位置');
            }
        };

        fetchRegion();
    }, [user.location]);

    // 計算距離
    useEffect(() => {
        // 當用戶位置 (myLocation) 或目標用戶位置 (user.location) 改變時，重新計算距離
        if (user.location && myLocation && myLocation.latitude && myLocation.longitude) {
            const calculatedDistance = calculateDistance(
                myLocation.latitude,
                myLocation.longitude,
                user.location.latitude,
                user.location.longitude
            );
            setDistance(calculatedDistance);
        } else {
            setDistance(null);
        }
    }, [user.location, myLocation]);

    // 計算年齡
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    // 照片切換功能
    const goToPreviousPhoto = () => {
        if (user && user.photos && user.photos.length > 0) {
            setCurrentPhotoIndex(prevIndex => (prevIndex - 1 + user.photos.length) % user.photos.length);
        }
    };

    const goToNextPhoto = () => {
        if (user && user.photos && user.photos.length > 0) {
            setCurrentPhotoIndex(prevIndex => (prevIndex + 1) % user.photos.length);
        }
    };


    if (!user) {
        return <div>載入用戶資料中...</div>;
    }

    return (
        <div className="flex flex-col items-center w-full"
            {...(enableSwipe ? swipeHandlers : {})} // 只有在 enableSwipe 為 true 時才應用滑動處理器
        >
            <div className="flex justify-center w-full">
                {user && (
                    <div className="relative w-96 h-128 m-2 rounded-lg overflow-hidden bg-gray-200">
                        {user.photos?.length > 0 && (
                            <>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 w-[94%] h-1 z-10">
                                    {user.photos.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`flex-1 rounded-sm cursor-pointer transition-colors
                                                         ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                                            onClick={() => setCurrentPhotoIndex(index)}
                                        ></div>
                                    ))}
                                </div>

                                <button
                                    className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white 
                                                rounded-full flex items-center justify-center z-10 opacity-70 hover:opacity-100"
                                    onClick={goToPreviousPhoto}
                                >
                                    <IoIosArrowBack size={15} />
                                </button>
                                <img
                                    key={`img_${user.id}`}
                                    src={user.photos[(currentPhotoIndex % user.photos.length + user.photos.length) % user.photos.length].url || 'https://placehold.co/400x600?text=NO%20PHOTO'}
                                    alt={user.name}
                                    className="w-full h-full object-cover bg-white"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x600?text=NO%20PHOTO';
                                    }}
                                />
                                <button
                                    className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white 
                                                rounded-full flex items-center justify-center z-10 opacity-70 hover:opacity-100"
                                    onClick={goToNextPhoto}
                                >
                                    <IoIosArrowForward size={15} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="w-full flex justify-center">
                <div
                    className="relative w-96 rounded-lg shadow-md bg-white overflow-hidden mb-5"
                >
                    <div className="p-5">
                        <h3 className="mb-4 text-2xl font-semibold text-red-400">
                            {user.name}, {calculateAge(user.birth_date)}歲
                        </h3>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            {user.bio ? user.bio.substring(0, 100) : '未提供簡介'}
                        </p>
                        {user.school && <p className="text-gray-600 mb-1">🏫 {user.school}</p>}
                        {user.job && <p className="text-gray-600 mb-1">💼 {user.job}</p>}
                        {user.hashtags && user.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 my-5">
                                {user.hashtags.slice(0, 6).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {region && <p className="text-gray-600 mb-1">📍 {region}</p>}
                        {distance !== null && <p className="text-gray-600">距離我：{distance.toFixed(1)} 公里</p>}
                    </div>
                </div>
            </div>

            {/* 根據 showReturnToMessagesButton 判斷顯示返回按鈕或動作按鈕 */}
            {showReturnToMessagesButton ? (
                <div className="sticky bottom-0 w-full h-24 bg-gradient-to-b from-transparent
                               via-gray-200/90 to-gray-300 z-50 flex justify-center items-end pb-8">
                    <button
                        onClick={onReturnToMessages} // 點擊時呼叫傳入的返回函數
                        className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-full shadow-lg 
                        hover:bg-red-600 transition-colors duration-200 text-lg font-semibold"
                    >
                        <IoIosArrowBack size={20} className="mr-2" />
                        返回訊息
                    </button>
                </div>
            ) : (
                user && (
                    <div className="sticky bottom-0 w-full h-24 bg-gradient-to-b from-transparent
                                    via-gray-200/90 to-gray-300 z-50 justify-center items-end pb-8 hidden md:flex">
                        <div className="flex gap-8">
                            <button
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md
                                 hover:scale-110 transition-transform"
                                onClick={() => onSwiped(user.id, 'dislike')}
                            >
                                <FaX size={36} className="text-red-400" />
                            </button>
                            <button
                                className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md 
                                hover:scale-110 transition-transform"
                                onClick={() => onSwiped(user.id, 'superlike')}
                            >
                                <FaStar size={35} className="text-blue-400" />
                            </button>
                            <button
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md 
                                hover:scale-110 transition-transform"
                                onClick={() => onSwiped(user.id, 'like')}
                            >
                                <FaHeart size={36} className="text-green-400" />
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default MatchCard;