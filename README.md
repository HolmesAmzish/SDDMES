# 项目结构

根目录
- controller
  - main_controller.py 主窗口控制器
  - history_controller.py 历史查看窗口
  - figure_process_worker.py 图片处理进程
  - video_process_worker.py 视频处理进程
- data 训练数据
- models 存放模型
- result 存放结果
- utilis
  - database.py 数据库程序
  - dataset.py 图片读取
  - eda.py 结果分割绘制
  - make_class.py 分类
  - make_seg.py 分割
  - pred.py 预测
- view
  - icon
  - main.ui
  - main_ui.py 主窗口UI类
  - history.ui
  - history_ui.py
- main.py 程序主入口
- README.md
- generate_ui.ps1 编译UI脚本
    