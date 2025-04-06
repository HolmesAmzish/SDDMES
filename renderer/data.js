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

// Call fetchData on initial load
fetchData();