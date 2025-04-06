const analyzeButton = document.getElementById('analyzeButton');
const stopButton = document.getElementById('stopButton');
const promptInput = document.getElementById('promptInput');
const aiContent = document.getElementById('aiContent');
const typingIndicator = document.getElementById('typingIndicator');
const statusDiv = document.getElementById('status');
let quickLabelChart, quickTimeChart;
let abortController = null;
let isStreaming = false;

// 初始化Marked.js
marked.setOptions({
    breaks: true,
    gfm: true
});

async function analyzeData() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showStatus('请输入分析请求', 'error');
        return;
    }

    // 初始化状态
    aiContent.innerHTML = '';
    typingIndicator.classList.remove('hidden');
    showStatus('AI 正在分析中...', 'processing');
    analyzeButton.disabled = true;
    stopButton.classList.remove('hidden');
    isStreaming = true;
    abortController = new AbortController();

    try {
        // 获取当前数据上下文
        const context = await getDataContext();

        // 构建完整的提示词
        const fullPrompt = buildFullPrompt(prompt, context);

        // 调用AI API
        await callAIStreaming(fullPrompt);

        showStatus('分析完成！', 'success');
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('AI分析错误:', error);
            showStatus(`错误: ${error.message}`, 'error');
            aiContent.innerHTML = marked.parse('**分析过程中发生错误，请稍后重试。**');
        } else {
            showStatus('已停止生成', 'warning');
        }
    } finally {
        typingIndicator.classList.add('hidden');
        analyzeButton.disabled = false;
        stopButton.classList.add('hidden');
        isStreaming = false;
        abortController = null;
    }
}

function stopAnalysis() {
    if (isStreaming && abortController) {
        abortController.abort();
    }
}

async function callAIStreaming(prompt) {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getApiKey()
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            stream: true
        }),
        signal: abortController?.signal
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI 请求失败: ${response.status} - ${errorText}`);
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (isStreaming) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content || '';

                    if (content) {
                        result += content;
                        aiContent.innerHTML = marked.parse(result);
                        // 自动滚动到底部
                        aiContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                } catch (e) {
                    console.error('解析错误:', e);
                }
            }
        }
    }
}

function buildFullPrompt(userPrompt, context) {
    // 基础系统提示
    let prompt = `你是一个钢材缺陷分析专家，请根据用户请求分析钢材缺陷数据。\n\n`;

    // 添加数据上下文
    if (context) {
        prompt += `当前数据概况:\n`;
        prompt += `- 总检测样本数: ${context.totalSamples}\n`;
        prompt += `- 主要缺陷类型: ${context.mainDefects.join(', ')}\n`;
        prompt += `- 平均检测时间: ${context.avgDetectionTime}秒\n\n`;
    }

    // 添加用户请求
    prompt += `用户请求:\n${userPrompt}\n\n`;
    prompt += `请用专业但易懂的语言回答，使用Markdown格式，包含以下部分:\n`;
    prompt += `1. 主要发现\n2. 趋势分析\n3. 改进建议`;

    return prompt;
}

function getApiKey() {
    return localStorage.getItem('ai_api_key') || 'sk-c6c11ae0a25a4e1ea64ff97e98d4057a';
}

function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = 'mt-4 text-sm ' +
        (type === 'error' ? 'text-red-500' :
            type === 'success' ? 'text-green-500' :
                type === 'warning' ? 'text-yellow-500' :
                    'text-gray-500');
}

// 获取当前数据上下文（示例）
async function getDataContext() {
    try {
        const response = await fetch('http://localhost:8080/api/data/getRecent');
        if (!response.ok) return null;
        const data = await response.json();

        // 转换数据格式
        return {
            totalSamples: data.length,
            mainDefects: Object.keys(data.defectDistribution),
            avgDetectionTime: data.avgProcessingTime
        };
    } catch {
        return null;
    }
}

async function fetchQuickData() {
    try {
        const response = await fetch('http://localhost:8080/api/data/getRecent');
        if (!response.ok) throw new Error('获取数据失败');
        const data = await response.json();

        const labels = Object.keys(data.defectDistribution || {});
        const counts = Object.values(data.defectDistribution || {});

        const timeLabels = data.recentStats.map(item => item.time);
        const timeCounts = data.recentStats.map(item => item.count);

        if (quickLabelChart) quickLabelChart.destroy();
        if (quickTimeChart) quickTimeChart.destroy();

        quickLabelChart = new Chart(document.getElementById('quickLabelChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '缺陷类型分布',
                    data: counts,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });

        quickTimeChart = new Chart(document.getElementById('quickTimeChart'), {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: '每小时缺陷数',
                    data: timeCounts,
                    borderColor: 'rgba(234, 88, 12, 1)',
                    backgroundColor: 'rgba(234, 88, 12, 0.3)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    } catch (error) {
        showStatus('数据概览加载失败：' + error.message, 'error');
    }
}


function updateQuickLabelChart(labelCounts) {
    const ctx = document.getElementById('quickLabelChart').getContext('2d');
    if (quickLabelChart) quickLabelChart.destroy();

    quickLabelChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(labelCounts),
            datasets: [{
                data: Object.values(labelCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateQuickTimeChart(timeCounts) {
    const ctx = document.getElementById('quickTimeChart').getContext('2d');
    if (quickTimeChart) quickTimeChart.destroy();

    quickTimeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(timeCounts),
            datasets: [{
                label: '检测时间分布',
                data: Object.values(timeCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchQuickData();

    // 示例提示词
    promptInput.value = "请分析最近一周的缺陷数据，指出主要问题类型和变化趋势，并提出改进建议。";

    // 初始化Marked.js渲染器
    const renderer = new marked.Renderer();
    renderer.code = (code, language) => {
        return `<pre><code class="language-${language}">${code}</code></pre>`;
    };
    marked.setOptions({ renderer });
});