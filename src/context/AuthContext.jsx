import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // 檢查 localStorage 或 cookie 以判斷登入狀態
        const storedLoginId = localStorage.getItem("loginId");
        if (storedLoginId) {
            setIsAuthenticated(true);
            setUserId(storedLoginId);
        }
    }, []);

    const login = (id) => {
        localStorage.setItem("loginId", id);
        setIsAuthenticated(true);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem("loginId");
        setIsAuthenticated(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };