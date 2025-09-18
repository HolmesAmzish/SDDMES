import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';

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
  status?: string;
}

interface WorkOrderStatus {
  workOrderNo: string;
  itemName: string;
  bomNo: string;
  processPercentage: number;
  status: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  number: number;
  size: number;
  totalElements: number;
}

export default function Dashboard() {
  const [workOrderStatuses, setWorkOrderStatuses] = useState<WorkOrderStatus[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    fetchWorkOrderStatuses();
  }, [page, pageSize]);

  // 计算工单状态分布
  const calculateStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = {
      'PENDING': 0,
      'IN_PROGRESS': 0,
      'COMPLETED': 0,
      'CANCELLED': 0
    };

    workOrderStatuses.forEach(status => {
      if (status.status && statusCounts.hasOwnProperty(status.status)) {
        statusCounts[status.status]++;
      }
    });

    return [
      { value: statusCounts.PENDING, name: '待处理' },
      { value: statusCounts.IN_PROGRESS, name: '进行中' },
      { value: statusCounts.COMPLETED, name: '已完成' },
      { value: statusCounts.CANCELLED, name: '已取消' }
    ].filter(item => item.value > 0);
  };

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);

      // 响应式调整
      const resizeChart = () => {
        chart.resize();
      };
      window.addEventListener('resize', resizeChart);

      return () => {
        window.removeEventListener('resize', resizeChart);
        chart.dispose();
      };
    }
  }, []);

  // 更新图表数据
  useEffect(() => {
    if (chartInstance) {
      const statusData = calculateStatusDistribution();
      
      if (statusData.length > 0) {
        const option = {
          title: {
            text: '工单状态分布',
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: statusData.map(item => item.name)
          },
          series: [
            {
              name: '工单状态',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                formatter: '{b}: {c} ({d}%)'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: statusData
            }
          ],
          color: ['#FFC107', '#2196F3', '#4CAF50', '#F44336']
        };

        chartInstance.setOption(option);
      } else {
        // 显示空数据提示
        chartInstance.setOption({
          title: {
            text: '工单状态分布',
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          graphic: {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: '暂无工单数据',
              fontSize: 16,
              fill: '#999'
            }
          }
        });
      }
    }
  }, [chartInstance, workOrderStatuses]);

  const fetchWorkOrderStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get<PageResponse<WorkOrderStatus>>(
        "/api/workorder/getStatuses",
        {
          params: {
            page: page,
            size: pageSize
          }
        }
      );
      setWorkOrderStatuses(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("获取工单状态失败:", error);
      alert("获取工单状态失败!");
    } finally {
      setLoading(false);
    }
  };

  const formatProcess = (process: number) => {
    return `${(process * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "PENDING": return "待处理";
      case "IN_PROGRESS": return "进行中";
      case "COMPLETED": return "已完成";
      case "CANCELLED": return "已取消";
      default: return status || "未知";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(0); // Reset to first page when changing page size
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="SDDMES 电子看板"
        subtitle="钢铁缺陷检测生产制造系统"
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
                <h2 className="text-2xl font-semibold mb-6 text-center">工单进度看板</h2>
                
                {/* 分页控制 */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <span>每页显示:</span>
                    <select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    <span>条记录</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 0}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                      上一页
                    </button>
                    <span>
                      第 {page + 1} 页 / 共 {totalPages} 页
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages - 1}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                      下一页
                    </button>
                  </div>
                </div>

                {/* 工单状态分布图表 */}
                <div className="mb-8">
                  <div 
                    ref={chartRef} 
                    style={{ width: '100%', height: '400px' }}
                    className="bg-gray-50 rounded-lg"
                  ></div>
                </div>

                {/* 工单状态列表 */}
                {loading ? (
                  <div className="text-center py-8">
                    <p>加载中...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
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
                            进度
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
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
                        {workOrderStatuses.map((status, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {status.workOrderNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {status.itemName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {status.bomNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: formatProcess(status.processPercentage) }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{formatProcess(status.processPercentage)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                status.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                status.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getStatusText(status.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              -
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              系统
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {workOrderStatuses.length === 0 && !loading && (
                      <div className="text-center py-8 text-gray-500">
                        暂无工单数据
                      </div>
                    )}
                  </div>
                )}

                {/* 刷新按钮 */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={fetchWorkOrderStatuses}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    刷新数据
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
