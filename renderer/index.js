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
            listItem.classList.add('flex', 'items-center', 'space-x-2', 'py-2');
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
    const defectDict = ["夹杂物", "补丁", "划痕", "其他"];

    const cleanedLabelStr = labelStr.slice(1, labelStr.length - 1).trim();
    const boolArray = cleanedLabelStr.split(/\s+/).map(v => v.toLowerCase() === 'true');

    // Map the boolean values to the corresponding defect labels and filter out null values
    const defectLabels = boolArray.map((val, index) => val ? defectDict[index] : null).filter(v => v !== null);

    // Convert the array of defect labels into a human-readable string
    return defectLabels.join(', ');
}



document.getElementById('start-detection').addEventListener('click', async function () {
    const formData = new FormData();

    // Add all selected files to the formData
    imageList.forEach(file => {
        formData.append('images', file);
    });

    try {
        const response = await fetch('http://localhost:5000/api/detect', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        // Clear the image list after receiving the data
        imageList.length = 0;

        // Clear the displayed image list in the UI
        document.getElementById('image-list').innerHTML = '';
        results.forEach(data => {
            if (data.error) {
                console.error(data.error, data.details);
                return;
            }

            // Update the result table
            const resultRow = document.createElement('tr');
            console.log(data.labels);
            resultRow.innerHTML = `
                <td class="px-4 py-3">${data.name}</td>
                <td class="px-4 py-3">${parseLabel(data.labels[0])}</td>
                <td class="px-4 py-3">${data.defect_count}</td>
                <td class="px-4 py-3">${data.processing_time}s</td>
            `;
            resultRow.addEventListener('click', function () {
                document.getElementById('result-image').src = `data:image/jpeg;base64,${data.result_image}`;
            });
            document.getElementById('results-body').appendChild(resultRow);
        });

    } catch (error) {
        console.error('Error during detection:', error);
    }
});