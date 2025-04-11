import matplotlib.pyplot as plt
import numpy as np

# 数据
methods = ['Our Model', 'YOLO-variant', 'LBP+GLCM', 'Gabor Filter', 'CNN+LSTM']
accuracy = [97.9, 95.5, 91.6, 87.1, 86.2]  # TPR%
fps = [30, 20, 30, 59, 24]          # FPS

# 双纵轴条形图
fig, ax1 = plt.subplots(figsize=(10, 6))

# 正确率（左轴）
ax1.bar(methods, accuracy, color='skyblue', alpha=0.7, label='Accuracy (TPR%)')
ax1.set_xlabel('Methods')
ax1.set_ylabel('Accuracy (%)', color='skyblue')
ax1.tick_params(axis='y', labelcolor='skyblue')
ax1.set_ylim(80, 100)

# 速度（右轴）
ax2 = ax1.twinx()
ax2.bar(methods, fps, color='salmon', alpha=0.7, label='Speed (FPS)', width=0.4)
ax2.set_ylabel('Speed (FPS)', color='salmon')
ax2.tick_params(axis='y', labelcolor='salmon')
ax2.set_ylim(0, 150)

# 标题和图例
plt.title('Performance Comparison: Accuracy vs. Speed', fontweight='bold')
fig.legend(loc='upper right', bbox_to_anchor=(0.9, 0.9))

plt.grid(axis='y', linestyle='--', alpha=0.3)
plt.tight_layout()
plt.savefig('accuracy_vs_speed.png', dpi=300)
plt.show()