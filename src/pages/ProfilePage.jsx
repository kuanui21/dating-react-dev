import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicAssetUrl } from '../utils/assetPaths';

import axios from 'axios';
import useIsMobile from "../hooks/useIsMobile.jsx";
import mockMatches from '../mocks/matches.json';
import MobileNavbar from '../components/MobileNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

function ProfilePage() {
    const navigate = useNavigate();
    const myId = localStorage.getItem("loginId");
    const myData = mockMatches.find(match => match.id === myId);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [locationInput, setLocationInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const isMobile = useIsMobile();

    useEffect(() => {
        if (myData) {
            setProfile(myData);
            setLoading(false);

            if (myData.location) {
                reverseGeocode(myData.location.latitude, myData.location.longitude);
            }
        } else {
            setError('無法載入您的個人資料。');
            setLoading(false);
        }
    }, [myData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handlePhotoChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newPhotos = Array.from(files).map(file => ({ url: URL.createObjectURL(file) }));
            setProfile(prevProfile => ({
                ...prevProfile,
                photos: [...(prevProfile.photos || []), ...newPhotos],
            }));
        }
    };

    const handleLocationInputChange = (event) => {
        setLocationInput(event.target.value);
        setSelectedLocation(null);
    };

    const handleSearchLocation = async () => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInput}&format=json&limit=5`
            );
            if (response.data && response.data.length > 0) {
                console.log('搜尋結果:', response.data);
                setSelectedLocation({
                    displayName: response.data[0].display_name,
                    latitude: response.data[0].lat,
                    longitude: response.data[0].lon,
                });
            } else {
                alert('找不到該地點。');
            }
        } catch (error) {
            console.error('地理編碼錯誤:', error);
            alert('無法搜尋地點。');
        }
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            if (response.data) {
                setLocationInput(response.data.display_name || '');
            }
        } catch (error) {
            console.error('反向地理編碼錯誤:', error);
        }
    };

    const handleSaveLocation = () => {
        if (selectedLocation) {
            setProfile(prevProfile => ({
                ...prevProfile,
                location: {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                },
            }));

            setLocationInput(selectedLocation.displayName);
            alert(`位置已更新為：${selectedLocation.displayName}`);
        } else {
            alert('請先搜尋並選擇一個地點。');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('更新個人資料:', profile);
        alert('個人資料更新成功！');
    };

    const handleCancel = () => {
        navigate('/match-feed'); // 導航回新的配對頁面
    };

    const handleLogout = () => {
        localStorage.removeItem("loginId");
        console.log('登出');
        navigate('/login');
    };

    if (loading) {
        return <div>載入個人資料編輯頁面...</div>;
    }

    if (error) {
        return <div>錯誤：{error}</div>;
    }

    if (!profile) {
        return <div>找不到個人資料。</div>;
    }

    const mainHeightClass = isMobile ? 'h-[calc(100vh-4rem)]' : 'h-screen';

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar myData={myData} activeTab="profile" />

            <main className={`flex-grow p-5 flex flex-col items-center overflow-y-auto custom-scrollbar box-border ${mainHeightClass}`}>
                <div className="container w-full">
                    {/* 標題和手機版登出按鈕 */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-red-500 text-2xl font-semibold">編輯個人資料</h2>
                        {/* {isMobile && (
                        )} */}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 w-full">
                            <label htmlFor="photos" className="block font-bold mb-1.5 text-gray-800">照片:</label>
                            <div className="mt-2 flex flex-wrap gap-2.5">
                                {(profile.photos || []).map((photo, index) => (
                                    <img key={index} src={getPublicAssetUrl(photo.url)} alt={`照片 ${index + 1}`}
                                        className="w-[100px] h-[100px] mr-2.5 object-cover rounded-md" />
                                ))}
                            </div>
                            <input type="file" id="photos" multiple
                                onChange={handlePhotoChange} className="hidden" />
                            <label htmlFor="photos"
                                className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-red-400 text-white font-semibold rounded-md shadow-sm cursor-pointer hover:bg-red-500 transition-colors duration-200 ease-in-out">
                                <span>新增照片</span>
                            </label>
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="name" className="block font-bold mb-1.5 text-gray-800">姓名:</label>
                            <input type="text" id="name" name="name" value={profile.name || ''}
                                onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="bio" className="block font-bold mb-1.5 text-gray-800">簡介:</label>
                            <textarea id="bio" name="bio" value={profile.bio || ''}
                                onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border min-h-25 resize-y"></textarea>
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="birth_date" className="block font-bold mb-1.5 text-gray-800">生日:</label>
                            <input type="date" id="birth_date" name="birth_date" value={profile.birth_date || ''}
                                onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>

                        <div className="mb-4 w-full flex items-start">
                            <label className="font-bold mr-2.5 text-gray-800">性別:</label>
                            <div className="flex ml-2.5 gap-1.5 flex-wrap">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="myGenderMale"
                                        name="gender"
                                        value="男性"
                                        checked={profile.gender === '男性'}
                                        disabled
                                        className="mb-1.5 mr-1.5"
                                    />
                                    <label htmlFor="myGenderMale">男性</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="myGenderFemale"
                                        name="gender"
                                        value="女性"
                                        checked={profile.gender === '女性'}
                                        disabled
                                        className="mb-1.5 mr-1.5"
                                    />
                                    <label htmlFor="myGenderFemale">女性</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 w-full">
                            <label htmlFor="school" className="block font-bold mb-1.5 text-gray-800">學校:</label>
                            <input type="text" id="school" name="school" value={profile.school || ''}
                                onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="job" className="block font-bold mb-1.5 text-gray-800">工作:</label>
                            <input type="text" id="job" name="job" value={profile.job || ''}
                                onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="interests" className="block font-bold mb-1.5 text-gray-800">興趣 (逗號分隔):</label>
                            <input type="text" id="interests" name="interests" value={(profile.interests || []).join(', ')}
                                onChange={(e) => handleChange({ target: { name: 'interests', value: e.target.value.split(',').map(item => item.trim()) } })}
                                className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="hashtags" className="block font-bold mb-1.5 text-gray-800">標籤 (逗號分隔):</label>
                            <input type="text" id="hashtags" name="hashtags" value={(profile.hashtags || []).join(', ')}
                                onChange={(e) => handleChange({ target: { name: 'hashtags', value: e.target.value.split(',').map(item => item.trim()) } })}
                                className="w-full p-2.5 border border-gray-300 rounded-md text-base box-border" />
                        </div>

                        <div className="mb-4 w-full">
                            <label htmlFor="location" className="block font-bold mb-1.5 text-gray-800">位置 (可輸入關鍵字搜尋):</label>
                            <div className="location-input-group flex gap-2.5 items-center w-full">
                                <input
                                    type="text"
                                    id="location"
                                    placeholder="輸入新的地點名稱"
                                    value={locationInput}
                                    onChange={handleLocationInputChange}
                                    className="flex-grow p-2.5 border border-gray-300 rounded-md text-base box-border"
                                />
                                <button type="button" className="whitespace-nowrap px-3 py-2 w-30 h-auto bg-gray-100 rounded-md mb-2.5 hover:bg-gray-200"
                                    onClick={handleSearchLocation}>搜尋</button>
                            </div>
                            {selectedLocation && (
                                <div className="location-selected-group flex gap-2.5 items-center w-full mt-2">
                                    <p className="w-full max-w-full my-0 break-words">新的位置：{selectedLocation.displayName}</p>
                                    <button type="button" className="whitespace-nowrap px-3 py-2 w-30 h-auto bg-gray-100 rounded-md hover:bg-gray-200"
                                        onClick={handleSaveLocation}>儲存位置</button>
                                </div>
                            )}
                        </div>

                        <div className="form-actions mt-9 grid gap-2.5 w-full">
                            <button type="submit" className="py-2.5 px-5 bg-emerald-500 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 ease hover:bg-emerald-600">
                                儲存變更</button>
                            <button type="button" className="py-2.5 px-5 border-none bg-gray-100 rounded-md text-base cursor-pointer transition-all duration-300 ease hover:bg-gray-200 hover:border-gray-500"
                                onClick={handleCancel}>取消</button>
                        </div>
                    </form>
                </div>

                <div className="max-w-[480px] my-5 px-5 py-2 w-full md:max-w-[800px]">
                    <button
                        onClick={handleLogout}
                        className="py-2.5 px-5 w-full bg-red-500 text-white rounded-md text-sm transition-colors duration-300 ease hover:bg-red-700 whitespace-nowrap"
                    >
                        登出
                    </button>
                </div>
            </main>

            {isMobile && <MobileNavbar />}
        </div >
    );
}

export default ProfilePage;