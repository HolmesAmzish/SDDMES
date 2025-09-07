import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaIndustry,
  FaBug,
  FaCog,
  FaInfoCircle,
} from "react-icons/fa";

interface SidebarProps {
    title?: string;
}

export default function Sidebar({ title }: SidebarProps) {
    const location = useLocation();

    const items = [
                { label: "主页", path: "/", icon: <FaHome /> }, // 首页
                { label: "电子看板", path: "/dashboard", icon: <FaTachometerAlt />, }, // 仪表盘/看板
                { label: "生产信息", path: "/manufacturing", icon: <FaIndustry /> }, // 工厂/生产
                { label: "检测数据", path: "/data", icon: <FaIndustry />},
                { label: "缺陷检测", path: "/detection", icon: <FaBug /> }, // 缺陷/bug
                { label: "设置", path: "/settings", icon: <FaCog /> }, // 设置
                { label: "关于", path: "/about", icon: <FaInfoCircle /> }, // 关于
              ];

    return (
        <aside className="sticky top-0 w-64 bg-gray-50 h-screen p-4 flex flex-col overflow-y-auto">
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            <nav className="flex flex-col gap-2">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${
                                isActive ? "bg-gray-200 font-semibold" : ""
                            }`}
                        >
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>

    );
}
