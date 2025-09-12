import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import axios from "axios";
import { useState, useEffect } from "react";

interface Warehouse {
  id?: number;
  warehouseName: string;
  location: string;
  description: string;
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState<Warehouse>({
    warehouseName: "",
    location: "",
    description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/warehouse/get");
      setWarehouses(response.data);
    } catch (error) {
      console.error("获取仓库列表失败:", error);
    }
  };

  const handleAddWarehouse = async () => {
    try {
      await axios.post("http://localhost:8080/api/warehouse/add", newWarehouse);
      setNewWarehouse({ warehouseName: "", location: "", description: "" });
      setShowAddForm(false);
      fetchWarehouses(); // 刷新列表
      alert("仓库添加成功!");
    } catch (error) {
      console.error("添加仓库失败:", error);
      alert("添加仓库失败!");
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col h-screen">
      <Header
        title="仓库管理"
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar/>
        
        <div className="flex-1 p-6">
          {/* 搜索和添加按钮 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="搜索仓库名称、位置或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              添加仓库
            </button>
          </div>

          {/* 添加仓库表单 */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">添加新仓库</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    仓库名称 *
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.warehouseName}
                    onChange={(e) => setNewWarehouse({...newWarehouse, warehouseName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    位置
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    value={newWarehouse.description}
                    onChange={(e) => setNewWarehouse({...newWarehouse, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddWarehouse}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={!newWarehouse.warehouseName}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          {/* 仓库列表 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    仓库名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouse.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {warehouse.warehouseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouse.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {warehouse.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWarehouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "没有找到匹配的仓库" : "暂无仓库数据"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
