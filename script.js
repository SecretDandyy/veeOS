const avatar = document.getElementById('avatar');
const statusLabel = document.getElementById('status-label');
const bootScreen = document.getElementById('boot-screen');

let isListening = false;
let systemActive = false;
const WAKE_WORD = "hey vee";

function bootUpSystem() {
    bootScreen.style.display = 'none';
    statusLabel.innerText = "SYSTEM: REBOOTING...";
    avatar.src = 'reboot.png';

    startListening();

    setTimeout(() => {
        systemActive = true;
        avatar.src = 'idle.png';
        statusLabel.innerText = "SYSTEM: STANDBY";
        handleBlinking();
    }, 3000);
}

function handleBlinking() {
    if (!systemActive) return;

    if (!isListening) {
        avatar.src = 'blink.png';
        if (statusLabel.innerText !== "SYSTEM: STANDBY") {
            statusLabel.innerText = "SYSTEM: BLINK";
        }

        setTimeout(() => {
            if (!isListening) {
                avatar.src = 'idle.png';
            }
        }, 200);
    }

    let nextBlink = Math.random() * 4000 + 2000;
    setTimeout(handleBlinking, nextBlink);
}

function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        statusLabel.innerText = "ERROR: NO MIC SUPPORT";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        if (!systemActive) return;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            let transcript = event.results[i][0].transcript.toLowerCase().trim();
            console.log("Heard:", transcript);

            if (transcript.includes(WAKE_WORD)) {
                triggerListeningState();
            }
        }
    };
    recognition.onend = () => {
        if (systemActive) recognition.start();
    };

    recognition.start();
}

function triggerListeningState() {
    isListening = true;
    statusLabel.innerText = "SYSTEM: LISTENING";
    avatar.src = 'idle.png';

    clearTimeout(window.silenceTimer);
    window.silenceTimer = setTimeout(() => {
        isListening = false;
        statusLabel.innerText = "SYSTEM: STANDBY";
    }, 5000); 
}
