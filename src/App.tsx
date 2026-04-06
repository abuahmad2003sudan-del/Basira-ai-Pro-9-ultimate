import React, { useState, useEffect, useRef } from 'react';
import { Scale, Settings, Send, Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// استيراد الملفات من نفس المجلد مباشرة
import DisclaimerPopup from './DisclaimerPopup';
import SettingsPage from './SettingsPage';

const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || "");

function App() {
  const [user, setUser] = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      setMessages(prev => [...prev, { role: 'bot', text: result.response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "خطأ في الاتصال." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {showDisclaimer && <DisclaimerPopup onAgree={() => setShowDisclaimer(false)} />}
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
      <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <Scale className="text-amber-500" />
          <h1 className="text-xl font-bold italic">Basira AI</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/5 rounded-full"><Settings /></button>
      </header>
      <main className="pt-32 pb-40 px-6 max-w-3xl mx-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-900'}`}>{msg.text}</div>
          </div>
        ))}
      </main>
      <div className="fixed bottom-0 w-full p-6 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/10">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent p-2 outline-none" dir="rtl" placeholder="اسأل بصيرة..." />
          <button onClick={handleSendMessage} className="bg-amber-500 p-3 rounded-xl text-black"><Send /></button>
        </div>
      </div>
    </div>
  );
}
export default App;
