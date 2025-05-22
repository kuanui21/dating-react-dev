import { useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import mockMatches from '../mocks/matches.json';
import homeBackgroundImage from '../assets/home.jpg';
import { Link } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate()

    const handleFacebookLogin = () => {
        localStorage.setItem("loginId", "4")
        const myId = localStorage.getItem("loginId");
        const myData = mockMatches.find(match => match.id === myId);

        // 檢查是否有使用者帳號
        if (myData) {
            alert(`以 ${myData.name} 帳號透過 Facebook 登入成功！`);
            navigate('/match-feed');
        } else {
            alert('登入失敗，帳號不存在或驗證錯誤。');
        }
    };

    const handleSMSLogin = () => {
        localStorage.setItem("loginId", "4")
        const myId = localStorage.getItem("loginId");
        const myData = mockMatches.find(match => match.id === myId);

        // 檢查是否有使用者帳號
        if (myData) {
            alert(`以 ${myData.name} 帳號透過 SMS 登入成功！`);
            navigate('/match-feed');
        } else {
            alert('登入失敗，帳號不存在或驗證錯誤。');
        }
    };

    useEffect(() => {
        const myId = localStorage.getItem("loginId");
        const myData = mockMatches.find(match => match.id === myId);

        if (myData) {
            navigate('/match-feed');
        }
    }, []);


    return (
        <div
            className="home-page relative flex flex-col items-center min-h-screen bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${homeBackgroundImage})` }}
        >
            {/* 灰底疊加層 */}
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

            <div className="relative z-10 flex justify-center items-center min-h-screen">
                <div className="bg-gray-100 m-2 p-8 rounded-lg shadow-md w-full sm:w-96 text-center">
                    <h2 className="text-2xl text-red-400 font-semibold mb-5">開始使用</h2>
                    <p className="terms text-gray-700 text-sm mb-5">
                        點選「登入」即代表您同意我們的條款。
                        瞭解我們如何依照
                        <Link to="/login" className="text-blue-600 hover:underline">隱私政策</Link>和
                        <Link to="/login" className="text-blue-600 hover:underline">Cookie 政策</Link>處理您的資料。
                    </p>

                    <button onClick={handleFacebookLogin}
                        className="login-button facebook-login flex items-center justify-center w-full py-3 bg-blue-600 text-white border border-blue-600 rounded-md text-base cursor-pointer transition-colors duration-300 ease mb-2.5 hover:bg-blue-700 hover:border-blue-700">
                        <span className="icon mr-2.5">
                            <FaFacebook size={24} fill="currentColor" />
                        </span>
                        用 Facebook 登入
                    </button>

                    <button onClick={handleSMSLogin}
                        className="login-button sms-login flex items-center justify-center w-full py-3 bg-green-600 text-white border border-green-600 rounded-md text-base cursor-pointer transition-colors duration-300 ease mb-2.5 hover:bg-green-700 hover:border-green-700">
                        <span className="icon mr-2.5">
                            <MdMessage size={24} fill="currentColor" />
                        </span>
                        使用電話號碼登入
                    </button>

                    <div className="login-links mt-5 text-center">
                        <Link to="/login" className="text-gray-700 text-sm no-underline hover:underline">
                            登入時遇到問題嗎？
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;