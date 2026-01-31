const avatar = document.getElementById('avatar');
const statusLabel = document.getElementById('status-label');
const bootScreen = document.getElementById('boot-screen');

let isListening = false;
let systemActive = false;
const WAKE_WORD = "hey vee"; 

function bootUpSystem() {
    console.log("Button clicked. Initializing...");
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
        setTimeout(() => {
            if (!isListening && systemActive) {
                avatar.src = 'idle.png';
            }
        }, 200);
    }
    setTimeout(handleBlinking, Math.random() * 4000 + 2000);
}

function startListening() {
    console.log("Attempting to start Speech Recognition...");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error("Speech Recognition NOT found in this browser.");
        statusLabel.innerText = "ERROR: BROWSER NOT SUPPORTED";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log(">>> MIC IS LIVE: Browser is now listening.");
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
            alert("Please allow microphone access in your browser settings!");
        }
    };

    recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript.toLowerCase();
        }

        console.log("Heard:", currentTranscript);

        if (currentTranscript.includes(WAKE_WORD)) {
            console.log("WAKE WORD DETECTED!");
            triggerListeningState();
        }
    };

    recognition.onend = () => {
        console.log("Recognition service disconnected. Restarting...");
        if (systemActive) recognition.start();
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Recognition start failed:", e);
    }
}

function triggerListeningState() {
    if (isListening) return;
    isListening = true;
    statusLabel.innerText = "SYSTEM: LISTENING";
    avatar.src = 'idle.png';

    clearTimeout(window.silenceTimer);
    window.silenceTimer = setTimeout(() => {
        isListening = false;
        statusLabel.innerText = "SYSTEM: STANDBY";
    }, 5000); 
}
