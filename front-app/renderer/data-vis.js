let labelChartInstance = null;
let timeChartInstance = null;
let numChartInstance = null;
let recordChartInstance = null;
let totalNumChartInstance = null;

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

    try {
        const response = await fetch('http://localhost:8080/api/data/getRecent?limit=2000', {
            method: 'GET',
            mode: 'cors',
        });
        if (!response.ok) throw new Error('数据获取失败');
        const data = await response.json();
        console.log('后端返回的数据:', data);

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
        });

        updateLabelChart(labelCounts);
        updateTimeChart(timeCounts);
        updateNumChart(numCounts);

    } catch (error) {
        console.error(error);
    }
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

async function fetchStatByDate() {
    try {
      const res = await fetch("http://localhost:8080/api/data/statByDate");
      const statData = await res.json();
  
      const today = new Date();
      const dateList = [];
      const recordData = [];
      const totalNumData = [];
  
      for (let i = 14; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        dateList.push(dateStr);
  
        const match = statData.find(item => item.stat_date === dateStr);
        recordData.push(match ? match.record_count : 0);
        totalNumData.push(match ? match.total_num : 0);
      }
  
      updateRecordChart(dateList, recordData);
      updateTotalNumChart(dateList, totalNumData);
    } catch (e) {
      console.error("fetchStatByDate error:", e);
    }
  }
  
  function updateRecordChart(labels, data) {
    const ctx = document.getElementById('recordChart').getContext('2d');
    if (recordChartInstance) recordChartInstance.destroy();
  
    recordChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'record_count 最近15天',
          data: data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }
  
  function updateTotalNumChart(labels, data) {
    const ctx = document.getElementById('totalNumChart').getContext('2d');
    if (totalNumChartInstance) totalNumChartInstance.destroy();
  
    totalNumChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'total_num 变化趋势',
          data: data,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

document.addEventListener('DOMContentLoaded', fetchData);
document.addEventListener("DOMContentLoaded", fetchStatByDate);
