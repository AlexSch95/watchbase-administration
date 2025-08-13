import { showFeedback, logout, checkAuth } from './sharedFunctions.js';

async function initApp() {
    const isAuthed = await checkAuth();
    if (!isAuthed) {
        return;
    }
}

initApp();

let currentDisplayedUser = 0;

document.getElementById('logout')?.addEventListener('click', logout);

document.getElementById('userSearch').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchUserBtn').click()
    }
});

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
        showFeedback({success: false, message: "Verbindungsfehler..."})
    }
})

document.getElementById("getUserWatchlistBtn").addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("jwttoken");
        const response = await fetch(`http://localhost:3000/api/users/watchlist/${currentDisplayedUser}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const result = await response.json();
        showFeedback(result);
        if (result.success) { 
            showFeedback(result);
            generateTable(result.data);
        }
    } catch (error) {
        showFeedback({success: false, message: "Verbindungsfehler..."})
    }
})

function fillUserDisplay(data) {
    const userInfoContainer = document.getElementById("generalUserInfoCard");
    const userNameDisplay = document.getElementById("userUserNameSpan");
    const userIdDisplay = document.getElementById("userIdSpan");
    const userRoleDisplay = document.getElementById("userRoleSpan");
    userNameDisplay.textContent = data.user_name;
    userIdDisplay.textContent = data.user_id;
    userRoleDisplay.textContent = data.administrator;
    userInfoContainer.classList.add("show");
}

function generateTable(tableData) {
    const fullCard = document.getElementById("userWatchlistCard");
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
    fullCard.classList.add("show")

}
