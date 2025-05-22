import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MatchFeedPage from './pages/MatchFeedPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import FilterPage from './pages/FilterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

// 假設的私有路由組件
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("loginId"); // 簡單檢查登入狀態
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const routerBasename = import.meta.env.MODE === 'production' ? '/dating-react-dev' : undefined;
    return (
        <Router basename={routerBasename}>
            <AuthProvider> {/* 提供登入狀態 */}
                <FilterProvider> {/* 提供篩選狀態 */}
                    <ChatProvider> {/* 提供聊天狀態 */}
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/match-feed" element={
                                <PrivateRoute>
                                    <MatchFeedPage />
                                </PrivateRoute>
                            } />
                            <Route path="/messages" element={
                                <PrivateRoute>
                                    <MessagesPage />
                                </PrivateRoute>
                            } />
                            <Route path="/filter" element={
                                <PrivateRoute>
                                    <FilterPage />
                                </PrivateRoute>
                            } />
                            <Route path="/profile" element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            } />

                            {/* 可以添加 404 頁面 */}
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </ChatProvider>
                </FilterProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;