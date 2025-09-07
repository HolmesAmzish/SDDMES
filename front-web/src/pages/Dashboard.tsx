import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div>
      <Header
        title="SDDMES 电子看板"
        subtitle="钢铁缺陷检测生产制造系统"
        showBackButton
      />

      <Sidebar />
    </div>
  );
}
