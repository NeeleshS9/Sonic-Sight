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
