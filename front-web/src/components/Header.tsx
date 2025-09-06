import React from "react";
import { useNavigate } from "react-router-dom"; // 如果你用 Next.js 则改为 useRouter
import logo from "../assets/sdd-logo.png";
import {FaArrowLeft} from "react-icons/fa"; // 导入箭头图标

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean; // 新增：是否显示返回按钮
}

export default function Header({
  title,
  subtitle,
  actions,
  children,
  showBackButton = false, // 默认不显示
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300">
      <div className="flex items-center gap-2">
        {/* 返回按钮位置 */}
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

      <div className="flex gap-2">{actions}</div>
    </header>
  );
}
