import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        title="SDDMES"
        subtitle="钢铁缺陷检测生产制造系统"
        
      />

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* 内容 + Footer */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col min-h-full justify-between p-4">
            {/* 内容区 */}
            <div>
              <h1>Dashboard Content</h1>
              <p>Lorem ipsum dolor sit amet...</p>
              <p>更多内容...</p>

              {/* 模拟很多行内容 */}
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>第 {i + 1} 行内容</p>
              ))}
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
