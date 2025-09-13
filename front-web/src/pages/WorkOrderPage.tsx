import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import axios from "axios";
import { useState, useEffect } from "react";

interface Item {
  id?: number;
  name: string;
  description: string;
  itemType: string;
  unit: string;
}

interface Bom {
  id?: number;
  productItem: Item;
  quantity: number;
}

interface WorkOrder {
  id?: number;
  workOrderNo: string;
  productionQuantity: number;
  productItem: Item;
  bom: Bom;
  createdAt?: string;
  creator?: {
    id?: number;
    username?: string;
  };
}

export default function WorkOrderPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [boms, setBoms] = useState<Bom[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newWorkOrder, setNewWorkOrder] = useState<WorkOrder>({
    workOrderNo: "",
    productionQuantity: 1,
    productItem: { name: "", description: "", itemType: "", unit: "" },
    bom: { productItem: { name: "", description: "", itemType: "", unit: "" }, quantity: 1 }
  });

  useEffect(() => {
    fetchWorkOrders();
    fetchItems();
    fetchBoms();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workorder/get");
      setWorkOrders(response.data);
    } catch (error) {
      console.error("获取工单列表失败:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/item/get");
      setItems(response.data);
    } catch (error) {
      console.error("获取物料列表失败:", error);
    }
  };

  const fetchBoms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/boms");
      setBoms(response.data);
    } catch (error) {
      console.error("获取BOM列表失败:", error);
    }
  };

  const handleAddWorkOrder = async () => {
    try {
      await axios.post("http://localhost:8080/api/workorder/add", newWorkOrder);
      setNewWorkOrder({
        workOrderNo: "",
        productionQuantity: 1,
        productItem: { name: "", description: "", itemType: "", unit: "" },
        bom: { productItem: { name: "", description: "", itemType: "", unit: "" }, quantity: 1 }
      });
      setShowAddForm(false);
      fetchWorkOrders();
      alert("工单添加成功!");
    } catch (error) {
      console.error("添加工单失败:", error);
      alert("添加工单失败!");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  const filteredWorkOrders = workOrders.filter(workOrder =>
    workOrder.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workOrder.productItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col h-screen">
      <Header
        title="工单管理"
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 p-6">
          {/* 搜索和添加按钮 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="搜索工单号或产品名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              添加工单
            </button>
          </div>

          {/* 添加工单表单 */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">添加新工单</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工单号 *
                  </label>
                  <input
                    type="text"
                    value={newWorkOrder.workOrderNo}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, workOrderNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="请输入工单号"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生产数量 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkOrder.productionQuantity}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, productionQuantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    产品物料 *
                  </label>
                  <select
                    value={newWorkOrder.productItem.id || ""}
                    onChange={(e) => {
                      const selectedItem = items.find(
                        (item) => item.id === parseInt(e.target.value)
                      );
                      setNewWorkOrder({
                        ...newWorkOrder,
                        productItem: selectedItem || { name: "", description: "", itemType: "", unit: "" }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">选择产品物料</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BOM *
                  </label>
                  <select
                    value={newWorkOrder.bom.id || ""}
                    onChange={(e) => {
                      const selectedBom = boms.find(
                        (bom) => bom.id === parseInt(e.target.value)
                      );
                      setNewWorkOrder({
                        ...newWorkOrder,
                        bom: selectedBom || { productItem: { name: "", description: "", itemType: "", unit: "" }, quantity: 1 }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">选择BOM</option>
                    {boms.map((bom) => (
                      <option key={bom.id} value={bom.id}>
                        {bom.productItem.name} - {bom.quantity} {bom.productItem.unit}
                      </option>
                    ))}
                  </select>
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
                  onClick={handleAddWorkOrder}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={!newWorkOrder.workOrderNo || newWorkOrder.productionQuantity <= 0 || !newWorkOrder.productItem.id || !newWorkOrder.bom.id}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          {/* 工单列表 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    生产数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BOM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建人
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkOrders.map((workOrder) => (
                  <tr key={workOrder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {workOrder.workOrderNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.productItem.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.productionQuantity} {workOrder.productItem.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.bom?.productItem?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(workOrder.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.creator?.username || '系统'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWorkOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "没有找到匹配的工单" : "暂无工单数据"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
