let currentPage = 1;
const itemsPerPage = 30;
let totalRecords = 0;
let totalPages = 1;

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

function fetchData() {
    const name = document.getElementById("name-search").value;
    const num = document.getElementById("num-filter").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    const params = new URLSearchParams({
        name: name,
        num: num,
        startDate: startDate,
        endDate: endDate,
        limit: itemsPerPage,
        page: currentPage
    });

    fetch(`http://localhost:8080/api/data/search?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            totalRecords = data.total;
            totalPages = Math.ceil(totalRecords / itemsPerPage);
            updateTable(data.data);
            updatePagination();
        })
        .catch(error => console.error("Error fetching data:", error));
}

function updateTable(data) {
    const tableBody = document.getElementById("data-table");
    tableBody.innerHTML = "";

    data.forEach(result => {
        const detectedLabels = parseLabel(result.label);
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50 cursor-pointer"; // 添加悬停效果和指针
        row.setAttribute("data-fig-id", result.figId); // 存储figId
        row.addEventListener("dblclick", () => openImageModal(result.figId)); // 双击事件
        
        row.innerHTML = `
          <td class="py-2 px-4">${result.figId}</td>
          <td class="py-2 px-4">${result.name}</td>
          <td class="py-2 px-4">${formatDate(result.date)}</td>
          <td class="py-2 px-4">${result.time}s</td>
          <td class="py-2 px-4">
            ${detectedLabels.map(({ label, color }) =>
            `<span style="display: inline-flex; align-items: center; gap: 5px;">
              <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
                ${label}
              </span>`
        ).join(', ')}
          </td>
          <td class="py-2 px-4">${result.num}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 打开模态框并加载图片
function openImageModal(figId) {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    
    // 显示加载状态
    modalImage.src = "";
    modalImage.alt = "加载中...";
    modal.classList.remove("hidden");
    
    // 获取图片
    fetch(`http://localhost:8080/api/data/getResFig?id=${figId}`, {
        headers: {
            'Accept': 'image/png' // 告诉服务器我们期望接收PNG图片
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('图片加载失败');
        }
        return response.blob(); // 获取二进制数据
    })
    .then(blob => {
        // 创建图片URL
        const imageUrl = URL.createObjectURL(blob);
        modalImage.src = imageUrl;
        modalImage.alt = `检测结果图片 ${figId}`;
    })
    .catch(error => {
        console.error("获取图片失败:", error);
        modalImage.alt = "图片加载失败";
    });
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    
    // 释放图片URL
    if (modalImage.src) {
        URL.revokeObjectURL(modalImage.src);
    }
    
    modal.classList.add("hidden");
}

function updatePagination() {
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        fetchData();
    }
}

function resetFilters() {
    document.getElementById("num-filter").value = "";
    document.getElementById("name-search").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
    currentPage = 1;
    fetchData();
}

// 获取 DOM 元素
const numFilter = document.getElementById('num-filter');
const tagCheckboxes = document.querySelectorAll('.tag-checkbox');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const specificDate = document.getElementById('specific-date');

// 更新缺陷数量并控制输入框状态
function updateDefectCount() {
    const checkedCount = Array.from(tagCheckboxes).filter(checkbox => checkbox.checked).length;

    if (checkedCount > 0) {
        numFilter.disabled = true;
        numFilter.value = checkedCount;
    } else {
        numFilter.disabled = false;
        numFilter.value = '';
    }
}

// 特定日期变化时清空日期范围
function handleSpecificDateChange() {
    if (specificDate.value) {
        startDate.value = '';
        endDate.value = '';
    }
}

// 日期范围变化时清空特定日期
function handleDateRangeChange() {
    if (startDate.value || endDate.value) {
        specificDate.value = '';
    }
}

// 为每个复选框添加事件监听器
tagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateDefectCount);
});

// 为日期相关输入框添加事件监听器
specificDate.addEventListener('change', handleSpecificDateChange);
startDate.addEventListener('change', handleDateRangeChange);
endDate.addEventListener('change', handleDateRangeChange);

// 重置过滤器时同时重置标签、缺陷数量和日期
function resetFilters() {
    tagCheckboxes.forEach(checkbox => checkbox.checked = false);
    numFilter.disabled = false;
    numFilter.value = '';
    startDate.value = '';
    endDate.value = '';
    specificDate.value = '';
    document.getElementById('name-search').value = '';
    fetchData(); // 假设 fetchData 是已定义的函数
}

// Call fetchData on initial load
fetchData();