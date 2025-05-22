import homeBackgroundImage from '../assets/home.jpg';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div
            className="home-page relative flex flex-col items-center min-h-screen bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${homeBackgroundImage})` }}
        >
            {/* 灰底疊加層 */}
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

            <div className="relative z-10 flex flex-col justify-center items-center text-center h-screen px-6">
                <h1 className="text-white text-5xl font-extrabold mb-6
                    text-shadow-[3px_3px_6px_rgb(255_88_100_/_0.6)]">
                    歡迎來到我們的交友平台
                </h1>
                <p className="text-white text-2xl drop-shadow mb-10">
                    尋找新的朋友，建立有意義的聯繫。
                </p>
                <Link
                    to="/login"
                    className="inline-block px-6 py-3 rounded-full text-base font-medium
                     bg-white text-red-400  hover:bg-red-400 hover:text-white transition-colors duration-300"
                >
                    登入
                </Link>
            </div>

            {/* 主要特色 */}
            <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm py-12 px-6 text-center 
                    md:flex md:items-center md:justify-around">
                <div className="mt-8 md:mt-0 md:w-1/2">
                    <img src="/src/assets/home2.jpg" alt="主要特" className="rounded-3xl shadow-md" />
                </div>
                <div className="mt-8 md:mt-0 md:w-1/2">
                    <h2 className="text-red-400 text-3xl my-6 font-semibold">主要特色</h2>
                    <ul className="list-none">
                        <li className="text-gray-700 text-lg mb-4">滑動配對：輕鬆找到感興趣的人。</li>
                        <li className="text-gray-700 text-lg mb-4">即時聊天：隨時隨地與您的配對對象交流。</li>
                        <li className="text-gray-700 text-lg">個人資料定制：展示您的獨特魅力。</li>
                    </ul>
                </div>
            </div>

            {/* 頁尾 */}
            <div className="w-full text-center text-sm text-gray-600 py-6 bg-white bg-opacity-80 backdrop-blur-sm">
                <p>&copy; 2025 我們的交友平台</p>
            </div>
        </div>
    );
}

export default HomePage;