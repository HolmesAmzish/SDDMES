import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    title?: string;
    items: SidebarItem[];
}

export default function Sidebar({ title, items }: SidebarProps) {
    const location = useLocation();

    return (
        <aside className="sticky top-0 w-64 bg-gray-100 h-screen p-4 flex flex-col overflow-y-auto">
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            <nav className="flex flex-col gap-2">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${
                                isActive ? "bg-gray-300 font-semibold" : ""
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
