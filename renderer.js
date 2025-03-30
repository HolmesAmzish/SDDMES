document.addEventListener('DOMContentLoaded', () => {
    const browseImageBtn = document.getElementById('browse-image');
    const imagePathInput = document.getElementById('image-path');
    const startDetectionBtn = document.getElementById('start-detection');
    const resultImage = document.getElementById('result-image');
    const resultsBody = document.getElementById('results-body');

    // 创建隐藏的文件输入元素，支持多选
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true; // 允许选择多张图片
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 维护一个图片队列
    let imageQueue = [];

    // 浏览按钮点击事件
    browseImageBtn.addEventListener('click', () => {
        fileInput.value = ''; // 清空之前的选择
        fileInput.click(); // 触发文件选择对话框
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            // 更新图片队列
            imageQueue = [...imageQueue, ...files];
            // 显示队列中的图片名称（仅显示第一张作为预览）
            imagePathInput.value = files.map(file => file.name).join(', ');
            // 预览第一张图片
            const reader = new FileReader();
            reader.onload = (event) => {
                resultImage.src = event.target.result;
            };
            reader.readAsDataURL(files[0]);
        }
    });

    // 开始检测事件
    startDetectionBtn.addEventListener('click', async () => {
        if (imageQueue.length === 0) {
            alert('请先选择至少一张图片！');
            return;
        }

        startDetectionBtn.disabled = true;
        startDetectionBtn.textContent = '检测中...';

        try {
            // 依次处理队列中的每张图片
            for (const file of imageQueue) {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('http://localhost:5000/api/detect', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`检测 ${file.name} 失败`);
                }

                const result = await response.json();

                // 更新结果图片
                resultImage.src = `data:image/jpeg;base64,${result.result_image}`;

                // 添加到结果表格
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${result.name}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${result.labels.join(', ')}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${result.defect_count}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${result.processing_time}s</td>
                `;
                resultsBody.insertBefore(row, resultsBody.firstChild);

                // 模拟等待效果（可选）
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 检测完成后清空队列
            imageQueue = [];
            imagePathInput.value = '';

        } catch (error) {
            console.error('Error:', error);
            alert('检测过程中发生错误：' + error.message);
        } finally {
            startDetectionBtn.disabled = false;
            startDetectionBtn.textContent = '开始检测';
        }
    });

    // 保存结果按钮（占位符）
    document.getElementById('save-results').addEventListener('click', () => {
        alert('保存功能尚未实现');
    });

    // 查看历史按钮（占位符）
    document.getElementById('view-history').addEventListener('click', () => {
        alert('查看历史功能尚未实现');
    });
});