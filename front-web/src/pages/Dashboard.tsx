import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div>
      <Header
              title="SDDMES 电子看板"
              subtitle="钢铁缺陷检测生产制造系统"
              actions={
                <>
                  <button className="hover:bg-gray-200">btn1</button>
                  <button className="hover:bg-gray-200">btn2</button>
                </>
              }
            />
    </div>
  )
}
