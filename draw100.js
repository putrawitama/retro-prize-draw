let names = [];
let drawnNames = [];
const maxWinners = 80;
const maxNameLength = 20; // Trim names longer than this
const columns = 7;
const rows = 16;
const winnerTable = document.getElementById('winner-table');
const uploadBtn = document.getElementById('upload-btn');
const drawBtn = document.getElementById('draw-btn');
const csvUpload = document.getElementById('csv-upload');
const btnGrop = document.getElementById('button-group');
// Click to upload CSV
uploadBtn.addEventListener('click', () => {
    csvUpload.click();
});

// Handle CSV file upload
csvUpload.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvText = e.target.result;
            const rows = csvText.split("\n");
            names = rows.map(row => row.trim()).filter(name => name !== "");
            if (names.length > 0) {
                drawBtn.disabled = false; // Enable draw button
            }
        };
        reader.readAsText(file);
    }
}

// Draw winners and display them in the table
drawBtn.addEventListener('click', () => {
    drawnNames = []; // Clear previous winners

    for (let i = 0; i < maxWinners; i++) {
        const randomIndex = Math.floor(Math.random() * names.length);
        let winnerName = names[randomIndex];

        // Trim long names
        if (winnerName.length > maxNameLength) {
            winnerName = winnerName.slice(0, maxNameLength) + '...';
        }

        drawnNames.push(winnerName);
        names.splice(randomIndex, 1); // Remove drawn name
    }

    displayWinners();
    generateAndDownloadCSV(drawnNames);
});

// Display winners in a 5-column table
function displayWinners() {
    btnGrop.style.display = 'none';
    winnerTable.innerHTML = ''; // Clear table

    let row;
    for (let i = 0; i < drawnNames.length; i++) {
        if (i % columns === 0) {
            row = winnerTable.insertRow(); // Insert new row
        }

        const cell = row.insertCell(); // Insert new cell
        cell.textContent = drawnNames[i]; // Set winner name
    }
}

// Generate and download CSV of winners
function generateAndDownloadCSV(winners) {
    const csvContent = "data:text/csv;charset=utf-8,"
        + winners.map(winner => winner).join("\n");

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.getElementById('download-link');
    downloadLink.setAttribute('href', encodedUri);
    downloadLink.setAttribute('download', 'winners.csv');
    downloadLink.click();
}
