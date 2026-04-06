import React, { useState, useEffect } from 'react';
import { Scale, Settings, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// استيراد المكونات من نفس المجلد
import DisclaimerPopup from './DisclaimerPopup';
import SettingsPage from './SettingsPage';

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

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // الاتصال بالخادم الخلفي الجديد في Cloudflare
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        throw new Error(data.error || "خطأ في الاستجابة");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "عذراً، واجهت مشكلة في الاتصال بالبصيرة." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {showDisclaimer && <DisclaimerPopup onAgree={() => setShowDisclaimer(false)} />}
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
      
      <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <Scale className="text-amber-500" />
          <h1 className="text-xl font-bold italic luxury-text-gradient">Basira AI</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Settings className="w-6 h-6 text-zinc-400" />
        </button>
      </header>

      <main className="pt-32 pb-40 px-6 max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20 space-y-4 opacity-50">
            <Scale className="w-12 h-12 mx-auto text-amber-500/50" />
            <p className="text-lg italic">كيف يمكن للبصيرة مساعدتك اليوم؟</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10' 
                : 'bg-zinc-900 border border-white/5 text-zinc-200'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        <div className="max-w-3xl mx-auto flex gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/10 shadow-2xl">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-transparent p-3 outline-none text-sm" 
            dir="rtl" 
            placeholder="اسأل بصيرة عن أي استشارة قانونية..." 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 p-3 rounded-xl text-black transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
