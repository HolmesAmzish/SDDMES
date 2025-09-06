import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import {
  FaHome,
  FaTachometerAlt,
  FaIndustry,
  FaBug,
  FaCog,
  FaInfoCircle,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        title="SDDMES"
        subtitle="钢铁缺陷检测生产制造系统"
        actions={
          <>
            <button className="hover:bg-gray-200">登录</button>
          </>
        }
      />

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          items={[
            { label: "主页", path: "/", icon: <FaHome /> }, // 首页
            {
              label: "电子看板",
              path: "/dashboard",
              icon: <FaTachometerAlt />,
            }, // 仪表盘/看板
            { label: "生产信息", path: "/manufacturing", icon: <FaIndustry /> }, // 工厂/生产
            { label: "缺陷检测", path: "/defect", icon: <FaBug /> }, // 缺陷/bug
            { label: "设置", path: "/settings", icon: <FaCog /> }, // 设置
            { label: "关于", path: "/about", icon: <FaInfoCircle /> }, // 关于
          ]}
        />

        {/* 内容 + Footer */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col min-h-full justify-between p-4">
            {/* 内容区 */}
            <div>
              <h1>Dashboard Content</h1>
              <p>Lorem ipsum dolor sit amet...</p>
              <p>更多内容...</p>

              {/* 模拟很多行内容 */}
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>第 {i + 1} 行内容</p>
              ))}
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
