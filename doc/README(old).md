<center>
  <h1><img src="view/icon/sdd-logo.png" width="10%"> 钢铁表面缺陷检测系统</h1>
  <h3>Steel Surface Defect Detection System</h3>
  <p style="white-space: nowrap;">
    <img src="https://img.shields.io/badge/Python-3.13.2-blue?logo=python">
    <img src="https://img.shields.io/badge/PyTorch-2.6.0-orange?logo=pytorch">
    <img src="https://img.shields.io/badge/PyQt-6.8.1-green?logo=qt">
    <img src="https://img.shields.io/badge/OpenCV-4.11-blue?logo=opencv">
    <img src="https://img.shields.io/badge/CUDA-12.4-teal?logo=nvidia">
  </p>
</center>




## 引言与项目背景

在制造业中，金属部件表面缺陷的检测对保障产品质量和生产安全具有重要意义。传统的依赖人工经验的检测方法效率低下、稳定性差，且难以满足现代自动化生产的需求。近年来，机器视觉技术的发展为金属表面缺陷检测提供了高效解决方案。

本研究基于“分类+分割”的技术思路，融合ResNet和PAN模型，构建了一种针对车辆零部件表面缺陷的检测系统。该系统结合深度学习技术，能够快速、准确地识别和定位裂纹、夹杂、划痕、其他等四类典型缺陷。为提升实用性，系统利用PyQt开发了图形用户界面（GUI），并在配备CUDA的硬件环境下实现实时运行。通过充分的技术调研和特征工程优化，系统在实际测试中取得了89%的检测准确率。

实验结果表明，该系统在检测速度、精度和稳定性方面均表现出显著优势，为制造业中金属部件的质量控制提供了可靠的技术支持，具有广阔的应用前景。

## 系统设计与方法

### 数据与模型

数据集采用 Severstal 钢材缺陷检测竞赛的数据集和评价指标，利用机器学习算法，通过图像分析，自动检测并定位钢板表面的缺陷。

本项目基于PyTorch框架构建双引擎检测系统，采用基于 `ResNeXt50_32x4d` 的卷积神经网络对输入图片进行分类（准确率85.2%），分割模型采用 U-Net 与 FPN 的组合架构，实现像素级缺陷定位（Dice系数0.899）。通过多线程优化实现实时推理，采用MVC架构设计GUI交互系统，集成PyQt6实现可视化看板与历史追溯功能，模型通过Albumentations数据增强和混合精度训练显著提升工业场景泛化能力。

系统专为钢铁制造业设计，可实时检测表面裂纹、夹杂、划痕等4类缺陷，支持产线摄像头实时流/历史影像/单张图片多模态输入。检测精度达89.9%，通过用户传入的钢铁表面图片，传输给机器视觉模型作出分类与缺陷位置分割，用于自动判断和处理钢铁零部件的缺陷。

以下是图片数据输入后经过模型检测并处理得出最终结果的流程图。最终计时，每一张图片在分类和分割所花费的时间相加，整体系统的推理速度在 80~100 ms/img。

```mermaid
graph TD
    A[数据输入] -->|图像/视频| B(预处理模块)
    B --> C{检测引擎}
    C -->|分类| D[分类模型]
    C -->|分割| E[分割模型]
    D --> F[得到缺陷类别]
    E --> G[游程编码]
    G --> H[绘制缺陷分割]
    F --> I[GUI 可视化]
    H --> I
```

| 模型     | 准确率 | Dice系数 | 推理速度 |
| -------- | ------ | -------- | -------- |
| 分类模型 | 85.2%  | -        | 32ms/img |
| 分割模型 | -      | 0.899    | 45ms/img |

## 环境配置

```bash
git clone https://github.com/your-repo/steel-defect-detection.git
conda create -n sdd
conda activate sdd
pip install -r requirements.txt
```

<img src="doc/Sdd-Diagram.drawio.png" width=80%>



### 运行系统

```bash
# 机器视觉检测服务
python3 app.py

# 数据库服务
java -jar database_server/target/SDDAnalyzer-0.0.1-SNAPSHOT.jar

# 前端交互界面
npm run start
```

<center>
    <sub>本项目采用 MIT License，转载请注明项目来源。</sub>
</center>


