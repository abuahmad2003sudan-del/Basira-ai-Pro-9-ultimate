import React from 'react';
import { X, Settings, Shield, Bell, Moon, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onClose: () => void;
}

const SettingsPage: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl p-4 sm:p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-zinc-900 border border-white/5 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold">الإعدادات الملكية</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8" dir="rtl">
          <section className="space-y-4">
            <h3 className="text-amber-500 font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" /> الخصوصية والأمان
            </h3>
            <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
              <span>تشفير المحادثات</span>
              <div className="w-12 h-6 bg-amber-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-amber-500 font-bold flex items-center gap-2">
              <Moon className="w-4 h-4" /> المظهر
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-amber-500 text-black rounded-2xl font-bold">وضع ليلي</button>
              <button className="p-4 bg-white/5 rounded-2xl">وضع ملكي</button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
