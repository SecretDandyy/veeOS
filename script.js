const avatar = document.getElementById('avatar');
const statusLabel = document.getElementById('status-label');
const bootScreen = document.getElementById('boot-screen');

let isListening = false;
let systemActive = false;

function bootUpSystem() {
    bootScreen.style.display = 'none';
    statusLabel.innerText = "SYSTEM: REBOOTING...";
    avatar.src = 'reboot.png';

    startListening();

    setTimeout(() => {
        systemActive = true;
        avatar.src = 'idle.png';
        statusLabel.innerText = "SYSTEM: IDLE";
        handleBlinking();
    }, 3000);
}

function handleBlinking() {
    if (!systemActive) return;

    if (!isListening) {
        avatar.src = 'blink.png';
        statusLabel.innerText = "SYSTEM: BLINK";

        setTimeout(() => {
            if (!isListening) {
                avatar.src = 'idle.png';
                statusLabel.innerText = "SYSTEM: IDLE";
            }
        }, 200);
    }

    let nextBlink = Math.random() * 4000 + 2000;
    setTimeout(handleBlinking, nextBlink);
}
function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        if (!systemActive) return;

        isListening = true;
        statusLabel.innerText = "SYSTEM: LISTENING";
        avatar.src = 'idle.png';

        clearTimeout(window.silenceTimer);
        window.silenceTimer = setTimeout(() => {
            isListening = false;
            statusLabel.innerText = "SYSTEM: IDLE";
        }, 1200);
    };

    recognition.start();
}
