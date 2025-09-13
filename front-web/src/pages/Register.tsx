import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/sdd-logo.png";
import lightLogo from "../assets/sdd-logo-white.png";
import bgImage from "../assets/login-bg.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError("请填写所有字段");
      return;
    }

    if (password !== confirmPassword) {
      setError("密码确认不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少6位");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password
      });

      const { token, username: registeredUsername, message } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", registeredUsername || username);
        alert(message || "注册成功！");
        navigate("/");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError("用户名或邮箱已被注册");
      } else {
        setError("注册失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
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

      {/* 右侧注册表单 */}
      <div className="flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md shadow-lg rounded-xl bg-white p-8">
          {/* Logo 和标题 */}
          <div className="flex items-center mb-6">
            <img src={logo} className="w-16" />
            <div className="px-4">
              <h2 className="text-2xl font-bold text-gray-700">
                钢铁缺陷检测生产系统
              </h2>
              <h3 className="text-xl text-gray-500">账户申请</h3>
            </div>
          </div>

          {/* 表单 grid */}
          <div className="grid gap-4">
            {/* 用户名 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                用户名 *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="请输入用户名"
              />
            </div>

            {/* 邮箱 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                邮箱 *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="请输入邮箱地址"
              />
            </div>

            {/* 密码 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                密码 *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="至少6位字符"
              />
            </div>

            {/* 确认密码 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                确认密码 *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="请再次输入密码"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* 注册按钮 */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "注册中..." : "申请账户"}
            </button>

            {/* 返回登录 */}
            <button
              onClick={handleBackToLogin}
              className="w-full text-gray-600 py-2 rounded-md hover:text-gray-800 transition border border-gray-300 hover:border-gray-400"
            >
              返回登录
            </button>
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
