import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onAgree: () => void;
}

const DisclaimerPopup: React.FC<Props> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-amber-500/30 p-8 rounded-[32px] max-w-md w-full shadow-2xl shadow-amber-500/10 text-center"
      >
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-serif italic text-amber-500 mb-4">إخلاء مسؤولية قانوني</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8" dir="rtl">
          بصيرة AI هو مساعد ذكاء اصطناعي للأغراض التعليمية والمعلوماتية فقط. 
          النتائج لا تعتبر استشارة قانونية رسمية. يرجى دائماً مراجعة محامٍ مختص.
        </p>
        <button 
          onClick={onAgree}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          أوافق وأفهم ذلك
        </button>
      </motion.div>
    </div>
  );
};

export default DisclaimerPopup;
