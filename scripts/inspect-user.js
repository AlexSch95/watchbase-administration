import { showFeedback, logout, checkAuth } from './sharedFunctions.js';

async function initApp() {
    const isAuthed = await checkAuth();
    if (!isAuthed) {
        return;
    }
}

initApp();

document.getElementById('logout')?.addEventListener('click', logout);

let currentDisplayedUser = 0;

document.getElementById("searchUserBtn").addEventListener("click", async () => {
    try {
        const searchedUserName = document.getElementById("userSearch").value;
        const token = localStorage.getItem("jwttoken");
        const response = await fetch(`http://localhost:3000/api/users/search/${searchedUserName}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const result = await response.json()
        showFeedback(result);
        if (result.success) {
            currentDisplayedUser = result.data.user_id;
            fillUserDisplay(result.data)
        }
    } catch (error) {
        
    }
})

function fillUserDisplay(data) {
    const userNameDisplay = document.getElementById("userUserNameSpan");
    const userIdDisplay = document.getElementById("userIdSpan");
    const userRoleDisplay = document.getElementById("userRoleSpan");
    userNameDisplay.textContent = data.user_name;
    userIdDisplay.textContent = data.user_id;
    userRoleDisplay.textContent = data.administrator;
}

async function getUserWatchlist() {
    //watchlist vom user holen
}

async function editUser() {}

async function loadFullTable(tableName) {
    try {
        console.log(tableName);
        const token = localStorage.getItem("jwttoken");
        const response = await fetch(`http://localhost:3000/api/overview/table/${tableName}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const result = await response.json();
        showFeedback(result);
        fillTableModal(tableName, result.data)
    } catch (error) {
        console.log("Fehler beim Laden der Tabelle", error);;
    }
}

function generateTable(tableData) {
    const tableContainer = document.getElementById("tableContent");
    tableContainer.innerHTML = "";
    const tableColumnNames = Object.keys(tableData[0]);

    const tableHeader = document.createElement("thead");
    const tableHeaderRow = document.createElement("tr");

    tableColumnNames.forEach(columnName => {
        const tableHeaderElement = document.createElement("th");
        tableHeaderElement.textContent = columnName;
        tableHeaderRow.appendChild(tableHeaderElement);
    });

    tableHeader.appendChild(tableHeaderRow);
    tableContainer.appendChild(tableHeader);

    const tableBody = tableContainer.createTBody();

    tableData.forEach(item => {
        const row = document.createElement("tr");
        Object.values(item).forEach(value => {
            const field = document.createElement("td");
            field.textContent = value;
            row.appendChild(field);
        })
        tableBody.appendChild(row);
    })


}

const modal = new bootstrap.Modal(document.getElementById("modalUserMovies"));

function fillTableModal(tableName, tableData) {
    generateTable(tableData);
    const tableNameDisplay = document.getElementById("modalTableName")
    const rowCountDisplay = document.getElementById("modalRowCount")
    rowCountDisplay.textContent = tableData.length;
    tableNameDisplay.textContent = tableName;
    modal.show();
}
