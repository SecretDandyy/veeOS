const avatar = document.getElementById('avatar');
const statusLabel = document.getElementById('status-label');
const bootScreen = document.getElementById('boot-screen');

let isListening = false;
let systemActive = false;

function bootUpSystem() {
    bootScreen.style.display = 'none';
    statusLabel.innerText = "SYSTEM: REBOOTING...";
    avatar.className = 'state-reboot';

    startListening();
  
    setTimeout(() => {
        systemActive = true;
        avatar.className = 'state-idle';
        statusLabel.innerText = "SYSTEM: IDLE";
        handleBlinking();
    }, 3000);
}

function handleBlinking() {
    if (!systemActive) return;
  
    if (!isListening) {
        avatar.className = 'state-blink';
        statusLabel.innerText = "SYSTEM: BLINK";

        setTimeout(() => {
            if (!isListening) {
                avatar.className = 'state-idle';
                statusLabel.innerText = "SYSTEM: IDLE";
            }
        }, 250);
    }
  
    let nextBlink = Math.random() * 4000 + 2000;
    setTimeout(handleBlinking, nextBlink);
}

function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.log("Speech recognition not supported.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        if (!systemActive) return;

        isListening = true;
        statusLabel.innerText = "SYSTEM: LISTENING";
        avatar.className = 'state-idle';
      
        clearTimeout(window.silenceTimer);
        window.silenceTimer = setTimeout(() => {
            isListening = false;
            statusLabel.innerText = "SYSTEM: IDLE";
        }, 1500);
    };

    recognition.onerror = (err) => console.error("Mic Error:", err);
    recognition.start();
}
