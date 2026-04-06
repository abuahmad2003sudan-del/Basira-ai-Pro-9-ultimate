const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashing) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <Scale className="w-20 h-20 text-amber-500 animate-pulse" />
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-3xl font-black italic tracking-[0.3em] text-white"
        >
          BASIRA AI
        </motion.h1>
        <div className="mt-4 w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    );
            }
import React, { useState, useEffect, useRef } from 'react';
import { Scale, Settings, Send, FileText, Zap, Brain, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import DisclaimerPopup from './DisclaimerPopup';
import SettingsPage from './SettingsPage';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<"gemini" | "groq">("gemini");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => unsubscribe();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, modelType }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text, timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "عذراً، واجهت مشكلة في الاتصال بالبصيرة." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30">
      <AnimatePresence>
        {showDisclaimer && <DisclaimerPopup onAgree={() => setShowDisclaimer(false)} />}
        {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
      
      {/* Header الملكي */}
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-black/60 backdrop-blur-2xl fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Scale className="text-amber-500 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white italic">BASIRA AI</h1>
            <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">Pro Ultimate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* زر التبديل بين المحركات */}
          <button 
            onClick={() => setModelType(modelType === "gemini" ? "groq" : "gemini")}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-white/10 transition-all"
          >
            {modelType === "gemini" ? <Brain className="w-3 h-3 text-purple-400" /> : <Zap className="w-3 h-3 text-amber-400" />}
            {modelType.toUpperCase()}
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/5 rounded-full">
            <Settings className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </header>

      {/* منطقة الدردشة */}
      <main className="pt-28 pb-44 px-4 max-w-4xl mx-auto">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 space-y-6">
            <div className="relative inline-block">
               <Scale className="w-16 h-16 mx-auto text-amber-500/20 animate-pulse" />
               <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />
            </div>
            <h2 className="text-2xl font-serif italic text-white">مرحباً بك في حضرة البصيرة</h2>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">اسأل عن القضايا، العقود، أو التحليلات القانونية المعقدة.</p>
          </motion.div>
        )}

        <div className="space-y-8">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative group max-w-[90%] p-5 rounded-[28px] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-amber-500 text-black font-bold shadow-2xl shadow-amber-500/20' 
                  : 'bg-zinc-900/50 border border-white/5 text-zinc-300 backdrop-blur-sm'
              }`}>
                {msg.text}
                <div className={`absolute top-full mt-2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'right-2' : 'left-2'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* منطقة الإدخال الخارقة */}
      <div className="fixed bottom-0 w-full p-4 sm:p-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-2xl p-2 rounded-[32px] border border-white/10 shadow-2xl focus-within:border-amber-500/50 transition-all">
            <button className="p-3 hover:bg-white/5 rounded-full text-zinc-500 hover:text-amber-500 transition-colors">
              <FileText className="w-5 h-5" />
            </button>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent p-3 outline-none text-sm placeholder:text-zinc-600" 
              dir="rtl" 
              placeholder="اكتب استشارتك هنا..." 
            />
            <button 
              onClick={handleSendMessage} 
              disabled={loading || !input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 p-4 rounded-[24px] text-black transition-all shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[9px] text-zinc-600 mt-4 uppercase tracking-[0.2em]">Powered by Basira Intelligence Engine</p>
        </div>
      </div>
    </div>
  );
}

export default App;
