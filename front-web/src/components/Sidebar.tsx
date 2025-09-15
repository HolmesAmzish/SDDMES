import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaIndustry,
  FaBug,
  FaCog,
  FaInfoCircle,
  FaWarehouse,
  FaClipboardList,
  FaBox,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";

interface SidebarProps {
    title?: string;
}

export default function Sidebar({ title }: SidebarProps) {
    const location = useLocation();

    const groups = [
      {
        title: "生产管理",
        items: [
          { label: "生产信息", path: "/manufacturing", icon: <FaIndustry /> },
          { label: "物料管理", path: "/item", icon: <FaBox /> },
          { label: "仓库管理", path: "/warehouse", icon: <FaWarehouse /> },
          { label: "材料单(BOM)", path: "/bom", icon: <FaClipboardList /> },
          { label: "工单管理", path: "/workorder", icon: <FaFileAlt /> },
          { label: "电子看板", path: "/dashboard", icon: <FaTachometerAlt /> },
        ]
      },
      {
        title: "数据管理",
        items: [
          { label: "缺陷检测", path: "/detection", icon: <FaBug /> },
          { label: "检测数据", path: "/data", icon: <FaIndustry /> },
          { label: "数据可视化", path: "/visualization", icon: <FaChartBar /> },
        ]
      },
      {
        items: [
          // { label: "主页", path: "/", icon: <FaHome /> },
          { label: "设置", path: "/settings", icon: <FaCog /> },
          { label: "关于", path: "/about", icon: <FaInfoCircle /> },
        ]
      }
    ];

    return (
        <aside className="sticky top-0 w-64 bg-gray-50 h-screen p-4 flex flex-col overflow-y-auto border-r border-gray-200">
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            <nav className="flex flex-col gap-6">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-col gap-2">
                        {group.title && (
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                                {group.title}
                            </h3>
                        )}
                        {group.items.map((item) => {
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
                    </div>
                ))}
            </nav>
        </aside>
    );
}
