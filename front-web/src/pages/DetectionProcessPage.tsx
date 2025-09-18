import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import placeholder from "../assets/placeholder.jpg";

interface DefectResult {
  id?: number;
  detectConfidences: string;
  defectNumber: number;
  timeCost: number;
  hasInclusion: boolean;
  hasPatch: boolean;
  hasScratch: boolean;
  hasOther: boolean;
  resultFigure?: string;
}

export default function DetectionProcessPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<DefectResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DefectResult | null>(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  /** 选择文件 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  /** 选择文件夹 */
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  /** 开始检测 */
  const startDetection = async () => {
    if (selectedFiles.length === 0) return alert("请选择文件");
    setLoading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      console.log("开始检测，发送文件数量:", selectedFiles.length);
      
      const res = await axios.post<DefectResult[]>(
        "/api/detect",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      console.log("检测API返回结果:", res.data);
      setResults(res.data);
      
      if (res.data && res.data.length > 0) {
        alert(`检测完成！共检测 ${res.data.length} 个文件`);
      } else {
        alert("检测完成，但未返回结果");
      }
    } catch (err) {
      console.error("检测失败:", err);
      alert("检测失败，请检查检测服务是否正常运行");
    } finally {
      setLoading(false);
    }
  };

  /** 保存结果 */
  const saveResults = async () => {
    if (results.length === 0) return alert("没有检测结果可保存");
    
    try {
      // 保存每个检测结果到后端
      for (const result of results) {
        await axios.post<DefectResult>(
          "/api/detection/add", 
          result,
          { headers: { "Content-Type": "application/json" } }
        );
      }
      
      // 保存成功后清空结果列表和选中结果
      setResults([]);
      setSelectedResult(null);
      alert("保存成功！结果已清空");
    } catch (err) {
      console.error("保存失败:", err);
      alert("保存失败，请检查后端服务是否正常运行");
    }
  };

  // Define colors for each defect type
  const defectColors: { [key: string]: string } = {
    '夹杂物': 'rgba(255, 99, 132, 0.6)',
    '补丁': 'rgba(54, 162, 235, 0.6)',
    '划痕': 'rgba(255, 206, 86, 0.6)',
    '其他': 'rgba(75, 192, 192, 0.6)'
  };

  /** 格式化标签 - 返回JSX元素 */
  const FormatLabels: React.FC<{ item: DefectResult }> = ({ item }) => {
    const labels = [
      item.hasInclusion && "夹杂物",
      item.hasPatch && "补丁",
      item.hasScratch && "划痕",
      item.hasOther && "其他",
    ].filter(Boolean) as string[];
    
    return (
      <>
        {labels.map((label, index) => (
          <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginRight: '5px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: defectColors[label], borderRadius: '50%', display: 'inline-block' }}></span>
            {label}
            {index < labels.length - 1 && '，'}
          </span>
        ))}
      </>
    );
  };

  /** 格式化时间 */
  const formatTime = (time: number) =>
    time != null ? `${time.toFixed(2)} s` : "-";

  return (
    <div className="flex-col h-screen">
      <Header
        title="钢铁缺陷检测数据"
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white">
            <div className="grid grid-cols-3 gap-6">
              {/* 左侧（结果） */}
              <div className="col-span-2 space-y-6">
                {/* 结果预览 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    检测结果预览
                  </h2>
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center rounded p-4 w-full">
                      <img
                        src={
                          selectedResult?.resultFigure
                            ? `data:image/png;base64,${selectedResult.resultFigure}`
                            : selectedFiles[0]
                            ? URL.createObjectURL(selectedFiles[0])
                            : placeholder
                        }
                        alt="检测结果"
                        className="max-w-full max-h-72 object-contain"
                      />
                    </div>
                    {selectedResult && (
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="mt-2 px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                      >
                        清除选择
                      </button>
                    )}
                  </div>
                  <p className="mx-4">
                    {selectedResult
                      ? `查看结果: ${selectedResult.detectConfidences}`
                      : loading
                      ? "正在等待检测结果..."
                      : "等待检测结果或选择具体结果查看"}
                  </p>
                </div>

                {/* 表格 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    检测结果
                  </h2>
                  <div className="overflow-x-auto h-[430px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            名称
                          </th>
                          <th className="px-4 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            标签
                          </th>
                          <th className="px-4 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            缺陷数
                          </th>
                          <th className="px-4 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            用时
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-50 divide-y divide-gray-200">
                        {results.map((item) => (
                          <tr 
                            key={item.id}
                            onClick={() => setSelectedResult(item)}
                            className={`cursor-pointer hover:bg-gray-100 ${
                              selectedResult?.id === item.id ? 'bg-white' : ''
                            }`}
                          >
                            <td className="px-4 py-2">
                              {item.detectConfidences}
                            </td>
                            <td className="px-4 py-2"><FormatLabels item={item} /></td>
                            <td className="px-4 py-2">{item.defectNumber}</td>
                            <td className="px-4 py-2">
                              {formatTime(item.timeCost)}
                            </td>
                          </tr>
                        ))}
                        {results.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-4">
                              暂无数据
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 右侧（控制面板） */}
              <div className="col-span-1 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    控制面板
                  </h2>

                  <div className="space-y-4">
                    {/* 文件选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        选择图片文件
                      </label>
                      <input
                        type="file"
                        multiple
                        ref={imageInputRef}
                        onChange={handleFileChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* 文件夹选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        选择文件夹
                      </label>
                      <input
                        type="file"
                        // @ts-ignore - webkitdirectory is a non-standard attribute
                        webkitdirectory=""
                        // @ts-ignore - directory is a non-standard attribute
                        directory=""
                        ref={folderInputRef}
                        onChange={handleFolderChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* 操作按钮 */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={startDetection}
                        className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        开始检测
                      </button>
                      <button
                        onClick={saveResults}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-indigo-700"
                      >
                        保存结果
                      </button>
                    </div>

                    {/* 已选图片列表 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        已选择图片
                      </label>
                      <div className="bg-gray-100 p-4 border border-gray-200 h-72 overflow-auto">
                        {selectedFiles.map((file) => (
                          <p key={file.name}>{file.name}</p>
                        ))}
                        {selectedFiles.length === 0 && <p>未选择图片</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex justify-center items-center z-50 text-white text-lg">
              正在等待检测结果...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
