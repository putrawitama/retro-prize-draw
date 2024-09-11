let names = [];
let drawnNames = [];
let isDrawing = false;
const colors = ['#169497', '#93D2BD', '#AD2424', '#CB6A28', '#EF9C1F', '#0B141A'];

// Audio elements for drum and champion sounds
const drumAudio = new Audio('./drawing.mp3'); // Path to drum.mp3
// const championAudio = new Audio('./champion.mp3'); // Path to champion.mp3

// Set volumes
drumAudio.volume = 0.8; // 100% volume for drum

const uploadBtn = document.getElementById("upload-btn");
const drawBtn = document.getElementById("draw-btn");
const winnerDisplay = document.getElementById("winner");
const csvUpload = document.getElementById("csv-upload");
const lottieContainer = document.getElementById("lottie");
const lottieContainer2 = document.getElementById("lottie-2");
const lottieContainer3 = document.getElementById("lottie-3");

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

const tvAnimation = lottie.loadAnimation({
    container: document.getElementById('background-lottie-2'), // the dom element
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './tv.json' // Replace with your Lottie JSON file path
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

const confettiAnimation2 = lottie.loadAnimation({
    container: lottieContainer2, // the DOM element where the animation will be displayed
    renderer: "svg",
    loop: true,
    autoplay: false,
    speed: 1,
    path: "./confettie-2.json", // Dummy confetti animation, replace with your own
});

const confettiAnimation3 = lottie.loadAnimation({
    container: lottieContainer3, // the DOM element where the animation will be displayed
    renderer: "svg",
    loop: true,
    autoplay: false,
    speed: 1,
    path: "./confettie-2.json", // Dummy confetti animation, replace with your own
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
    lottieContainer2.style.display = "none";
    lottieContainer3.style.display = "none";
    confettiAnimation.stop();
    confettiAnimation2.stop();
    confettiAnimation3.stop();
    drumAudio.pause();
    drumAudio.currentTime = 0;
    drumAudio.play();
    const shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        winnerDisplay.textContent = names[randomIndex];
        winnerDisplay.style.color = getRandomColor();
        winnerDisplay.classList.add("shuffling");
        counter++;
        if (counter > 70) {
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
    lottieContainer2.style.display = "block";
    lottieContainer3.style.display = "block";
    confettiAnimation.play();
    confettiAnimation2.play();
    confettiAnimation3.play();

    isDrawing = false;

    // Disable draw button if no names left
    if (names.length === 0) {
        drawBtn.disabled = true;
        winnerDisplay.textContent += " - All winners drawn!";
    }
}