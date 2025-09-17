import Footer from "../components/Footer";
import Header from "../components/Header";
import bgSteel from "../assets/ferrosilicon-for-steel.png";

export default function About() {
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航 */}
      <Header
        title="关于 SDDMES"
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />

      {/* 主体 */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Hero 区域 */}
          <section
            className="relative h-72 flex items-center justify-center text-center text-white"
            style={{
              backgroundImage: `url(${bgSteel})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* 蒙版 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            {/* 内容 */}
            <div className="relative z-10 max-w-3xl px-4">
              <h1 className="text-4xl font-bold mb-4">零部件缺陷检测与生产管理智能一体化平台</h1>
              <p className="text-lg leading-relaxed text-gray-200">
                结合机器学习与图像分割的缺陷检测，驱动生产制造系统的智能化与高效化
              </p>
            </div>
          </section>

          {/* 内容区 */}
          <section className="flex-1 py-10 px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                系统核心功能
              </h2>

              {/* 卡片网格 */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* 卡片 1 */}
                <a href="/notification">
                <div className="bg-white rounded-3xl shadow-lg p-6 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
                  <h3 className="text-xl font-semibold mb-3">缺陷检测</h3>
                  <p className="text-gray-600 leading-relaxed">
                    利用深度学习与图像分割模型，实现钢材表面缺陷自动检测与分类，
                    提高检测精度，降低人工成本。
                  </p>
                </div></a>

                {/* 卡片 2 */}
                <div className="bg-white rounded-3xl shadow-lg p-6 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
                  <h3 className="text-xl font-semibold mb-3">智能制造</h3>
                  <p className="text-gray-600 leading-relaxed">
                    支持生产数据实时采集与分析，结合机器学习算法优化工艺流程，
                    助力工厂实现高效智能化生产。
                  </p>
                </div>

                {/* 卡片 3 */}
                <div className="bg-white rounded-3xl shadow-lg p-6 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
                  <h3 className="text-xl font-semibold mb-3">MES 管理</h3>
                  <p className="text-gray-600 leading-relaxed">
                    集成 MES 功能，提供生产计划、工序跟踪、质量管理等模块，
                    打造完整数字化钢铁制造方案。
                  </p>
                </div>
              </div>

              {/* GitHub 项目指示 */}
              <div className="mt-12 text-center">
                <p className="text-gray-700 mb-4">项目源码：</p>
                <a
                  href="https://github.com/HolmesAmzish/SDDMES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.752-1.333-1.752-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.934 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405 11.5 11.5 0 0 1 3 .405c2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.63-5.475 5.924.43.37.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.373-12-12-12z" />
                  </svg>
                  SDDMES GitHub
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
