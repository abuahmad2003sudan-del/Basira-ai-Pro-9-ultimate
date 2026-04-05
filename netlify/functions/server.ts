import express, { Router } from "express";
import serverless from "serverless-http";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const app = express();
const router = Router();

app.use(express.json());

// اختبار الخادم
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Basira AI Server is running!" });
});

// نقطة نهاية Gemini (مثال)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Gemini Error" });
  }
});

app.use("/.netlify/functions/server", router);

export const handler = serverless(app);
