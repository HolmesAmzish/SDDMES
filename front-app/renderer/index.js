const imageList = [];
const resultList = [];

document.getElementById('browse-image').addEventListener('click', function () {
    document.getElementById('image-input').click();
});

document.getElementById('browse-folder').addEventListener('click', function () {
    document.getElementById('folder-input').click();
});

document.getElementById('image-input').addEventListener('change', function (event) {
    const files = event.target.files;
    addFilesToList(files);
});

document.getElementById('folder-input').addEventListener('change', function (event) {
    const files = event.target.files;
    addFilesToList(files);
});

function addFilesToList(files) {
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            imageList.push(file);
            const listItem = document.createElement('div');
            listItem.classList.add('flex', 'items-center', 'space-x-2', 'py-1');
            listItem.innerHTML = `<span>${file.name}</span>`;
            document.getElementById('image-list').appendChild(listItem);
        }
    }
}

/**
 * Parse the label string to human-readable format
 * @param {string} labelStr - The label string written in boolean
 * @returns {string} - The human-readable defect labels
 */
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

document.getElementById('start-detection').addEventListener('click', async function () {
    const formData = new FormData();

    imageList.forEach(file => {
        formData.append('images', file);
    });

    document.getElementById('start-detection').disabled = true;
    document.getElementById('loading-message').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/api/detect', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        imageList.length = 0;
        document.getElementById('image-list').innerHTML = '';

        // Store results and update UI
        results.forEach(data => {
            if (data.error) {
                console.error(data.error, data.details);
                return;
            }

            // Add to resultList
            resultList.push(data);

            const detectedLabels = parseLabel(data.labels);
            const resultRow = document.createElement('tr');
            resultRow.innerHTML = `
                <td class="px-4 py-3">${data.name}</td>
                <td class="py-2 px-4">
                    ${detectedLabels.map(({ label, color }) =>
                `<span style="display: inline-flex; align-items: center; gap: 5px;">
                    <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
                    ${label}
                </span>`
                    ).join(', ')}
                </td>
                <td class="px-4 py-3">${data.defect_count}</td>
                <td class="px-4 py-3">${data.processing_time}s</td>
            `;

            // console.log('检测结果:', data);

            resultRow.addEventListener('click', function () {
                document.getElementById('result-image').src = `data:image/jpeg;base64,${data.result_image}`;
                document.getElementById('result-info').innerHTML = `
                文件名: ${data.name}, 缺陷数: ${data.defect_count}, 用时: ${data.processing_time}s, 标签: ${detectedLabels.map(({ label, color }) =>
                    `<span style="display: inline-flex; align-items: center; gap: 5px;">
                        <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
                        ${label}
                    </span>`
                ).join(', ')}
            `;
            });
            document.getElementById('results-body').appendChild(resultRow);
        });

    } catch (error) {
        console.error('Error during detection:', error);
    } finally {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('start-detection').disabled = false;
    }

    alert('检测完成！');
});

// Add Save Results functionality
document.getElementById('save-results').addEventListener('click', async function () {
    if (resultList.length === 0) {
        alert('没有可保存的结果！');
        return;
    }

    // Prepare data for backend
    const resultsToSave = resultList.map(result => ({
        name: result.name,
        resFig: result.result_image, // base64 encoded image
        time: result.processing_time,
        label: result.labels,
        num: result.defect_count.toString(),
        dice: result.dice || "0" // Use "0" as default if dice is not present
    }));

    // console.log('Results to save:', resultsToSave);

    try {
        document.getElementById('save-results').disabled = true;
        document.getElementById('loading-message').style.display = 'block';

        const response = await fetch('http://localhost:8080/api/data/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultsToSave),
        });

        if (!response.ok) {
            throw new Error('Failed to save results');
        }

        alert('结果保存成功！');
        // Optionally clear resultList after successful save
        // resultList.length = 0;
        // document.getElementById('results-body').innerHTML = '';

    } catch (error) {
        console.error('Error saving results:', error);
        alert('保存结果失败！');
    } finally {
        document.getElementById('save-results').disabled = false;
        document.getElementById('loading-message').style.display = 'none';
    }
});