import React from 'react';
import { ShieldAlert, Check, AlertCircle, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface DisclaimerPopupProps {
  onAgree: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl p-6 sm:p-12 rounded-[32px] sm:rounded-[56px] border border-amber-500/20 shadow-[0_0_100px_rgba(245,158,11,0.2)] bg-zinc-900 max-h-[90vh] overflow-y-auto no-scrollbar"
        dir="rtl"
      >
        <div className="space-y-6 sm:space-y-10 text-right">
          <div className="flex items-center gap-4 sm:gap-6 mb-4">
            <div className="p-3 sm:p-4 bg-amber-500/10 rounded-2xl sm:rounded-3xl shadow-inner">
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-serif italic luxury-text-gradient">مرحباً بك في بصيرة AI</h2>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-1 sm:mt-2">إخلاء مسؤولية قانوني هام جداً</p>
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8 text-base sm:text-lg leading-relaxed text-gray-200">
            <div className="flex items-center gap-3 text-amber-500 font-black text-lg sm:text-xl border-b border-amber-500/20 pb-3 sm:pb-4">
              <Scale className="w-5 h-5 sm:w-6 h-6" />
              <span>قبل البدء، يرجى ملاحظة ما يلي:</span>
            </div>
            
            <p className="font-medium text-sm sm:text-base">نحن نسعى لتقديم أدق التحليلات القانونية باستخدام أحدث تقنيات الذكاء الاصطناعي، ولكن يجب أن تعلم أن:</p>
            
            <ul className="space-y-4 sm:space-y-6">
              <li className="flex items-start gap-3 sm:gap-4 group">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <span className="font-bold text-sm sm:text-base">هذا التطبيق هو أداة مساعدة <span className="text-amber-500">للتوعية والمعرفة العامة</span> فقط.</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4 group">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <span className="font-bold text-sm sm:text-base">النتائج <span className="text-red-500 underline underline-offset-4">ليست نصيحة قانونية رسمية</span> ولا تغني عن استشارة محامٍ مختص.</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4 group">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <span className="font-bold text-sm sm:text-base">المطور غير مسؤول عن أي قرارات تُتخذ بناءً على مخرجات الذكاء الاصطناعي.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-amber-500/10 pt-6 sm:pt-8 text-left" dir="ltr">
            <div className="flex items-center gap-2 text-amber-500 mb-2 sm:mb-3">
              <AlertCircle className="w-4 h-4" />
              <p className="font-black text-base sm:text-lg">Legal Notice:</p>
            </div>
            <p className="text-xs sm:text-sm opacity-70 leading-relaxed font-medium">
              This AI-powered tool is for general awareness and educational purposes. Results are **NOT professional legal advice**. Always consult a licensed attorney for official legal matters. By proceeding, you agree to these terms.
            </p>
          </div>

          <button 
            onClick={onAgree}
            className="w-full py-5 sm:py-7 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-2xl sm:rounded-[32px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-amber-500/40 text-lg sm:text-xl uppercase tracking-widest flex items-center justify-center gap-3 sm:gap-4"
          >
            <Check className="w-5 h-5 sm:w-6 h-6" />
            أوافق وأتابع | I AGREE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DisclaimerPopup;
