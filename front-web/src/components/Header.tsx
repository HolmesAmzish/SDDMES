import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 如果用 Next.js 改成 useRouter
import logo from "../assets/sdd-logo.png";
import { FaArrowLeft } from "react-icons/fa";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export default function Header({
  title,
  subtitle,
  actions,
  children,
  showBackButton = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // 初始化从 localStorage 或 token 解码
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const uname = decoded.sub || decoded.username;
        localStorage.setItem("username", uname);
        setUsername(uname);
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
  }, []);

  // 检查登录状态
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now;
    } catch {
      return false;
    }
  };

  // 点击登录 → 跳转 /login
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    console.log("User logged out");
    setMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-2">
        {/* 返回按钮 */}
        <div className="w-10">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded border border-gray-300 hover:bg-gray-200 transition flex items-center justify-center"
              aria-label="返回"
            >
              <FaArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </div>
        <img src={logo} alt="sdd-logo" className="h-8 w-8 drop-shadow-lg" />
        <div>
          {title && <h1 className="font-bold">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {children}
        </div>
      </div>

      {/* 登录/用户菜单 */}
      <div className="relative flex gap-2 items-center">
        {actions}
        {isLoggedIn() ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-600 hover:text-gray-900 mr-4 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {username}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                <button
                  onClick={() => {
                    console.log("设置 clicked");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  设置
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  退出
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="text-gray-600 hover:text-gray-900 mr-4 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            onClick={handleLoginClick}
          >
            登录
          </button>
        )}
      </div>
    </header>
  );
}
