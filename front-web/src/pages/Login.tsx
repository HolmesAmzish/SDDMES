import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/sdd-logo.png";
import lightLogo from "../assets/sdd-logo-white.png";
import bgImage from "../assets/login-bg.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      const { token, username: uname } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", uname || username);
        navigate("/");
      }
    } catch (err) {
      setError("用户名或密码错误");
    }
  };

  return (
    <div className="grid grid-cols-[1fr_2fr] h-screen w-screen">
      {/* 左侧背景 */}
      <div
          className="relative flex flex-col items-center bg-blue-900 text-white h-screen"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
      >
        {/* 深蓝遮罩 */}
        <div className="absolute inset-0 bg-blue-900/70"></div>

        {/* 中间内容 */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
          <img src={lightLogo} alt="logo" className="w-28 mb-6"/>
          <h1 className="text-3xl font-semibold mb-2">钢铁缺陷检测生产系统</h1>
          <p className="text-lg">精密检测，智能化分析</p>
        </div>

        {/* 底部备案信息 */}
        <div className="relative z-10 flex flex-col items-center pb-6 text-center text-sm">
          <p>ICP备案号：苏ICP备2024062761</p>
          <p>
            &copy; {new Date().getFullYear()}
            <a className="hover:text-blue-600 ml-1" href="https://github.com/HolmesAmzish/SDDMES">SDDMES</a>
          </p>
        </div>
      </div>


      {/* 右侧登录表单 */}
      <div className="flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md shadow-lg rounded-xl bg-white p-8">
          {/* Logo 和标题 */}
          <div className="flex items-center mb-6">
            <img src={logo} className="w-16" />
            <div className="px-4">
              <h2 className="text-2xl font-bold text-gray-700">
                钢铁缺陷检测生产系统
              </h2>
              <h3 className="text-xl text-gray-500">用户登录</h3>
            </div>
          </div>

          {/* 表单 grid */}
          <div className="grid gap-6">
            {/* 用户名 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* 密码 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* 记住我 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-600">记住密码</label>
            </div>

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              登录
            </button>

            {/* 错误提示 */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* 注册入口 */}
            <p className="text-sm text-gray-500 text-center">
              没有账号？
              <a href="/register" className="text-blue-500">
                申请
              </a>
            </p>
          </div>

          {/* 底部版本号 */}
          <p className="text-xs text-gray-500 text-center mt-8">
            汽车零部件检测系统 v3.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
