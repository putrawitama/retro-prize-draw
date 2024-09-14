let surabayaParticipants = [];
let branch1Participants = [];
let branch2Participants = [];
let serviceOfficerParticipants = [];
let outsourceParticipants = [];
let drawnNames = []; // Untuk menyimpan nama yang sudah di-draw

const drawBtn = document.getElementById("draw-btn");
const winnerTable = document.getElementById("winner-table");
const uploadBtn = document.getElementById('upload-btn');
const csvParticipantsUpload = document.getElementById("csv-upload");
const btnGroup = document.getElementById('button-group');

// Click to upload CSV
uploadBtn.addEventListener('click', () => {
    csvParticipantsUpload.click();
});

csvParticipantsUpload.addEventListener("change", (event) => handleFileUpload(event));

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvText = e.target.result;
            const rows = csvText.split("\n");
            rows.forEach((row) => {
                const [name, location] = row.trim().split(";").map((item) => item.trim());
                if (location === "POT 1") {
                    surabayaParticipants.push(name);
                } else if (location === "POT 2") {
                    branch1Participants.push(name);
                } else if (location === "POT 3") {
                    branch2Participants.push(name);
                } else if (location === "POT 4") {
                    serviceOfficerParticipants.push(name);
                } else if (location === "POT 5") {
                    outsourceParticipants.push(name);
                }
            });
            if (surabayaParticipants.length > 0) {
                drawBtn.disabled = false;
            }
            console.log("pot 1: ", surabayaParticipants.length);
            console.log("pot 2: ", branch1Participants.length);
            console.log("pot 3: ", branch2Participants.length);
            console.log("pot 4: ", serviceOfficerParticipants.length);
            console.log("pot 5: ", outsourceParticipants.length);
        };
        reader.readAsText(file);
    }
}

drawBtn.addEventListener("click", () => {
    if (surabayaParticipants.length > 0) {
        startDrawing();
    } else {
        alert("Please upload the CSV file with participants.");
    }
});

function startDrawing() {
    drawnNames = []; // Reset pemenang

    // Pilih 12 pemenang hadiah utama dari Cabang Surabaya
    const mainPrizeWinners = getWinners(surabayaParticipants, 12, "HU");

    // Pilih 64 pemenang hadiah hiburan:
    // - Tambahkan peserta dari lokasi lain yang hanya berpotensi menang hiburan
    const consolationPrizeWinners = getWinners(surabayaParticipants, 60, "HH")
        .concat(getWinners(branch1Participants, 1, "HH"))
        .concat(getWinners(branch2Participants, 1, "HH"))
        .concat(getWinners(serviceOfficerParticipants, 1, "HH"))
        .concat(getWinners(outsourceParticipants, 1, "HH"));

    // Gabungkan pemenang hadiah utama dan hiburan
    const winners = [...mainPrizeWinners, ...consolationPrizeWinners];

    // Tampilkan pemenang
    displayWinners(winners);
}

function getWinners(array, count, prizePrefix) {
    const winners = [];
    for (let i = 0; i < count && array.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const winner = array.splice(randomIndex, 1)[0]; // Pilih nama acak dari array
        winners.push({ name: winner, prize: `${prizePrefix}${i + 1}` }); // Tambahkan kode hadiah
    }
    return winners;
}

function displayWinners(winners) {
    winnerTable.innerHTML = ''; // Kosongkan tabel

    let row;
    const columns = 5; // 5 kolom
    for (let i = 0; i < winners.length; i++) {
        if (i % columns === 0) {
            row = winnerTable.insertRow(); // Buat baris baru
        }

        const cell = row.insertCell(); // Buat sel baru
        cell.textContent = `${winners[i].prize} ${winners[i].name}`;

        // Beri warna berbeda untuk hadiah utama
        if (winners[i].prize.startsWith('HU')) {
            cell.style.backgroundColor = '#EF9C1F'; // Gold color for main prize winners
            cell.style.color = '#000';
        }
    }

    // Setelah menampilkan pemenang, download CSV
    downloadWinnersCSV(winners);
    btnGroup.style.display = 'none';
}

function downloadWinnersCSV(winners) {
    let csvContent = "data:text/csv;charset=utf-8,PrizeCode,Winner\n";
    winners.forEach(winner => {
        csvContent += `${winner.prize},${winner.name}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "winners.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
}
