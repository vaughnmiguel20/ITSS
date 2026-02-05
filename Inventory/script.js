const form = document.getElementById("inventoryForm");
const tableBody = document.querySelector("#recordTable tbody");

let records = JSON.parse(localStorage.getItem("inventoryRecords")) || [];
let editIndex = null;

// Load records on page load
window.onload = function () {
    renderTable();
};

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const record = {
        itssSupportName: itssSupportName.value,
        datetime: datetime.value,
        location: location.value,
        terminal: terminal.value,
        location: location.value,
        status: status.value,
        replacement: replacement.value,
        staff: staff.value,
        equipment: equipment.value,
        remarks: remarks.value
    };

    if (editIndex === null) {
        records.push(record);
    } else {
        records[editIndex] = record;
        editIndex = null;
    }

    localStorage.setItem("inventoryRecords", JSON.stringify(records));
    renderTable();
    form.reset();
});

function renderTable() {
    tableBody.innerHTML = "";

    records.forEach((r, index) => {
        const row = tableBody.insertRow();

        row.insertCell().textContent = r.itssSupportName;
        row.insertCell().textContent = r.datetime;
        row.insertCell().textContent = r.location;
        row.insertCell().textContent = r.terminal;
        row.insertCell().textContent = r.status;        // ✅ Status
        row.insertCell().textContent = r.replacement;
        row.insertCell().textContent = r.staff;
        row.insertCell().textContent = r.equipment;
        row.insertCell().textContent = r.remarks;

        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button class="action-btn edit-btn" onclick="editRecord(${index})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteRecord(${index})">Delete</button>
        `;
    });
}

function editRecord(index) {
    const r = records[index];

    itssSupportName.value = r.itssSupportName;
    datetime.value = r.datetime;
    location.value = r.location;
    terminal.value = r.terminal;
    status.value = r.status;
    replacement.value = r.replacement;
    staff.value = r.staff;
    equipment.value = r.equipment;
    remarks.value = r.remarks;

    editIndex = index;
}

function deleteRecord(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        records.splice(index, 1);
        localStorage.setItem("inventoryRecords", JSON.stringify(records));
        renderTable();
    }
}

// Download Excel (CSV)
function downloadCSV() {
    let csv = "Date & Time,Terminal,ITSS Support Name,Lab Room / Office,Status,Replacement,Staff,Equipment,Remarks\n";

    records.forEach(r => {
        csv += `${r.datetime},${r.terminal},${r.itssSupportName},${r.location},${r.status},${r.replacement},${r.staff},${r.equipment},${r.remarks}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_records.csv";
    a.click();

    URL.revokeObjectURL(url);
}

window.onload = function () {
    renderTable();

    const now = new Date();
    datetime.value = now.toISOString().slice(0, 16);
};

