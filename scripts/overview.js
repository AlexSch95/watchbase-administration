import { showFeedback, logout } from './sharedFunctions.js';
let rowCounts = [];
getRowCounts();

document.getElementById('logout')?.addEventListener('click', logout);

async function getRowCounts () {
    try {
        const token = localStorage.getItem("jwttoken");
        const response = await fetch("http://localhost:3000/api/overview/db-stats", {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const rowCountFromApi = await response.json();
        rowCounts = rowCountFromApi.data;
        showFeedback(rowCountFromApi);
    } catch (error) {
        console.log("Fehler beim Laden", error);;
    } finally {
        renderTableCards();
        combinedCalculation();
        tablesChart();
    }
}

function renderTableCards() {
    const tableInfoContainer = document.getElementById("tableCardContainer")
    tableInfoContainer.innerHTML = "";
    rowCounts.forEach((table) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mt-3"
        col.innerHTML = `<div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Tabellenname: ${table.tableName}</h4>
                                <p class="card-text">Datensätze: ${table.rowCount}</p>
                                <div class="text-end">
                                <button class="btn btn-sm btn-outline-danger text-end d-inline-block load-table-btn overview-btn" data-table="${table.tableName}">Tabelle betrachten</button>
                                </div>
                            </div>
                        </div>`;
        tableInfoContainer.appendChild(col)

    })
        document.addEventListener('click', function(e) {
        if (e.target.classList.contains('load-table-btn')) {
            const tableName = e.target.getAttribute('data-table');
            loadFullTable(tableName);
        }
        });
}


function combinedCalculation() {
    let rowCounter = 0;
    let tableCounter = 0;
    let tableNames = [];
    rowCounts.forEach((table) => {
        rowCounter += table.rowCount;
        tableCounter += 1;
        tableNames.push(table.tableName);
    })
    displayCombined(rowCounter, tableCounter, tableNames);

}

function displayCombined(rowCounter, tableCounter, tableNames) {
    const tableNamesDisplay = document.getElementById("combinedTableNames");
    const tableCountDisplay = document.getElementById("combinedTableCount");
    const rowCountDisplay = document.getElementById("combinedRowCount");
    tableCountDisplay.textContent = tableCounter;
    rowCountDisplay.textContent = rowCounter;
    tableNamesDisplay.textContent = `${tableNames.join(", ")}`;

}

function createCustomLegend(chart) {
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = 0;
    ul.style.margin = 0;

    // Berechne die Summe aller Werte
    const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);

    chart.data.labels.forEach((label, i) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '4px';

        const boxSpan = document.createElement('span');
        boxSpan.style.display = 'inline-block';
        boxSpan.style.width = '20px';
        boxSpan.style.height = '20px';
        boxSpan.style.marginRight = '10px';
        boxSpan.style.backgroundColor = chart.data.datasets[0].backgroundColor[i];

        // Berechne den prozentualen Anteil
        const value = chart.data.datasets[0].data[i];
        const percentage = ((value / total) * 100).toFixed(1); // 1 Nachkommastelle

        const textSpan = document.createElement('span');
        textSpan.textContent = `${label}: ${percentage}%`;

        li.appendChild(boxSpan);
        li.appendChild(textSpan);
        ul.appendChild(li);
    });

    const legendContainer = document.getElementById('chartLegend');
    legendContainer.innerHTML = '';
    legendContainer.appendChild(ul);
}


function tablesChart() {
    const chartContainer = document.getElementById("dbChart");
    const data = {
        labels: rowCounts.map(table => table.tableName),
        datasets: [{
            label: 'Datensätze',
            data: rowCounts.map(table => table.rowCount),
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 205, 86)',
                'rgb(255, 0, 221)',
                'rgb(255, 99, 132)',
                'rgb(50, 205, 50)',
                'rgb(220, 53, 69)'
            ],
            hoverOffset: 0
        }]
    };
    
    const config = {
        type: "pie", 
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [{
            id: 'customLegend',
            afterUpdate: createCustomLegend
        }]
    };
    
    new Chart(chartContainer, config);
};

async function loadFullTable(tableName) {
    try {
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

const modal = new bootstrap.Modal(document.getElementById("modalTableInfo"));

function fillTableModal(tableName, tableData) {
    generateTable(tableData);
    const tableNameDisplay = document.getElementById("modalTableName")
    const rowCountDisplay = document.getElementById("modalRowCount")
    rowCountDisplay.textContent = tableData.length;
    tableNameDisplay.textContent = tableName;
    modal.show();
}
