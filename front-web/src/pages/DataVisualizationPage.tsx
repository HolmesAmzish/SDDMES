import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import * as echarts from 'echarts';

interface VisualizationData {
  defectTypeCounts: Record<string, number>;
  timeDistribution: Record<string, number>;
  defectNumberDistribution: Record<number, number>;
  dailyDetectionCounts: Array<{ date: string; count: number }>;
  recentDefectSummaries: Array<{
    date: string;
    totalDefects: number;
    inclusionCount: number;
    patchCount: number;
    scratchCount: number;
    otherCount: number;
  }>;
}

export default function DataVisualizationPage() {
  const [data, setData] = useState<VisualizationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      renderCharts();
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get<VisualizationData>(
        "http://localhost:8080/api/detection/visualization"
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch visualization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!data) return;

    // Defect Type Pie Chart
    const defectTypeChart = echarts.init(document.getElementById('defect-type-chart')!);
    defectTypeChart.setOption({
      title: { text: '缺陷类型分布', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        name: '缺陷类型',
        type: 'pie',
        radius: '50%',
        data: Object.entries(data.defectTypeCounts).map(([name, value]) => ({
          value,
          name: name === 'inclusion' ? '夹杂物' : 
                name === 'patch' ? '补丁' : 
                name === 'scratch' ? '划痕' : '其他'
        })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
      }]
    });

    // Time Distribution Bar Chart
    const timeChart = echarts.init(document.getElementById('time-chart')!);
    timeChart.setOption({
      title: { text: '检测时间分布', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: Object.keys(data.timeDistribution) },
      yAxis: { type: 'value' },
      series: [{
        data: Object.values(data.timeDistribution),
        type: 'bar'
      }]
    });

    // Defect Number Distribution Chart
    const defectNumChart = echarts.init(document.getElementById('defect-num-chart')!);
    defectNumChart.setOption({
      title: { text: '缺陷数量分布', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: Object.keys(data.defectNumberDistribution) },
      yAxis: { type: 'value' },
      series: [{
        data: Object.values(data.defectNumberDistribution),
        type: 'line'
      }]
    });

    // Daily Detection Count Chart
    const dailyChart = echarts.init(document.getElementById('daily-chart')!);
    dailyChart.setOption({
      title: { text: '最近15天检测量', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.dailyDetectionCounts.map(d => d.date) },
      yAxis: { type: 'value' },
      series: [{
        data: data.dailyDetectionCounts.map(d => d.count),
        type: 'bar'
      }]
    });

    // Recent Defect Summary Chart
    const recentChart = echarts.init(document.getElementById('recent-chart')!);
    recentChart.setOption({
      title: { text: '最近缺陷检测结果', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['总缺陷数', '夹杂物', '补丁', '划痕', '其他'] },
      xAxis: { type: 'category', data: data.recentDefectSummaries.map(d => d.date) },
      yAxis: { type: 'value' },
      series: [
        { name: '总缺陷数', type: 'line', data: data.recentDefectSummaries.map(d => d.totalDefects) },
        { name: '夹杂物', type: 'line', data: data.recentDefectSummaries.map(d => d.inclusionCount) },
        { name: '补丁', type: 'line', data: data.recentDefectSummaries.map(d => d.patchCount) },
        { name: '划痕', type: 'line', data: data.recentDefectSummaries.map(d => d.scratchCount) },
        { name: '其他', type: 'line', data: data.recentDefectSummaries.map(d => d.otherCount) }
      ]
    });
  };

  if (loading) {
    return (
      <div className="flex-col h-screen">
        <Header title="数据可视化" subtitle="钢铁缺陷检测生产制造系统" showBackButton />
        <div className="flex justify-center items-center h-full">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col h-screen">
      <Header title="数据可视化" subtitle="钢铁缺陷检测生产制造系统" showBackButton />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">缺陷检测数据可视化</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div id="defect-type-chart" style={{ height: '300px' }}></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div id="time-chart" style={{ height: '300px' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div id="defect-num-chart" style={{ height: '300px' }}></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div id="daily-chart" style={{ height: '300px' }}></div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div id="recent-chart" style={{ height: '400px' }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
