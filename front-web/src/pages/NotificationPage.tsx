import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  operation: string;
  timestamp: string;
  operator: string | null;
  actionUrl: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Notification[]>("/api/log");
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error("获取通知失败:", err);
      setError("获取通知失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="信息通知"
        subtitle="生产系统信息"
        showBackButton
      />
      
      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* 内容区域 */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col min-h-full justify-between p-6">
            {/* 内容区 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">系统通知列表</h2>
                
                {/* 刷新按钮 */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={fetchNotifications}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    刷新通知
                  </button>
                </div>

                {/* 通知列表 */}
                {loading ? (
                  <div className="text-center py-8">
                    <p>加载中...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    {error}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无通知
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {notification.operation}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              操作人: {notification.operator || "系统"}
                            </p>
                            <p className="text-sm text-gray-500">
                              时间: {formatDateTime(notification.timestamp)}
                            </p>
                          </div>
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                            >
                              查看详情
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
