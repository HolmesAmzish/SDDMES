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


    // 保存结果按钮（占位符）
    document.getElementById('save-results').addEventListener('click', () => {
        alert('保存功能尚未实现');
    });

    // 查看历史按钮（占位符）
    document.getElementById('view-history').addEventListener('click', () => {
        alert('查看历史功能尚未实现');
    });
});