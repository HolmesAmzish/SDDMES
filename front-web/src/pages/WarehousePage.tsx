import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';

interface Warehouse {
  id?: number;
  warehouseName: string;
  location: string;
  description: string;
}

interface StockTransaction {
  id?: number;
  transactionType: string | null;
  quantity: number;
  item: {
    id: number;
    name: string;
    description: string;
    itemType: string;
    unit: string;
  };
  warehouse: {
    id: number;
    warehouseName: string;
    location: string;
    description: string;
  };
  creator: {
    id: number;
    username: string;
    email: string;
  };
  timestamp: string;
  batch: any;
}

interface StockChartData {
  dates: string[];
  items: {
    [itemName: string]: number[];
  };
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
  const [chartData, setChartData] = useState<StockChartData>({ dates: [], items: {} });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState<Warehouse>({
    warehouseName: "",
    location: "",
    description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    fetchWarehouses();
    fetchStockTransactions();
  }, []);

  useEffect(() => {
    if (stockTransactions.length > 0) {
      processChartData();
    }
  }, [stockTransactions]);

  useEffect(() => {
    if (chartRef.current && chartData.dates.length > 0) {
      renderChart();
    }

    // Cleanup function to dispose chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get("/api/warehouse/get");
      setWarehouses(response.data);
    } catch (error) {
      console.error("获取仓库列表失败:", error);
    }
  };

  const fetchStockTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get<StockTransaction[]>("/api/stockTransaction");
      setStockTransactions(response.data);
    } catch (error) {
      console.error("获取库存交易数据失败:", error);
      alert("获取库存交易数据失败!");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = () => {
    // Filter only inbound transactions (including null transactionType) and sort by date
    const inboundTransactions = stockTransactions
      .filter(t => t.transactionType === 'IN' || t.transactionType === null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Get unique dates
    const dates = Array.from(new Set(inboundTransactions.map(t => t.timestamp.split('T')[0]))).sort();

    // Get unique items
    const items = Array.from(new Set(inboundTransactions.map(t => t.item.name)));

    // Initialize chart data structure
    const itemsData: { [itemName: string]: number[] } = {};
    items.forEach(item => {
      itemsData[item] = new Array(dates.length).fill(0);
    });

    // Aggregate quantities by date and item
    inboundTransactions.forEach(transaction => {
      const date = transaction.timestamp.split('T')[0];
      const dateIndex = dates.indexOf(date);
      if (dateIndex !== -1) {
        itemsData[transaction.item.name][dateIndex] += transaction.quantity;
      }
    });

    setChartData({ dates, items: itemsData });
  };

  const renderChart = () => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if exists
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    const series = Object.entries(chartData.items).map(([itemName, quantities], index) => ({
      name: itemName,
      type: 'line',
      data: quantities,
      smooth: true,
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 6
    }));

    const option = {
      title: {
        text: '物料入库趋势图',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: Object.keys(chartData.items),
        top: 30,
        right: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '入库数量'
      },
      series: series
    };

    chartInstance.current.setOption(option);
  };

  const handleAddWarehouse = async () => {
    try {
      await axios.post("/api/warehouse/add", newWarehouse);
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

          {/* 物料入库趋势图 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">物料入库趋势</h3>
            {loading ? (
              <div className="text-center py-8">
                <p>加载中...</p>
              </div>
            ) : (
              <div ref={chartRef} style={{ height: '400px', width: '100%' }}></div>
            )}
          </div>

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
