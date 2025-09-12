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

interface BomLine {
  id?: number;
  componentItem: Item;
  quantity: number;
}

interface Bom {
  id?: number;
  productItem: Item;
  quantity: number;
  bomLines: BomLine[];
}

export default function BomPage() {
  const [boms, setBoms] = useState<Bom[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBom, setSelectedBom] = useState<Bom | null>(null);
  const [newBom, setNewBom] = useState<Bom>({
    productItem: { name: "", description: "", itemType: "", unit: "" },
    quantity: 1,
    bomLines: []
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBoms();
    fetchItems();
  }, []);

  const fetchBoms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/boms");
      setBoms(response.data);
    } catch (error) {
      console.error("获取BOM列表失败:", error);
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

  const handleAddBomLine = () => {
    setNewBom({
      ...newBom,
      bomLines: [
        ...newBom.bomLines,
        { componentItem: { name: "", description: "", itemType: "", unit: "" }, quantity: 1 }
      ]
    });
  };

  const handleRemoveBomLine = (index: number) => {
    const updatedLines = newBom.bomLines.filter((_, i) => i !== index);
    setNewBom({ ...newBom, bomLines: updatedLines });
  };

  const handleBomLineChange = (index: number, field: string, value: any) => {
    const updatedLines = newBom.bomLines.map((line, i) => 
      i === index ? { ...line, [field]: value } : line
    );
    setNewBom({ ...newBom, bomLines: updatedLines });
  };

  const handleAddBom = async () => {
    try {
      await axios.post("http://localhost:8080/api/boms", newBom);
      setNewBom({
        productItem: { name: "", description: "", itemType: "", unit: "" },
        quantity: 1,
        bomLines: []
      });
      setShowAddForm(false);
      fetchBoms();
      alert("BOM添加成功!");
    } catch (error) {
      console.error("添加BOM失败:", error);
      alert("添加BOM失败!");
    }
  };

  const handleDeleteBom = async (id: number) => {
    if (confirm("确定要删除这个BOM吗？")) {
      try {
        await axios.delete(`http://localhost:8080/api/boms/${id}`);
        fetchBoms();
        alert("BOM删除成功!");
      } catch (error) {
        console.error("删除BOM失败:", error);
        alert("删除BOM失败!");
      }
    }
  };

  const viewBomDetails = (bom: Bom) => {
    setSelectedBom(bom);
    setShowDetailModal(true);
  };

  const filteredBoms = boms.filter(bom =>
    bom.productItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.productItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col h-screen">
      <Header
        title="材料单(BOM)管理"
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
                placeholder="搜索产品名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              添加BOM
            </button>
          </div>

          {/* 添加BOM表单 */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">添加新BOM</h3>

              {/* 产品信息 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    产品物料 *
                  </label>
                  <select
                    value={newBom.productItem.id || ""}
                    onChange={(e) => {
                      const selectedItem = items.find(
                        (item) => item.id === parseInt(e.target.value)
                      );
                      setNewBom({
                        ...newBom,
                        productItem: selectedItem || {
                          name: "",
                          description: "",
                          itemType: "",
                          unit: "",
                        },
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
                    产品数量 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBom.quantity}
                    onChange={(e) =>
                      setNewBom({
                        ...newBom,
                        quantity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* BOM行项目 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">组件物料</h4>
                  <button
                    type="button"
                    onClick={handleAddBomLine}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                  >
                    添加组件
                  </button>
                </div>

                {newBom.bomLines.map((line, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        组件物料
                      </label>
                      <select
                        value={line.componentItem.id || ""}
                        onChange={(e) => {
                          const selectedItem = items.find(
                            (item) => item.id === parseInt(e.target.value)
                          );
                          handleBomLineChange(
                            index,
                            "componentItem",
                            selectedItem || {
                              name: "",
                              description: "",
                              itemType: "",
                              unit: "",
                            }
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">选择组件物料</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        数量
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={line.quantity}
                        onChange={(e) =>
                          handleBomLineChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveBomLine(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddBom}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={!newBom.productItem.id || newBom.quantity <= 0}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          {/* BOM列表 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    组件数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBoms.map((bom) => (
                  <tr key={bom.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bom.productItem.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.quantity} {bom.productItem.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.bomLines.length} 个组件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => viewBomDetails(bom)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDeleteBom(bom.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBoms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "没有找到匹配的BOM" : "暂无BOM数据"}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* BOM详情模态框 */}
      {showDetailModal && selectedBom && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">BOM详情</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品名称
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBom.productItem.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品数量
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBom.quantity} {selectedBom.productItem.unit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品描述
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBom.productItem.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品类型
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBom.productItem.itemType === "RAW" && "原材料"}
                  {selectedBom.productItem.itemType === "SEMI" && "半成品"}
                  {selectedBom.productItem.itemType === "FINAL" && "成品"}
                </p>
              </div>
            </div>

            <h4 className="text-md font-medium mb-4">组件列表</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      组件名称
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      数量
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      单位
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      类型
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedBom.bomLines.map((line, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {line.componentItem?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {line.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {line.componentItem?.unit || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {line.componentItem?.itemType === "RAW" && "原材料"}
                        {line.componentItem?.itemType === "SEMI" && "半成品"}
                        {line.componentItem?.itemType === "FINAL" && "成品"}
                        {!line.componentItem?.itemType && 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
