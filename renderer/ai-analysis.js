const analyzeButton = document.getElementById('analyzeButton');
const stopButton = document.getElementById('stopButton');
const promptInput = document.getElementById('promptInput');
const aiContent = document.getElementById('aiContent');
const typingIndicator = document.getElementById('typingIndicator');
const statusDiv = document.getElementById('status');
let abortController = null;
let isStreaming = false;
let aiPrompt = '';

marked.setOptions({
    breaks: true,
    gfm: true
});

// 显示状态
function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = 'mt-4 text-sm ' +
        (type === 'error' ? 'text-red-500' :
            type === 'success' ? 'text-green-500' :
                type === 'warning' ? 'text-yellow-500' :
                    'text-gray-500');
}

// 解析标签
function parseLabel(labelStr) {
    const defectDict = ["夹杂物", "补丁", "划痕", "其他"];
    const boolArray = labelStr.replace(/\[|\]/g, '').trim().split(/\s+/).map(v => v.toLowerCase() === 'true');
    const labels = boolArray.map((val, index) => val ? defectDict[index] : null).filter(v => v !== null);
    return labels;
}

// 从后端获取最近的数据
async function fetchQuickData() {
    try {
        const response = await fetch('http://localhost:8080/api/data/getRecent?limit=200');
        if (!response.ok) throw new Error('获取数据失败');
        const data = await response.json();

        console.log('获取到的数据:', data);

        // 处理并显示数据
        processAndDisplayData(data);

    } catch (error) {
        console.error('获取数据错误:', error);
        showStatus('获取数据失败，请稍后重试。', 'error');
    }
}

// 读取提示词文件内容
const AITextPrompt = '你是一个钢铁缺陷分析专家，请根据以下数据对钢铁缺陷检测结果进行深入分析，并提供以下内容：1. **主要发现**：概述检测到的主要缺陷类型，以及它们在样本中的出现频率。指出是否存在异常的缺陷模式或趋势。2. **缺陷分布趋势**：分析各类缺陷在不同时间段或不同检测样本中的分布情况，找出趋势或周期性变化。如果有多个缺陷类型，比较它们之间的相对频率。3. **缺陷类型对比**：将各类缺陷进行对比，指出其中哪些缺陷类型最为常见，哪些可能导致生产问题或影响钢材的质量。4. **检测时间分析**：分析每个缺陷的检测时间，查找检测速度或时长是否存在趋势，例如检测时间较长的缺陷类型。5. **相关建议**：基于缺陷分布趋势和类型对生产过程提出改进建议，例如优化检测流程，改进质量控制等。6. **质量控制建议**：针对发现的主要缺陷类型，提出有效的质量控制和改进措施。请使用简洁易懂的语言，确保分析结果能够为生产线管理人员或质量控制人员提供实用的建议。使用Markdown格式呈现结果，包含标题、子标题、列表等。-> % curl http://localhost:8080/api/data/getRecent\?limit\=100[{"figId":0,"name":null,"resFig":null,"date":null,"time":"1.90","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"1.91","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True  True False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"2.17","label":"[ True  True False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True  True False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"1.63","label":"[ True  True False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"2.17","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True  True False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False False False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.10","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"2.27","label":"[ True  True False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.09","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"2","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False False False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True  True  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"2","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True  True  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True  True  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True  True]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True  True]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[ True False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True  True]","num":"1","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"0","dice":null},{"figId":0,"name":null,"resFig":null,"date":null,"time":"0.08","label":"[False False  True False]","num":"1","dice":null}]%  其中label四个标签分别代表了加杂物，补丁，划痕和其他，顺序一致，num代表每个记录的缺陷数量，time代表检测使用时间的秒数。请分析这一批钢铁缺陷检测数据.';


// 处理并显示数据
function processAndDisplayData(data) {
    const defectLabels = data.map(item => parseLabel(item.label).join(','));  // 将标签转换为字符串
    const defectTimes = data.map(item => item.time);  // 获取时间数据

    // 生成AI的请求内容
    const aiPromptWithData = generateAIPrompt(defectLabels, defectTimes);
    analyzeData(aiPromptWithData);
}

// 生成AI分析提示词
function generateAIPrompt(defectLabels, defectTimes) {
    const defectSummary = defectLabels.join(', ');
    const timeSummary = defectTimes.join(', ');

    return `${aiPrompt}\n\n根据以下数据分析钢材缺陷趋势和问题：

缺陷类型：\n${defectSummary}
检测时间：\n${timeSummary}

请分析缺陷的趋势并提供改进建议。`;
}

// AI分析数据
async function analyzeData(aiPrompt) {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showStatus('请输入分析请求', 'error');
        return;
    }

    aiContent.innerHTML = '';
    typingIndicator.classList.remove('hidden');
    showStatus('AI 正在分析中...', 'processing');
    analyzeButton.disabled = true;
    stopButton.classList.remove('hidden');
    isStreaming = true;
    abortController = new AbortController();

    try {
        const fullPrompt = buildFullPrompt(prompt, aiPrompt);
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

// 停止分析
function stopAnalysis() {
    if (isStreaming && abortController) {
        abortController.abort();
    }
}

// 与AI通信，获取分析结果
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
                        aiContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                } catch (e) {
                    console.error('解析错误:', e);
                }
            }
        }
    }
}

// 构建完整的提示词
function buildFullPrompt(userPrompt, aiDataPrompt) {
    return `${AITextPrompt}\n\n用户请求:\n${userPrompt}`;
}

// 获取API密钥
function getApiKey() {
    return localStorage.getItem('ai_api_key') || 'sk-c6c11ae0a25a4e1ea64ff97e98d4057a';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchQuickData();
});
