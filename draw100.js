let names = [];
let drawnNames = [];
const totalMainPrizeWinners = 12;
const totalConsolationPrizeWinners = 64;
const totalWinners = totalMainPrizeWinners + totalConsolationPrizeWinners; // 76 winners in total
const maxNameLength = 25; // Trim names longer than this
const columns = 5;
const rows = 20;
const winnerTable = document.getElementById('winner-table');
const uploadBtn = document.getElementById('upload-btn');
const drawBtn = document.getElementById('draw-btn');
const csvUpload = document.getElementById('csv-upload');
const btnGroup = document.getElementById('button-group');

// Lottie animation setup (assuming animation files are available)
// const confettiAnimation = lottie.loadAnimation({
//     container: document.getElementById('lottie'),
//     renderer: 'svg',
//     loop: true,
//     autoplay: false,
//     path: './confetti.json'
// });

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

    // Draw main prize winners (HU1 to HU12)
    for (let i = 0; i < totalMainPrizeWinners; i++) {
        const randomIndex = Math.floor(Math.random() * names.length);
        let winnerName = names[randomIndex];

        // Trim long names
        if (winnerName.length > maxNameLength) {
            winnerName = winnerName.slice(0, maxNameLength) + '...';
        }

        const prizeCode = `HU${i + 1}`;
        drawnNames.push({ prizeCode, winnerName });
        names.splice(randomIndex, 1); // Remove drawn name
    }

    // Draw consolation prize winners (HH1 to HH64)
    for (let i = 0; i < totalConsolationPrizeWinners; i++) {
        const randomIndex = Math.floor(Math.random() * names.length);
        let winnerName = names[randomIndex];

        // Trim long names
        if (winnerName.length > maxNameLength) {
            winnerName = winnerName.slice(0, maxNameLength) + '...';
        }

        const prizeCode = `HH${i + 1}`;
        drawnNames.push({ prizeCode, winnerName });
        names.splice(randomIndex, 1); // Remove drawn name
    }

    displayWinners();
    // confettiAnimation.play();
    generateAndDownloadCSV(drawnNames);
    btnGroup.style.display = 'none';
});

// Display winners in a 5-column table
function displayWinners() {
    winnerTable.innerHTML = ''; // Clear table

    let row;
    for (let i = 0; i < drawnNames.length; i++) {
        if (i % columns === 0) {
            row = winnerTable.insertRow(); // Insert new row
        }

        const cell = row.insertCell(); // Insert new cell
        const prizeCode = drawnNames[i].prizeCode;
        const winnerName = drawnNames[i].winnerName;
        cell.textContent = `${prizeCode} ${winnerName}`; // Display prize code and winner name
        if (prizeCode.startsWith('HU')) {
            cell.style.backgroundColor = '#EF9C1F'; // Gold color for main prize winners
            cell.style.color = '#000'; // Text color black for contrast
        }
    }
}

// Generate and download CSV of winners with prize codes
function generateAndDownloadCSV(winners) {
    const csvContent = "data:text/csv;charset=utf-8,Prize Code,Winner Name\n"
        + winners.map(winner => `${winner.prizeCode},${winner.winnerName}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.getElementById('download-link');
    downloadLink.setAttribute('href', encodedUri);
    downloadLink.setAttribute('download', 'winners.csv');
    downloadLink.click();
}