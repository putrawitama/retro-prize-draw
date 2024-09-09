let names = [];
let drawnNames = [];
let isDrawing = false;
const colors = ['#169497', '#93D2BD', '#AD2424', '#CB6A28', '#EF9C1F', '#0B141A'];

const uploadBtn = document.getElementById("upload-btn");
const drawBtn = document.getElementById("draw-btn");
const winnerDisplay = document.getElementById("winner");
const csvUpload = document.getElementById("csv-upload");
const lottieContainer = document.getElementById("lottie");

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const tapeAnimation = lottie.loadAnimation({
    container: document.getElementById('background-lottie'), // the dom element
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './tape.json' // Replace with your Lottie JSON file path
});

// Lottie animation
const confettiAnimation = lottie.loadAnimation({
    container: lottieContainer, // the DOM element where the animation will be displayed
    renderer: "svg",
    loop: true,
    autoplay: false,
    speed: 2,
    path: "./confettie.json", // Dummy confetti animation, replace with your own
});

uploadBtn.addEventListener("click", () => {
    csvUpload.click();
});

csvUpload.addEventListener("change", handleFileUpload);

drawBtn.addEventListener("click", () => {
    if (names.length > 0 && !isDrawing) {
        startDrawAnimation();
    }
});

document.addEventListener("keydown", (event) => {
    // Trigger draw with spacebar or enter key
    if (
        (event.code === "Space" || event.code === "Enter") &&
        !drawBtn.disabled &&
        !isDrawing
    ) {
        startDrawAnimation();
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvText = e.target.result;
            const rows = csvText.split("\n");
            names = rows.map((row) => row.trim()).filter((name) => name !== "");
            if (names.length > 0) {
                drawBtn.disabled = false;
                winnerDisplay.textContent = "Ready for the draw!";
                uploadBtn.style.display = "none"; // Hide upload button
            }
        };
        reader.readAsText(file);
    }
}

function startDrawAnimation() {
    isDrawing = true;
    let counter = 0;
    lottieContainer.style.display = "none";
    confettiAnimation.stop();
    const shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        winnerDisplay.textContent = names[randomIndex];
        winnerDisplay.style.color = getRandomColor();
        winnerDisplay.classList.add("shuffling");
        counter++;
        if (counter > 50) {
            clearInterval(shuffleInterval);
            drawWinner();
        }
    }, 100); // Speed of name shuffle
}

function drawWinner() {
    const randomIndex = Math.floor(Math.random() * names.length);
    const winner = names[randomIndex];
    drawnNames.push(winner);
    names.splice(randomIndex, 1); // Remove winner from names

    winnerDisplay.textContent = winner;
    winnerDisplay.classList.remove("shuffling");
    winnerDisplay.style.transition = "font-size 1s";
    winnerDisplay.style.fontSize = "5rem";
    winnerDisplay.style.color = "#0B141A"

    // Show confetti animation
    lottieContainer.style.display = "block";
    confettiAnimation.play();

    isDrawing = false;

    // Disable draw button if no names left
    if (names.length === 0) {
        drawBtn.disabled = true;
        winnerDisplay.textContent += " - All winners drawn!";
    }
}