import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  number: number; // 当前页，从0开始
}

interface DefectDetectionResult {
  id: number;
  detectConfidences: string;
  defectNumber: number;
  timeCost: number;
  hasInclusion: boolean;
  hasPatch: boolean;
  hasScratch: boolean;
  hasOther: boolean;
  timestamp?: string;
  resultFigure?: string;
}

export default function DetectionResultPage() {
  const [results, setResults] = useState<DefectDetectionResult[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResult, setSelectedResult] = useState<DefectDetectionResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 过滤条件
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasInclusion, setHasInclusion] = useState(false);
  const [hasPatch, setHasPatch] = useState(false);
  const [hasScratch, setHasScratch] = useState(false);
  const [hasOther, setHasOther] = useState(false);

  const fetchData = async (pageIndex = 0) => {
    try {
      const params: any = { page: pageIndex, size: 15 };
      if (keyword) params.keyword = keyword;
      if (startDate) params.start = startDate + "T00:00:00";
      if (endDate) params.end = endDate + "T23:59:59";
      if (hasInclusion) params.hasInclusion = true;
      if (hasPatch) params.hasPatch = true;
      if (hasScratch) params.hasScratch = true;
      if (hasOther) params.hasOther = true;

      const res = await axios.get<PageResponse<DefectDetectionResult>>(
        "/api/detection/query",
        { params }
      );

      setResults(res.data.content || []);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("加载数据失败:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  const resetFilters = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setHasInclusion(false);
    setHasPatch(false);
    setHasScratch(false);
    setHasOther(false);
    fetchData(0);
  };

  const handleRowDoubleClick = (item: DefectDetectionResult) => {
    setSelectedResult(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResult(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="钢铁缺陷检测数据
        "
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl">

            {/* 搜索条件 */}
            <div className="mb-4 bg-gray-50 border border-gray-200 p-4 space-y-3 rounded-md">
              <div className="flex flex-wrap gap-4 items-center">
                <label>日期范围:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-2 py-1 rounded-md border-gray-200"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-2 py-1 rounded-md border-gray-200"
                />

                <input
                  type="text"
                  placeholder="按名称搜索"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="border px-2 py-1 rounded-md w-40 border-gray-200"
                />

                <button
                  onClick={() => fetchData(0)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                >
                  搜索
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
                >
                  重置
                </button>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasInclusion}
                    onChange={(e) => setHasInclusion(e.target.checked)}
                  />
                  夹杂物
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasPatch}
                    onChange={(e) => setHasPatch(e.target.checked)}
                  />
                  补丁
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasScratch}
                    onChange={(e) => setHasScratch(e.target.checked)}
                  />
                  划痕
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasOther}
                    onChange={(e) => setHasOther(e.target.checked)}
                  />
                  其他
                </label>
              </div>
            </div>

            {/* 表格 */}
            <div className="overflow-auto max-h-[560px] border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-center">ID</th>
                    <th className="py-2 px-4 text-center">置信度</th>
                    <th className="py-2 px-4 text-center">日期</th>
                    <th className="py-2 px-4 text-center">标签</th>
                    <th className="py-2 px-4 text-center">缺陷数量</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results.map((item, index) => (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                        onDoubleClick={() => handleRowDoubleClick(item)}
                      >
                        <td className="py-2 px-4 text-center">{item.id}</td>
                        <td className="py-2 px-4 text-center">
                          {item.detectConfidences}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {item.timestamp
                            ? (() => {
                                const date = new Date(item.timestamp);
                                const year = date.getFullYear();
                                const month = String(
                                  date.getMonth() + 1
                                ).padStart(2, "0");
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const hours = String(date.getHours()).padStart(
                                  2,
                                  "0"
                                );
                                const minutes = String(
                                  date.getMinutes()
                                ).padStart(2, "0");
                                return `${year}-${month}-${day} ${hours}:${minutes}`;
                              })()
                            : "无日期"}
                        </td>

                        <td className="py-2 px-4 text-center">
                          {[
                            item.hasInclusion && "夹杂物",
                            item.hasPatch && "补丁",
                            item.hasScratch && "划痕",
                            item.hasOther && "其他",
                          ]
                            .filter(Boolean)
                            .join("，")}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {item.defectNumber}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => fetchData(page - 1)}
                disabled={page <= 0}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
              >
                上一页
              </button>
              <span>
                第 {page + 1} 页 / 共 {totalPages} 页
              </span>
              <button
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* Result Figure Modal */}
        {showModal && selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-full overflow-auto">
              <h3 className="text-xl font-semibold mb-4">检测结果图 - ID: {selectedResult.id}</h3>
              {selectedResult.resultFigure ? (
                <img
                  src={`data:image/png;base64,${selectedResult.resultFigure}`}
                  alt="检测结果图"
                  className="max-w-full max-h-96 object-contain"
                />
              ) : (
                <p className="text-gray-500">无结果图可用</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
