let labelChartInstance = null;
let timeChartInstance = null;
let numChartInstance = null;

function parseTimeToSeconds(timeStr) {
    return Number(timeStr);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function parseLabel(labelStr) {
    try {
        const defectDict = ["夹杂物", "补丁", "划痕", "其他"];
        const colors = [
            'rgba(255, 99, 132, 0.6)',  // 夹杂物
            'rgba(54, 162, 235, 0.6)',  // 补丁
            'rgba(255, 206, 86, 0.6)',  // 划痕
            'rgba(75, 192, 192, 0.6)'   // 其他
        ];
        
        const boolArray = labelStr.replace(/\[|\]/g, '').trim().split(/\s+/).map(v => v.toLowerCase() === 'true');
        const labels = boolArray.map((val, index) => val ? defectDict[index] : null).filter(v => v !== null);

        // 将每个标签和其对应的颜色一起返回
        return labels.map(label => {
            const index = defectDict.indexOf(label);
            return { label, color: colors[index] };
        });
    } catch (e) {
        return [{ label: '解析错误', color: 'rgba(255, 0, 0, 0.6)' }];
    }
}

async function fetchData() {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-2">加载中...</td></tr>';

    try {
        // Fetch 100 records of data from the backend
        const response = await fetch('http://localhost:8080/api/data/getAll?limit=100', {
            method: 'GET',
            mode: 'cors',
        });
        if (!response.ok) throw new Error('数据获取失败');
        const data = await response.json();
        console.log('后端返回的数据:', data);
        tableBody.innerHTML = '';

        let labelCounts = { "夹杂物": 0, "补丁": 0, "划痕": 0, "其他": 0 };
        let timeCounts = { "0.05-0.07": 0, "0.07-0.09": 0, "0.09-0.11": 0, "0.11-0.13": 0, "0.13-0.15": 0 };
        let numCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

        data.forEach(item => {
            const detectedLabels = parseLabel(item.label);
            detectedLabels.forEach(({ label, color }) => {
                if (labelCounts.hasOwnProperty(label)) {
                    labelCounts[label]++;
                }
            });

            const num = parseInt(item.num);
            if (numCounts.hasOwnProperty(num)) {
                numCounts[num]++;
            }

            const timeInSeconds = parseTimeToSeconds(item.time);
            let timeRange = '';
            if (timeInSeconds >= 0.05 && timeInSeconds <= 0.15) {
                if (timeInSeconds <= 0.07) timeRange = "0.05-0.07";
                else if (timeInSeconds <= 0.09) timeRange = "0.07-0.09";
                else if (timeInSeconds <= 0.11) timeRange = "0.09-0.11";
                else if (timeInSeconds <= 0.13) timeRange = "0.11-0.13";
                else if (timeInSeconds <= 0.15) timeRange = "0.13-0.15";
                timeCounts[timeRange]++;
            } else {
                timeRange = '超出范围';
            }

            let row = `<tr data-image-path="../data/sample_folder/0a9cbb927.jpg">
                <td class="py-2 px-4">${item.figId}</td>
                <td class="py-2 px-4">${item.name}</td>
                <td class="py-2 px-4">${formatDate(item.date)}</td>
                <td class="py-2 px-4">${item.time}</td>
                <td class="py-2 px-4">
                    ${detectedLabels.map(({ label, color }) => 
                        `<span style="display: inline-flex; align-items: center; gap: 5px;">
                            <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
                            ${label}
                        </span>`
                    ).join(', ')}
                </td>
                <td class="py-2 px-4">${item.dice}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        updateLabelChart(labelCounts);
        updateTimeChart(timeCounts);
        updateNumChart(numCounts);

        // Add event listener for double-clicking on a row
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('dblclick', function() {
                const imagePath = row.getAttribute('data-image-path');
                displayImage(imagePath);
            });
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-red-500 py-2">数据加载失败</td></tr>';
    }
}

function displayImage(imagePath) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = imagePath;  // 设置图片路径
    modal.classList.remove('hidden');  // 显示模态框
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');  // 关闭模态框
}

function updateLabelChart(labelCounts) {
    const labels = Object.keys(labelCounts);
    const data = Object.values(labelCounts);
    const ctx = document.getElementById('labelChart').getContext('2d');

    if (labelChartInstance) {
        labelChartInstance.destroy();
    }

    labelChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '缺陷标签分布',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            chartArea: {
                width: '50%',
                height: '50%'
            }
        }
    });
}

function updateTimeChart(timeCounts) {
    const labels = Object.keys(timeCounts);
    const data = Object.values(timeCounts);
    const ctx = document.getElementById('timeChart').getContext('2d');

    if (timeChartInstance) {
        timeChartInstance.destroy();
    }

    timeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '检测时间分布',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateNumChart(numCounts) {
    const labels = Object.keys(numCounts).map(key => `${key}个缺陷`);
    const data = Object.values(numCounts);
    const ctx = document.getElementById('numChart').getContext('2d');

    if (numChartInstance) {
        numChartInstance.destroy();
    }

    numChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '缺陷数目分布',
                data: data,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchData);