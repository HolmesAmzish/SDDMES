import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Setting() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        title="系统设置"
        subtitle="配置系统参数和用户偏好"
        showBackButton
      />

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* 内容 + Footer */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col min-h-full justify-between p-6">
            {/* 内容区 */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
              
              {/* 用户设置卡片 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">用户设置</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      用户名
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入用户名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入邮箱"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    保存设置
                  </button>
                </div>
              </div>

              {/* 系统设置卡片 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">系统设置</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">深色模式</h3>
                      <p className="text-sm text-gray-500">启用深色主题</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">消息通知</h3>
                      <p className="text-sm text-gray-500">接收系统通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 数据管理卡片 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">数据管理</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
                    清除缓存数据
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
                    导出检测数据
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                    查看系统日志
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
