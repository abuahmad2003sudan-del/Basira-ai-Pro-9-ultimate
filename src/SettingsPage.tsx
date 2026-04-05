import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Save, AlertTriangle, ExternalLink, X, Eye, EyeOff, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsPageProps {
  onClose: () => void;
  onSave: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, onSave }) => {
  const [adsenseId, setAdsenseId] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [showAdsense, setShowAdsense] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  useEffect(() => {
    const savedAdsense = localStorage.getItem('ADSENSE_PUBLISHER_ID') || 'ca-pub-9995476226348881';
    const savedGroq = localStorage.getItem('GROQ_API_KEY') || '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';
    const savedGemini = localStorage.getItem('GEMINI_API_KEY') || '';
    setAdsenseId(savedAdsense);
    setGroqKey(savedGroq);
    setGeminiKey(savedGemini);
  }, []);

  const handleSave = () => {
    localStorage.setItem('ADSENSE_PUBLISHER_ID', adsenseId);
    localStorage.setItem('GROQ_API_KEY', groqKey);
    localStorage.setItem('GEMINI_API_KEY', geminiKey);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSave();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/20 rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-amber-500/10 rounded-xl sm:rounded-2xl">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white">إعدادات النظام الملكي</h2>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">تخصيص مفاتيح التشغيل والربح</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto no-scrollbar flex-1">
          {/* Warning */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 sm:gap-4 items-start">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-1" />
            <p className="text-[10px] sm:text-xs text-amber-500/80 leading-relaxed font-bold">
              يتم تخزين هذه المفاتيح محلياً في متصفحك فقط (LocalStorage). نحن لا نقوم بنقلها أو تخزينها في خوادمنا لضمان أقصى درجات الأمان والخصوصية.
            </p>
          </div>

          {/* AdSense Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="text-[10px] sm:text-sm font-black text-gray-300 uppercase tracking-widest">معرف ناشر Google AdSense</h3>
            </div>
            <div className="relative group">
              <input 
                type={showAdsense ? "text" : "password"}
                value={adsenseId}
                onChange={(e) => setAdsenseId(e.target.value)}
                placeholder="pub-XXXXXXXXXXXXXXXX"
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 pl-12 text-white outline-none focus:border-amber-500/50 transition-all font-mono text-xs sm:text-sm"
              />
              <button 
                onClick={() => setShowAdsense(!showAdsense)}
                className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showAdsense ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[8px] sm:text-[10px] text-gray-500 leading-relaxed px-2">
              أدخل رقم الناشر الخاص بك (Publisher ID) لتفعيل الإعلانات والربح من التطبيق. يبدأ عادة بـ <code className="text-amber-500/60">pub-</code>.
            </p>
          </div>

          {/* Groq API Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-green-400" />
                <h3 className="text-[10px] sm:text-sm font-black text-gray-300 uppercase tracking-widest">مفتاح Groq API (للتحليل)</h3>
              </div>
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[8px] sm:text-[10px] font-black text-amber-500 hover:underline flex items-center gap-1"
              >
                الحصول على مفتاح <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative group">
              <input 
                type={showGroq ? "text" : "password"}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 pl-12 text-white outline-none focus:border-amber-500/50 transition-all font-mono text-xs sm:text-sm"
              />
              <button 
                onClick={() => setShowGroq(!showGroq)}
                className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showGroq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[8px] sm:text-[10px] text-gray-500 leading-relaxed px-2">
              هذا المفتاح ضروري لتشغيل محرك التحليل القانوني فائق السرعة.
            </p>
          </div>

          {/* Gemini API Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-[10px] sm:text-sm font-black text-gray-300 uppercase tracking-widest">مفتاح Gemini API (للصوت)</h3>
              </div>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[8px] sm:text-[10px] font-black text-amber-500 hover:underline flex items-center gap-1"
              >
                الحصول على مفتاح <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative group">
              <input 
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 pl-12 text-white outline-none focus:border-amber-500/50 transition-all font-mono text-xs sm:text-sm"
              />
              <button 
                onClick={() => setShowGemini(!showGemini)}
                className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[8px] sm:text-[10px] text-gray-500 leading-relaxed px-2">
              هذا المفتاح ضروري لتشغيل ميزة الصوت الذكي (TTS) من Google.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-white/5 border-t border-white/5 shrink-0">
          <button 
            onClick={handleSave}
            className="w-full bg-amber-500 text-black font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95"
          >
            {showSaved ? (
              <>تم الحفظ بنجاح!</>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ الإعدادات والتشغيل
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
