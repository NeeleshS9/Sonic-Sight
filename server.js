import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cors()); // Allows your website to talk to this server

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log('Received message:', message);
        
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        console.log('Sending response:', text.substring(0, 100) + '...');
        res.json({ text });
    } catch (error) {
        console.error('Full error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: "Failed to communicate with Gemini", details: error.message });
    }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));