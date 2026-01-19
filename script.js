// 1. GLOBAL VARIABLES & SCOPING
// Declared at the top level to ensure all functions and listeners can access them.
let recognition; 
let audioContext;
let analyser;
let dataArray;
let animationId;
let lastAccuracy = 0;
let lastFreq = 0;
let cumulativeTranscript = '';

// State tracking
let currentMode = "Normal";
let totalFrames = 0;
let withinThresholdFrames = 0;

const thresholds = {
    "Whisper": 30,   // Low volume limit
    "Normal": 80,    // Medium volume limit
    "Speaker": 180   // High volume limit
};

// 2. DOM ELEMENT SELECTORS
let getStartedBtn;
let hideDiv;
let playBtn;
let textDisplay;
let canvas;
let canvasCtx;
let icon;
let menu;
let title;
let modeOptions;
let language;
let selectedLang;
let suggestionBox;
let expendBtn;
let closeBtn;
let suggestBtn;
let suggestionArea;

// Initialize DOM elements when page loads
function initializeDOMElements() {
    getStartedBtn = document.querySelector('.get-started');
    hideDiv = document.querySelector('.hide');
    playBtn = document.querySelector('.play');
    textDisplay = document.querySelector('#text');
    canvas = document.getElementById('visualizer');
    canvasCtx = canvas ? canvas.getContext('2d') : null;
    icon = document.getElementById('settings-icon');
    menu = document.getElementById('mode-menu');
    title = document.getElementById('tittle');
    modeOptions = document.querySelectorAll('.mode-option');
    language = document.getElementById('Language');
    selectedLang = language ? language.value : 'en-US';
    suggestionBox = document.getElementById('suggestionBox');
    expendBtn = document.getElementById('expend');
    closeBtn = document.getElementById('closePanel');
    suggestBtn = document.getElementById('suggestBtn');
    suggestionArea = document.querySelector('.suggestion-area');
    console.log('✅ DOM elements initialized');
}

// --- SANITIZATION FUNCTION ---
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDOMElements);
} else {
    initializeDOMElements();
}

// 3. SPEECH RECOGNITION INITIALIZATION
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // REMOVED: recognition.lang = 'en-US'; 
    // This is now set inside the playBtn listener using: recognition.lang = language.value;

    recognition.onresult = (event) => {
        if (!textDisplay) {
            console.error('❌ textDisplay element not found');
            return;
        }

        let interimTranscript = '';

        // We use eventIndex to only process new results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                // CHANGE: Append to our global session variable instead of a local one
                cumulativeTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update display - use textContent to avoid HTML issues
        // Show cumulative transcript + interim (thinking) text
        const displayText = cumulativeTranscript + interimTranscript;
        textDisplay.textContent = displayText;
        console.log('📝 Text updated:', displayText);
        
        // Keep the latest text in view
        textDisplay.scrollTop = textDisplay.scrollHeight;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };
}

// 4. GAUGE DRAWING LOGIC (Fits perfectly into your .status-box)
function drawGauge(canvasId, value, maxValue, color) {
    const gaugeCanvas = document.getElementById(canvasId);
    if (!gaugeCanvas) return;
    const ctx = gaugeCanvas.getContext('2d');

    // Sync internal resolution to the CSS size of the box
    gaugeCanvas.width = gaugeCanvas.offsetWidth;
    gaugeCanvas.height = gaugeCanvas.offsetHeight;

    const centerX = gaugeCanvas.width / 2;
    const centerY = gaugeCanvas.height - 10; // Positioned near bottom
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, gaugeCanvas.width, gaugeCanvas.height);

    // Draw Background Track (Semi-circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.strokeStyle = "#2e2e2e"; // Dark track background
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw Active Value (The color progress)
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    const endAngle = Math.PI + (Math.PI * percentage);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();
}

// 5. AUDIO ANALYSIS LOGIC
async function startAudio() {
    // Only create one AudioContext per session
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw();
}

function getAverageFrequency() {
    if (!analyser) return 0;
    let bufferLength = analyser.frequencyBinCount;
    let freqData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freqData);

    let values = 0;
    let count = 0;

    for (let i = 0; i < bufferLength; i++) {
        if (freqData[i] > 0) {
            values += i * (audioContext.sampleRate / analyser.fftSize);
            count++;
        }
    }
    return count === 0 ? 0 : Math.round(values / count);
}

// 6. MAIN ANIMATION LOOP
function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    // Sync Main Visualizer Canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Accuracy & Volume Logic
    const currentVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const limit = thresholds[currentMode];
    
    if (currentVolume > 5) { // Ensure there is actual sound
        totalFrames++;
        if (currentVolume <= limit) {
            withinThresholdFrames++;
        }
    }

    const accuracyScore = totalFrames === 0 ? 0 : Math.round((withinThresholdFrames / totalFrames) * 100);
    const avgFreq = getAverageFrequency();
    const isTooLoud = currentVolume > limit;

    // Update Text Elements
    document.getElementById('accValue').innerText = `${accuracyScore}%`;
    document.getElementById('freqValue').innerText = `${avgFreq}Hz`;
    textDisplay.style.color = isTooLoud ? "#ff4d4d" : "white";

    // DRAW THE GAUGES
    drawGauge('accuracyGauge', accuracyScore, 100, isTooLoud ? "#ff4d4d" : "#47eb47");
    drawGauge('frequencyGauge', avgFreq, 10000, "#af46e8"); // Scaled to 10kHz

    // Render Visualizer Bars
    const barCount = 120;
    const gap = 4;
    const barWidth = (canvas.width / barCount) - gap;
    const centerY = canvas.height / 2;
    let step = Math.floor(dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
        let amplitude = dataArray[i * step];
        let barHeight = (amplitude / 255) * canvas.height * 0.8;
        if (barHeight < 5) barHeight = 5;

        const x = i * (barWidth + gap);
        const y = centerY - (barHeight / 2);

        canvasCtx.fillStyle = isTooLoud ? "#ff4d4d" : `hsl(${120 + (i / barCount) * 160}, 80%, 60%)`;

        canvasCtx.beginPath();
        if (canvasCtx.roundRect) {
            canvasCtx.roundRect(x, y, barWidth, barHeight, 20);
        } else {
            canvasCtx.rect(x, y, barWidth, barHeight);
        }
        canvasCtx.fill();
    }

    lastAccuracy = accuracyScore;
    lastFreq = avgFreq;
}

// 7. EVENT LISTENERS & UI INTERACTION
getStartedBtn.addEventListener('click', () => {
    hideDiv.style.display = 'none';
});

icon.addEventListener('click', (e) => {
    menu.classList.toggle('active');
    e.stopPropagation();
});

modeOptions.forEach(option => {
    option.addEventListener('click', function() {
        currentMode = this.textContent.trim();
        title.textContent = currentMode;
        menu.classList.remove('active');
        
        // Reset accuracy stats when switching modes
        totalFrames = 0;
        withinThresholdFrames = 0;
    });
});

window.addEventListener('click', () => {
    menu.classList.remove('active');
});

// Inside your playBtn event listener:
playBtn.addEventListener('click', function() {
    if (this.classList.contains('fa-play')) {
        this.classList.replace('fa-play', 'fa-pause');
        
        cumulativeTranscript = ''; 
        if (textDisplay) textDisplay.textContent = ''; 
        
        if (recognition) {
            // GET THE CURRENT SELECTED LANGUAGE
            const currentLang = language ? language.value : 'en-US';
            recognition.lang = currentLang;
            console.log('🎮 Starting recognition with language:', currentLang);
            
            try { 
                recognition.start(); 
            } catch(e) {
                console.warn("Recognition already started");
            }
        }
        startAudio();
    } else {
        // --- STOP SESSION ---
        this.classList.replace('fa-pause', 'fa-play');

        if (recognition) recognition.stop();
        
        // Stop the visualizer animation
        if (animationId) cancelAnimationFrame(animationId);
        
        // Clean up audio context to save memory
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = null;
                analyser = null;
            });
        }
    }
});

// 1. Open the panel initially
suggestBtn.addEventListener('click', () => {
    suggestionArea.classList.add('active');
});

// 2. Toggle the Expanded Layer
expendBtn.addEventListener('click', () => {
    suggestionBox.classList.toggle('expanded');
    
    // Geometric logic: change icon based on state
    if (suggestionBox.classList.contains('expanded')) {
        expendBtn.classList.replace('fa-up-right-and-down-left-from-center', 'fa-down-left-and-up-right-to-center');
    } else {
        expendBtn.classList.replace('fa-down-left-and-up-right-to-center', 'fa-up-right-and-down-left-from-center');
    }
});

// 3. Close the panel and remove expansion
closeBtn.addEventListener('click', () => {
    suggestionArea.classList.remove('active');
    suggestionBox.classList.remove('expanded');
}); 

// --- SANITIZATION FUNCTION ---
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// --- API HELPER FUNCTION (Calls Backend Server) ---
async function callAPI(message) {
    // Validate input length (max 5000 characters)
    if (!message || typeof message !== 'string' || message.length > 5000) {
        throw new Error('Invalid message: must be a string between 1 and 5000 characters');
    }

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message.trim() })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.text || typeof data.text !== 'string') {
            throw new Error('Invalid response format from server');
        }
        return data.text;
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
}

// --- 3. THE RUN FUNCTION (Auto-Suggestion) ---
async function run() {
    updateChat("Analyzing your speech...");

    // Access global state and DOM values
    const selectedLang = language.value; 
    
    const prompt = `Analysis of audio graph, accuracy and frequency to give suggestion and praise the user. 
    Accuracy: ${document.getElementById('accValue').innerText}, 
    Frequency: ${document.getElementById('freqValue').innerText}. 
    Mode: ${currentMode}, 
    Language: ${selectedLang}. 
    Transcription: ${cumulativeTranscript}.
    Give the suggestion in ${selectedLang}.`;

    try {
        const responseText = await callAPI(prompt);
        updateChat(responseText);
    } catch (error) {
        console.error("Gemini Run Error:", error);
        updateChat(`<div style="color: #ff4d4d;">Error: ${error.message || 'Failed to generate suggestion. Make sure the server is running.'}</div>`);
    }
}

// --- 4. ASK GEMINI (Manual Query) ---
async function askGemini(ask) {
    if (!ask) return;

    try {
        updateChat("Thinking...");
        const responseText = await callAPI(ask);
        updateChat(responseText);
    } catch (error) {
        console.error("Gemini Ask Error:", error);
        updateChat(`<div style="color: #ff4d4d;">Error: ${error.message || 'Could not reach AI. Make sure the server is running on http://localhost:3000'}</div>`);
    }
}

function updateChat(content, isError = false) {
    const chatDisplay = document.querySelector('.chat-display');
    
    if (isError) {
        // Sanitize error messages
        const sanitized = escapeHtml(content);
        chatDisplay.innerHTML = `<div style="color: #ff4d4d;">${sanitized}</div>`;
    } else {
        // Use marked.parse() and then sanitize to prevent XSS
        // Note: marked has built-in XSS protection, but we add extra layer
        let html = marked.parse(content);
        // Remove any script tags or event handlers
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        chatDisplay.innerHTML = html;
    }
    
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
// --- 5. UPDATED SUBMIT LISTENER ---
const submitBtn = document.querySelector(".submit-btn");
const queryInput = document.querySelector("textarea"); // Use variable for the element

submitBtn.addEventListener('click', () => {
    // FIX: Use .value for textareas and validate input!
    const query = queryInput.value.trim();
    
    // Validate: not empty and reasonable length
    if (!query) {
        updateChat('Please enter a message', true);
        return;
    }
    if (query.length > 5000) {
        updateChat('Message is too long (max 5000 characters)', true);
        return;
    }
    
    askGemini(query);
    queryInput.value = ''; // Clear the input after sending
});
const analyzeBtn = document.getElementById("analyzeBtn");
analyzeBtn.addEventListener('click', () => {
    // FIX: Use .value for textareas!
    run();
});