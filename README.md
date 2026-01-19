# 🎙️ Sonic Sight

**Sonic Sight** is an intelligent audio analysis platform that bridges the gap between sound and insight. By analyzing real-time audio data—including accuracy, frequency, and speech patterns—Sonic Sight provides users with AI-driven suggestions and encouragement to improve their vocal performance or language learning.

---

## ✨ Key Features

* **Real-time Audio Visualizing:** Dynamic graph analysis of frequency and accuracy.
* **AI Suggestions:** Powered by Google Gemini to provide contextual feedback based on transcriptions.
* **Multilingual Support:** Switch between different languages for localized analysis.
* **Hybrid Modes:** Automatic "Run" mode for instant suggestions and manual "Ask" mode for specific queries.
* **Markdown-Rich Display:** Clean, easy-to-read feedback interface.

---

## 🚀 Technical Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+).
* **AI Engine:** Google Gemini API (via Node.js backend).
* **Markdown Parsing:** [Marked.js](https://marked.js.org/) for rendering AI responses.
* **Audio Processing:** Web Audio API for frequency and accuracy tracking.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sonic-sight.git
cd sonic-sight

```

### 2. Configure the Backend

Ensure you have your AI server running (default expects `http://localhost:3000`).

1. Navigate to your server directory.
2. Create a `.env` file and add your API Key:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000

```


3. Install dependencies and start:
```bash
npm install
npm start

```



### 3. Launch the Frontend

Simply open `index.html` in your browser or use a Live Server extension in VS Code.

---

## 📖 How It Works

1. **Record:** Speak into your microphone. The app captures your transcript and audio metrics.
2. **Analyze:** The `run()` function gathers state data:
* **Accuracy:** How close your speech is to the target.
* **Frequency:** The pitch/tone of your audio.
* **Transcription:** What you actually said.


3. **Feedback:** The data is sent to Gemini, which returns a formatted response in the selected language.
4. **Display:** The `updateChat()` function renders the feedback using **Marked.js** for a professional look.

---

## 📂 Project Structure

```text
├── index.html          # Main interface
├── style.css           # UI and Chat styling
├── script.js           # Logic for audio & AI integration
├── server/             # Node.js backend for API communication
└── README.md           # Documentation

```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for better audio visualization or additional AI features:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

Based on your UI screenshots, your project has a very sleek, high-tech "Dark Mode" aesthetic with neon accents. I have updated the **README.md** to reflect that professional look and the specific layout you've built.

---

# 🎙️ Sonic Sight: Intelligent Audio Analysis

Sonic Sight is a cutting-edge web application that provides real-time visual and analytical feedback on human speech. By combining live frequency tracking with Google Gemini’s generative AI, the platform helps users master their vocal delivery, improve pronunciation, and gain deep insights into their speech patterns.

## 🎯 Our Aim & Vision

### The Aim

To democratize high-level speech coaching. Sonic Sight aims to give every user a "visual ear"—allowing them to see their pitch, accuracy, and frequency in real-time, backed by an AI mentor that understands the context of their words.

### The Vision

We envision a world where language barriers and public speaking anxieties are overcome through data. Sonic Sight is designed for:

* **Language Learners:** Perfecting accent and intonation.
* **Public Speakers:** Monitoring vocal range and pacing.
* **Accessibility:** Providing visual feedback for the hearing impaired.
## AIM
<img width="1907" height="965" alt="image" src="https://github.com/user-attachments/assets/73274241-8207-4a9c-8f54-0a16a535a83e" />
---

## 💻 The User Interface

The application is divided into two primary sections as seen in our latest build:

### 1. The Dashboard (Analytics)

The top section of the UI features high-contrast neon gauges and real-time graphs:

* **Accuracy Meter:** Live tracking of speech precision.
* **Frequency Graph:** Visualizing the pitch and resonance of the user's voice.
* **Mode Selection:** Customizable analysis modes (Standard, Narrative, or Technical).

---

## 🔒 Permissions

Sonic Sight requires **Microphone Access** to function. All audio processing for the graphs is done locally in your browser to ensure privacy, while only the text transcript is sent to the AI for analysis.

---

## Basic UI
<img width="1906" height="967" alt="image" src="https://github.com/user-attachments/assets/1f724203-4efd-4826-abd6-f6b06b756126" />

---

## 💡 Smart Suggestion System

The **"Get Suggestion"** button is the core interactive feature of Sonic Sight. It doesn't just look at your words; it looks at your performance data.

### How it Works:

When the Suggestion button is clicked, the application performs a **Triple-Data Sync**:

1. **Vocal Metrics:** It pulls the current **Accuracy** and **Frequency** values from the live audio graph.
2. **Contextual Transcription:** It captures the `cumulativeTranscript`—everything you have said during the session.
3. **Environmental State:** It checks your selected **Language** and **Mode** (e.g., whether you are in a casual or formal setting).

### The AI Logic:

The data is bundled into a structured prompt and sent to the Gemini AI engine. Instead of a generic response, the button generates feedback based on:

* **Praise:** Acknowledging high accuracy or consistent frequency.
* **Correction:** Identifying where the transcription might be failing due to pronunciation or pitch issues.
* **Actionable Tips:** Providing specific advice in the user's **native or target language** on how to improve the next recording.

### Code Implementation:

```javascript
// The button triggers a prompt that combines:
const prompt = `Accuracy: ${acc}%, Frequency: ${freq}Hz, Transcript: ${text}...`;
// This ensures the AI "sees" the graph just like the user does.

```
---

