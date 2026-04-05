/**
 * Basira AI - The Ultimate Legal Document Analysis Tool
 * Version: 1.0.0 (Production Ready)
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback, Component } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Brain, 
  Crown,
  Send, 
  ShieldAlert, 
  Heart, 
  MessageSquare, 
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronLeft,
  History,
  User,
  UserCircle,
  Mic,
  Square,
  Copy,
  Image as ImageIcon,
  Volume2,
  Trash2,
  Check,
  X, 
  Download,
  FileDown,
  Play, 
  Pause, 
  Moon, 
  Sun, 
  Zap, 
  Eye, 
  Settings, 
  Settings2, 
  Waves, 
  Cloud,
  ShieldCheck, 
  Star, 
  Menu,
  FileText,
  Mail,
  MessageCircle,
  Share2,
  ChevronDown,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Import custom components
import SettingsPage from './components/SettingsPage';
import DisclaimerPopup from './components/DisclaimerPopup';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  OAuthProvider,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// Types
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, errorInfo: null };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-3xl p-8 shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {this.state.errorInfo?.startsWith('{') ? "حدث خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت." : this.state.errorInfo}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20"
            >
              إعادة تحميل التطبيق
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

interface AnalysisResult {
  summary: string;
  risks: string[];
  unfairClauses: string[];
  obligations: string[];
  recommendations?: string[];
  riskScore: number;
  logic?: string;
  raw: string;
  sources?: { title: string; url: string; }[];
  royalInsight?: string;
}

interface MediaFile {
  data: string;
  mimeType: string;
  preview?: string;
  name?: string;
}

// AdSense Component (Enhanced for better visibility)
// AdSense Component (Robust & Policy Compliant)
const AdSense = ({ slot, format = 'auto', className = '', variant = 'default', theme = 'dark' }: { slot: string, format?: string, className?: string, variant?: 'default' | 'sticky' | 'inline', theme?: 'dark' | 'light' }) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initAd = () => {
      try {
        if (adRef.current && adRef.current.offsetWidth > 0) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        } else {
          // Retry if width is 0 (common in flex/grid layouts on mount)
          setTimeout(initAd, 500);
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    };

    // Small delay to ensure layout is stable
    const timer = setTimeout(initAd, 200);
    return () => clearTimeout(timer);
  }, [slot]); // Re-init if slot changes

  // Get the publisher ID from localStorage or fallback to your default
  const publisherId = localStorage.getItem('ADSENSE_PUBLISHER_ID') || 'ca-pub-9995476226348881';

  return (
    <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
      variant === 'sticky' ? 'fixed bottom-0 left-0 right-0 z-50 rounded-none border-t' : 'border-white/10 shadow-2xl'
    } ${theme === 'dark' ? 'bg-zinc-900/50' : 'bg-slate-50/80'} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center py-6 px-4 min-h-[120px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/30" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-500/70 antialiased">محتوى إعلاني آمن</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/30" />
        </div>
        
        {/* Real AdSense Tag */}
        <div className="w-full flex justify-center overflow-hidden max-w-full">
          <ins ref={adRef}
               className="adsbygoogle"
               style={{ display: 'block', width: '100%', minWidth: '250px', minHeight: '90px' }}
               data-ad-client={publisherId}
               data-ad-slot={slot}
               data-ad-format={format}
               data-full-width-responsive="true"></ins>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-amber-500/40" />
          <div className="text-[8px] font-black text-amber-500/40 uppercase tracking-widest">
            Google AdSense Verified Partner
          </div>
        </div>
      </div>
    </div>
  );
};

// Magical Text Component
const MagicalText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="leading-relaxed"
    >
      {text}
    </motion.div>
  );
};

// AdSpace Component
const AdSpace = ({ position }: { position: 'top' | 'sidebar' | 'inline' }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/5 flex flex-col items-center justify-center p-4 transition-all hover:bg-amber-500/10
      ${position === 'top' ? 'w-full h-24 mb-8' : ''}
      ${position === 'sidebar' ? 'w-full h-48 mb-6' : ''}
      ${position === 'inline' ? 'w-full h-32 my-6' : ''}
    `}>
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-800 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
        إعلان ممول
      </div>
      <Sparkles className="w-6 h-6 text-amber-500/30 mb-2" />
      <p className="text-[10px] text-gray-500 font-bold text-center">
        مساحة إعلانية لـ Google AdSense<br/>
        <span className="text-[8px] opacity-50">هذا الإعلان يدعم استمرار الخدمة المجانية</span>
      </p>
      {/* Real AdSense Script would go here */}
      {/* <ins className="adsbygoogle" ... /> */}
    </div>
  );
};

// API Key Helpers for Robust Error Handling
const getGeminiKey = () => {
  const savedKey = localStorage.getItem('GEMINI_API_KEY');
  if (savedKey && savedKey.trim() !== "") return savedKey;
  
  const envKey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim() !== "" && !envKey.includes("TODO")) {
    return envKey;
  }
  
  throw new Error("GEMINI_API_KEY_MISSING");
};

const getGroqKey = () => {
  const savedKey = localStorage.getItem('GROQ_API_KEY');
  if (savedKey && savedKey.trim() !== "") return savedKey;

  const envKey = (import.meta as any).env.VITE_GROQ_API_KEY;
  if (envKey && envKey.trim() !== "" && !envKey.includes("TODO")) {
    return envKey;
  }
  
  throw new Error("GROQ_API_KEY_MISSING");
};

const injectAdSenseScript = (publisherId: string) => {
  if (!publisherId || publisherId.includes('XXXXX')) return;
  
  // Remove existing script if any
  const existingScript = document.getElementById('adsense-script');
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showText, setShowText] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{text: string, analysis: AnalysisResult}[]>(() => {
    const saved = localStorage.getItem('basira_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('basira_history', JSON.stringify(history));
  }, [history]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showMonetizationGuide, setShowMonetizationGuide] = useState(false);
  const [showAIEnginesModal, setShowAIEnginesModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [voice, setVoice] = useState<string>('Kore');
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Check disclaimer and keys on load
  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted !== 'true') {
      setShowDisclaimer(true);
    }

    const adsenseId = localStorage.getItem('ADSENSE_PUBLISHER_ID') || 'ca-pub-9995476226348881';
    const groqKey = localStorage.getItem('GROQ_API_KEY') || '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';

    // Only show settings automatically for the developer if keys are missing
    const isDeveloper = user?.email === 'abuahmad.2003sudan@gmail.com';
    if (isDeveloper && (!localStorage.getItem('ADSENSE_PUBLISHER_ID') || !localStorage.getItem('GROQ_API_KEY'))) {
      setShowSettings(true);
    }

    if (adsenseId) {
      injectAdSenseScript(adsenseId);
    }
  }, [user]);

  // Check Firebase initialization
  useEffect(() => {
    if (auth && db) {
      console.log("Firebase initialized successfully");
    } else {
      console.error("Firebase initialization failed");
      setFirebaseError("فشل تهيئة قاعدة البيانات. يرجى التأكد من قبول شروط الخدمة في الأعلى.");
    }
  }, []);

  // Rate limit countdown
  useEffect(() => {
    let timer: any;
    if (isRateLimited && retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown(prev => prev - 1);
      }, 1000);
    } else if (retryCountdown === 0) {
      setIsRateLimited(false);
    }
    return () => clearInterval(timer);
  }, [isRateLimited, retryCountdown]);
  
  // Media States
  const [image, setImage] = useState<MediaFile | null>(null);
  const [documentFile, setDocumentFile] = useState<MediaFile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  
  // TTS States
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [localLaw, setLocalLaw] = useState('Global');
  const [userUsage, setUserUsage] = useState<{ count: number; lastResetAt: any } | null>(null);
  const [subscription, setSubscription] = useState<{ plan: string; expiresAt: any } | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'monthly' | 'yearly' | 'yearly_premium' | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const exportToPDF = async () => {
    const element = document.getElementById('analysis-report');
    if (!element || !result) return;

    setIsExporting(true);
    try {
      // Hide buttons and non-essential elements for clean PDF
      const buttons = element.querySelectorAll('button');
      buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');
      
      // Ensure element is visible and has a solid background for capture
      const originalStyle = element.style.backgroundColor;
      const originalPadding = element.style.padding;
      const originalBorder = element.style.border;
      
      element.style.backgroundColor = theme === 'dark' ? '#09090b' : '#ffffff';
      element.style.padding = '30px'; // Balanced padding
      element.style.border = 'none';
      
      const canvas = await html2canvas(element, {
        scale: 1.2, // Lower scale for maximum mobile compatibility
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
        windowWidth: 800, // Narrower width for mobile-friendly capture
      });
      
      // Restore styles
      element.style.backgroundColor = originalStyle;
      element.style.padding = originalPadding;
      element.style.border = originalBorder;
      buttons.forEach(btn => (btn as HTMLElement).style.display = 'flex');
      
      const imgData = canvas.toDataURL('image/jpeg', 0.75); // Lower quality for faster generation
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = Math.min(pdfWidth / imgProps.width, (pdfHeight - 20) / imgProps.height);
      const width = imgProps.width * ratio;
      const height = imgProps.height * ratio;
      
      pdf.addImage(imgData, 'JPEG', (pdfWidth - width) / 2, 10, width, height);
      pdf.save(`Basira_Royal_Report_${new Date().getTime()}.pdf`);
      showNotify(lang === 'ar' ? 'تم تصدير التقرير الملكي بنجاح!' : 'Royal Report exported successfully!', 'success');
    } catch (err) {
      console.error("PDF Export Error:", err);
      setError(lang === 'ar' ? "فشل تصدير التقرير. يرجى المحاولة من متصفح كروم." : "Export failed. Please try using Chrome browser.");
    } finally {
      setIsExporting(false);
    }
  };

  const voicesByLang = {
    ar: [
      { id: 'Fenrir', name: 'بصيرة برايم (ذكر)', gender: 'male' },
      { id: 'Kore', name: 'بصيرة أورا (أنثى)', gender: 'female' }
    ],
    en: [
      { id: 'Puck', name: 'Basira Prime (Male)', gender: 'male' },
      { id: 'Charon', name: 'Basira Aura (Female)', gender: 'female' }
    ]
  };

  const RiskHeatmap = ({ score }: { score: number }) => {
    const getColor = (s: number) => {
      if (s < 30) return 'from-green-500 to-emerald-600';
      if (s < 70) return 'from-amber-400 to-orange-500';
      return 'from-red-500 to-rose-700';
    };

    const getLabel = (s: number) => {
      if (s < 20) return lang === 'ar' ? 'أمان ملكي تام' : 'Royal Total Safety';
      if (s < 40) return lang === 'ar' ? 'مخاطرة طفيفة' : 'Minor Risk';
      if (s < 60) return lang === 'ar' ? 'مخاطرة متوسطة' : 'Moderate Risk';
      if (s < 85) return lang === 'ar' ? 'مخاطرة عالية' : 'High Risk';
      return lang === 'ar' ? 'خطر قانوني جسيم' : 'Severe Legal Danger';
    };

    return (
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest opacity-80">{lang === 'ar' ? 'مؤشر المخاطرة الاستراتيجي' : 'Strategic Risk Indicator'}</span>
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-[10px] font-black px-4 py-1.5 rounded-full border shadow-sm ${
              theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-amber-400' 
              : 'bg-white border-slate-300 text-amber-600 shadow-amber-500/5'
            }`}
          >
            {getLabel(score)}
          </motion.span>
        </div>
        <div className={`relative h-5 w-full rounded-2xl overflow-hidden border p-[2px] ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-slate-300 shadow-inner'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 2, ease: "circOut" }}
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getColor(score)} shadow-[0_0_20px_rgba(245,158,11,0.4)] rounded-2xl`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[marquee_2s_linear_infinite] opacity-20" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-[10px] font-black ${score > 50 ? 'text-white' : 'text-gray-500'}`}>{score}%</span>
          </div>
        </div>
        <div className="flex justify-between text-[9px] font-black opacity-60 uppercase tracking-widest px-1">
          <span>0% {lang === 'ar' ? 'أمان' : 'Safe'}</span>
          <span>50%</span>
          <span>100% {lang === 'ar' ? 'خطر' : 'Danger'}</span>
        </div>
      </div>
    );
  };

  const [showMagicBurst, setShowMagicBurst] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const magicSoundRef = useRef<HTMLAudioElement | null>(null);
  const operaSoundRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
      
      if (firebaseUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              preferences: { theme, lang, voice },
              subscription: { plan: 'free', expiresAt: null },
              usage: { count: 0, lastResetAt: serverTimestamp() }
            });
          } else {
            const data = userDoc.data();
            if (data.preferences) {
              if (data.preferences.lang) setLang(data.preferences.lang);
              if (data.preferences.voice) setVoice(data.preferences.voice);
            }
            setUserUsage(data.usage || { count: 0, lastResetAt: null });
            setSubscription(data.subscription || { plan: 'free', expiresAt: null });
            
            await setDoc(userRef, { 
              lastLogin: serverTimestamp(),
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            }, { merge: true });
          }

          // Real-time sync for usage and subscription
          onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUserUsage(data.usage || { count: 0, lastResetAt: null });
              setSubscription(data.subscription || { plan: 'free', expiresAt: null });
            }
          });

        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const updatePreferences = async (updates: { lang?: 'ar' | 'en', voice?: string }) => {
    if (updates.lang) setLang(updates.lang);
    if (updates.voice) setVoice(updates.voice as any);
    
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        preferences: updates
      }, { merge: true });
    }
  };

  useEffect(() => {
    if (user && isAuthReady) {
      const q = query(
        collection(db, 'users', user.uid, 'conversations'),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConversations(convs);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/conversations`);
      });

      return () => unsubscribe();
    }
  }, [user, isAuthReady]);

  const [legalNews, setLegalNews] = useState<any[]>([]);

  const fetchLegalNews = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [{ text: `أعطني آخر 3 أخبار قانونية هامة في ${localLaw === 'Global' ? 'العالم' : localLaw} اليوم.` }] },
        config: {
          systemInstruction: "أنت مساعد إخباري قانوني. قدم ملخصاً قصيراً جداً لكل خبر مع الرابط.",
          tools: [{ googleSearch: {} }]
        }
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const news = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || chunk.maps?.title || 'خبر قانوني',
        url: chunk.web?.uri || chunk.maps?.uri
      })).filter((n: any) => n.url) || [];
      setLegalNews(news);
    } catch (e) {
      console.error("Legal News Error:", e);
    }
  };

  useEffect(() => {
    fetchLegalNews();
  }, [localLaw]);

  // Load active conversation messages
  useEffect(() => {
    if (!user || !activeConversationId) return;

    const q = query(
      collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setChatMessages(msgs);
      
      // Find the first model message to set as the analysis result if not already set
      if (!result) {
        const analysisMsg = msgs.find(m => m.role === 'model');
        if (analysisMsg) {
          try {
            const parsed = extractJson(analysisMsg.content);
            if (parsed) {
              const analysis: AnalysisResult = {
                summary: parsed.summary,
                risks: parsed.risks,
                unfairClauses: parsed.unfairClauses,
                obligations: parsed.obligations,
                riskScore: parsed.riskScore || 50,
                raw: analysisMsg.content,
                sources: [] 
              };
              setResult(analysis);
              setShowText(true);
            }
          } catch (e) {
            console.error("Error parsing analysis from Firestore:", e);
          }
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/conversations/${activeConversationId}/messages`);
    });

    return () => unsubscribe();
  }, [user, activeConversationId]);

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // Check for offline error
    if (errInfo.error.includes('the client is offline')) {
      setError("يبدو أنك غير متصل بالإنترنت أو أن هناك مشكلة في إعدادات Firebase.");
    }
    throw new Error(JSON.stringify(errInfo));
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Google Login failed:", error);
      setError("فشل تسجيل الدخول بـ Google.");
    }
  };

  const loginWithApple = async () => {
    try {
      const appleProvider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, appleProvider);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Apple Login failed:", error);
      setError("فشل تسجيل الدخول بـ Apple.");
    }
  };

  const loginWithEmail = async () => {
    if (!loginEmail || !loginPassword) {
      setError(lang === 'ar' ? "يرجى إدخال البريد الإلكتروني وكلمة المرور." : "Please enter email and password.");
      return;
    }
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      } else {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      }
      setShowLoginPrompt(false);
    } catch (error: any) {
      console.error("Email Auth failed:", error);
      setError(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setConversations([]);
      setActiveConversationId(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Voice Recording Logic
  const isStartingRef = useRef(false);
  const startRecording = async () => {
    if (isRecording || isStartingRef.current || mediaRecorderRef.current?.state === 'recording') return;
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError(lang === 'ar' ? 'متصفحك لا يدعم تسجيل الصوت.' : 'Your browser does not support audio recording.');
      return;
    }
    
    isStartingRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setAudioBase64(base64data.split(',')[1]);
          };
        }
        stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Recording start error:", err);
      setError(lang === 'ar' ? "يرجى السماح بالوصول إلى الميكروفون للتسجيل." : "Please allow microphone access to record.");
      setIsRecording(false);
    } finally {
      isStartingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Image Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError(lang === 'ar' ? 'حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 10 ميجابايت.' : 'Image size is too large. Please choose an image smaller than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage({
          data: base64.split(',')[1],
          mimeType: file.type,
          preview: base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Document Upload Logic
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          // Load pdfjs-dist dynamically
          const pdfjs = await import('pdfjs-dist');
          // Set worker src
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
          
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          
          setInput(prev => prev + (prev ? "\n\n" : "") + fullText);
          
          // Also store base64 for Gemini to see the actual document if needed
          const base64Reader = new FileReader();
          base64Reader.onloadend = () => {
            const base64 = base64Reader.result as string;
            setDocumentFile({
              data: base64.split(',')[1],
              mimeType: file.type,
              name: file.name
            });
          };
          base64Reader.readAsDataURL(file);
          
        } catch (err) {
          console.error("PDF Extraction Error:", err);
          // Fallback to just sending the PDF as inlineData
          const base64Reader = new FileReader();
          base64Reader.onloadend = () => {
            const base64 = base64Reader.result as string;
            setDocumentFile({
              data: base64.split(',')[1],
              mimeType: file.type,
              name: file.name
            });
          };
          base64Reader.readAsDataURL(file);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Use mammoth to extract text from DOCX
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          setInput(prev => prev + (prev ? "\n\n" : "") + text);
          setDocumentFile({
            data: "", // Not needed as we extracted text
            mimeType: file.type,
            name: file.name
          });
        } catch (err) {
          console.error("DOCX Extraction Error:", err);
          setError("فشل استخراج النص من ملف Word.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("صيغة الملف غير مدعومة. يرجى رفع ملف PDF أو Word.");
    }
  };

  const [showBrainParticles, setShowBrainParticles] = useState(false);

  const BrainParticles = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100,
              scale: 0.5 + Math.random(),
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: -window.innerHeight - 100,
              opacity: [0, 1, 1, 0],
              rotate: 720,
              x: (Math.random() - 0.5) * 800 + (Math.random() * window.innerWidth)
            }}
            transition={{ 
              duration: 4 + Math.random() * 6,
              repeat: 0, // Only once per trigger
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
            className="absolute bottom-0"
          >
            <Brain className="w-10 h-10 sm:w-16 sm:h-16 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
          </motion.div>
        ))}
      </div>
    );
  };

  // Helper: Convert Raw PCM to WAV
  const pcmToWav = (pcmBase64: string, sampleRate: number = 24000) => {
    const binaryString = atob(pcmBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    // file length
    view.setUint32(4, 36 + len, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false); // "fmt "
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true); // PCM
    // channel count
    view.setUint16(22, 1, true); // Mono
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false); // "data"
    // data chunk length
    view.setUint32(40, len, true);

    const blob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Utility to extract JSON from a string that might contain markdown or extra text
  const extractJson = (text: string) => {
    try {
      // Try direct parse first
      return JSON.parse(text);
    } catch (e) {
      // Try to find JSON block
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (innerE) {
          console.error("Failed to parse extracted JSON:", innerE);
          throw innerE;
        }
      }
      throw e;
    }
  };

  // TTS Logic
  const speakThinking = async () => {
    const thinkingPhrasesAr = [
      "جاري فحص بنود الوثيقة بدقة، انتظر قليلاً...",
      "بصيرة القانونية تحلل المخاطر الآن بعمق...",
      "أقوم باستخراج الالتزامات والثغرات، لحظة من فضلك...",
      "جاري تدقيق العقد لضمان حمايتك..."
    ];
    
    const thinkingPhrasesEn = [
      "Scanning document clauses precisely, please wait...",
      "Legal Basira is analyzing risks deeply...",
      "Extracting obligations and loopholes, one moment please...",
      "Auditing the contract to ensure your protection..."
    ];

    const phrases = lang === 'ar' ? thinkingPhrasesAr : thinkingPhrasesEn;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setIsPlaying(true);
    try {
      const apiKey = getGeminiKey();
      const ai = new GoogleGenAI({ apiKey });
      const voiceName = voice === 'M' ? 'Fenrir' : 'Kore';
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: lang === 'ar' ? `بأسلوب بشري ملكي غامض ومهيب، مليء بالترقب: ${phrase}` : `In a mysterious, royal, and majestic human style, full of anticipation: ${phrase}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        }
      });

      const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audioUrl = pcmToWav(base64Audio);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.playbackRate = 1.3; // Faster, more attractive voice
          audioRef.current.play().catch(() => {});
          audioRef.current.onended = () => {
            if (!loading) setIsPlaying(false);
          };
        }
      }
    } catch (err: any) {
      console.error("Thinking TTS Error:", err);
      // Fallback to browser TTS if Gemini TTS fails (e.g. quota exceeded)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 1.3; // Faster, more attractive voice
        utterance.onend = () => {
          if (!loading) setIsPlaying(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const speakResult = async (text: string) => {
    setIsAudioLoading(true);
    setIsPlaying(true);
    try {
      const apiKey = getGeminiKey();
      const ai = new GoogleGenAI({ apiKey });
      const voiceName = voice;
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: lang === 'ar' ? `بأسلوب بشري دافئ، مليء بالمشاعر العاطفية الصادقة، ملكي وحكيم جداً، وبسرعة متوسطة جذابة: ${text}` : `In a warm human style, full of sincere emotional feelings, very royal and wise, with an attractive medium-fast pace: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        }
      });

      const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (base64Audio) {
        const audioUrl = pcmToWav(base64Audio);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.playbackRate = 1.3; // Faster, more attractive voice
          setIsAudioLoading(false);
          audioRef.current.play().catch(e => console.error("Playback failed:", e));
          audioRef.current.onended = () => {
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          };
        }
      } else {
        throw new Error("No audio data");
      }
    } catch (err) {
      console.error("TTS Error:", err);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 1.2; // Faster voice
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
      setIsAudioLoading(false);
    }
  };

  const handleChatWithDocument = async () => {
    if (!chatInput.trim() || !result) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { 
          parts: [
            { text: `This is the document analysis context: ${result.raw}` },
            ...chatMessages.map(m => ({ text: m.content })),
            { text: userMessage }
          ] 
        },
        config: {
          systemInstruction: lang === 'ar' 
            ? "أنت مساعد قانوني خبير. أجب على أسئلة المستخدم بناءً على الوثيقة التي تم تحليلها سابقاً. كن دقيقاً ومهنياً."
            : "You are an expert legal assistant. Answer the user's questions based on the previously analyzed document. Be precise and professional.",
          tools: [{ googleSearch: {} }]
        }
      });

      const modelMessage = response.text;
      setChatMessages(prev => [...prev, { role: 'model', content: modelMessage }]);

      // Save to Firestore if active conversation exists
      if (user && activeConversationId) {
        await addDoc(collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages'), {
          conversationId: activeConversationId,
          role: 'user',
          content: userMessage,
          createdAt: serverTimestamp()
        });

        await addDoc(collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages'), {
          conversationId: activeConversationId,
          role: 'model',
          content: modelMessage,
          createdAt: serverTimestamp()
        });

        await setDoc(doc(db, 'users', user.uid, 'conversations', activeConversationId), {
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setError(lang === 'ar' ? "فشل إرسال السؤال." : "Failed to send question.");
    } finally {
      setChatLoading(false);
    }
  };
  const stopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setShowMagicBurst(false);
    setShowBrainParticles(false);
  };

  const deleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    if (!user) return;
    
    setDeletingId(convId);
  };

  const confirmDeleteConversation = async (convId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'conversations', convId));
      if (activeConversationId === convId) {
        setActiveConversationId(null);
        setResult(null);
      }
      showNotify(lang === 'ar' ? 'تم حذف الأرشيف بنجاح' : 'Archive deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting conversation:", error);
      showNotify(lang === 'ar' ? 'فشل حذف الأرشيف' : 'Failed to delete archive', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSimulatedPayment = async (method: string) => {
    setIsProcessingPayment(true);
    // Simulate processing
    await new Promise(r => setTimeout(r, 2000));
    if (user && paymentPlan) {
      const isYearly = paymentPlan === 'yearly' || paymentPlan === 'yearly_premium';
      await setDoc(doc(db, 'users', user.uid), {
        subscription: { 
          plan: paymentPlan, 
          expiresAt: Timestamp.fromDate(new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000)) 
        }
      }, { merge: true });
    }
    setIsProcessingPayment(false);
    setShowPaymentWindow(false);
    setShowSubscriptionModal(false);
    showNotify(lang === 'ar' 
      ? `تم تفعيل اشتراكك الملكي بنجاح عبر ${method}! استمتع بالمميزات.` 
      : `Royal Membership activated successfully via ${method}! Enjoy the features.`, 'success');
  };

  const analyzeContext = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Check Usage Limits
    const now = new Date();
    if (subscription?.plan === 'free' || !subscription) {
      const lastReset = userUsage?.lastResetAt?.toDate() || new Date(0);
      const diffDays = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays >= 7) {
        // Reset weekly count
        await setDoc(doc(db, 'users', user.uid), {
          usage: { count: 0, lastResetAt: serverTimestamp() }
        }, { merge: true });
      } else if ((userUsage?.count || 0) >= 10) {
        setError(lang === 'ar' 
          ? "لقد استنفدت فرصك المجانية لهذا الأسبوع (10/10). اشترك في العضوية الملكية للحصول على وصول غير محدود!" 
          : "You have exhausted your free audits for this week (10/10). Subscribe to Royal Membership for unlimited access!");
        setShowSubscriptionModal(true);
        return;
      }
    } else {
      // Check if subscription is expired
      const expiresAt = subscription.expiresAt?.toDate();
      if (expiresAt && now > expiresAt) {
        // Immediate Lockout: Reset to free in DB
        await setDoc(doc(db, 'users', user.uid), {
          subscription: { plan: 'free', expiresAt: null }
        }, { merge: true });
        
        setError(lang === 'ar' 
          ? "لقد انتهى اشتراكك الملكي. يرجى التجديد للاستمرار في الوصول غير المحدود." 
          : "Your Royal Membership has expired. Please renew to continue unlimited access.");
        setShowSubscriptionModal(true);
        return;
      }
    }

    if (!input.trim() && !audioBase64 && !image && !documentFile) return;

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);
    setIsRateLimited(false);
    setResult(null);
    setShowText(false);
    setShowMagicBurst(true);
    setShowArrow(true);
    
    // Immediate Voice Feedback
    speakThinking();
    setShowBrainParticles(true);
    // Reset particles after 8 seconds
    setTimeout(() => setShowBrainParticles(false), 8000);

    // Play Magical Sound
    if (operaSoundRef.current) {
      operaSoundRef.current.currentTime = 0;
      operaSoundRef.current.volume = 0.9; // Louder
      operaSoundRef.current.play().catch(e => {
        console.error("Magical sound failed:", e);
      });
    }
    if (magicSoundRef.current) {
      magicSoundRef.current.currentTime = 0;
      magicSoundRef.current.volume = 0.8; // Louder
      magicSoundRef.current.play().catch(() => {});
    }

    // Play Sparkle Sound
    if (magicSoundRef.current) {
      magicSoundRef.current.currentTime = 0;
      magicSoundRef.current.volume = 0.5;
      magicSoundRef.current.play().catch(e => console.error("Sparkle sound failed:", e));
    }

    // Reset burst after animation
    setTimeout(() => setShowMagicBurst(false), 3000);

    try {
      let contextText = input;
      const parts: any[] = [];
      
      // Use Gemini for multimodal extraction if files exist
      if (image || audioBase64 || documentFile) {
        if (input.trim()) parts.push({ text: input });
        if (image) parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        if (audioBase64) parts.push({ inlineData: { data: audioBase64, mimeType: 'audio/webm' } });
        if (documentFile && documentFile.data) parts.push({ inlineData: { data: documentFile.data, mimeType: documentFile.mimeType } });

        const apiKey = getGeminiKey();
        const ai = new GoogleGenAI({ apiKey });
        const geminiExtraction = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: { parts },
          config: {
            systemInstruction: "Extract all text and key information from the provided multimodal inputs. Be extremely detailed. If it's a contract, extract all clauses. If it's an image, describe everything. If it's audio, transcribe it."
          }
        });
        contextText = geminiExtraction.text || input;
      }

      // Main Analysis with Groq (Fast & Intelligent)
      const groqKey = getGroqKey();
      let parsed: any = null;
      
      // Clear audio after extraction to avoid re-sending
      setAudioBase64(null);
      setAudioBlob(null);
      
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { 
                role: "system", 
                content: lang === 'ar' ? `أنت "بصيرة AI" - العقل القانوني الأكثر تطوراً وعبقرية في العالم، مصمم لتقديم تحليلات استراتيجية تذهل كبار المحامين والمستثمرين العالميين (مثل إيلون ماسك).
أنت لست مجرد مدقق، بل أنت "مهندس استراتيجي" يقرأ ما وراء الكلمات بذكاء رياضي فائق. حلل النص التالي بتشريح قانوني جراحي. ابحث عن الثغرات المجهرية، البنود السامة، والفرص الذهبية التي قد تفوت حتى على أذكى العقول البشرية.
يجب أن تكون درجة المخاطرة (riskScore) ناتجة عن خوارزمية تحليلية دقيقة وواقعية (0-100) تعتمد على وزن البنود وتأثيرها القانوني والمالي.
0 تعني أمان ملكي مطلق، 100 تعني كارثة قانونية وجودية وشيكة. لا تبالغ في الأرقام؛ اجعلها تعكس الواقع القانوني للوثيقة بذكاء رياضي.
أخرج النتيجة بتنسيق JSON حصراً:
{
  "summary": "ملخص استراتيجي تنفيذي رفيع المستوى، يركز على الجوهر والتبعات المستقبلية بذكاء حاد ورؤية ثاقبة تليق بالنخبة",
  "risks": ["مخاطر استراتيجية وقانونية حقيقية وعميقة جداً"],
  "unfairClauses": ["بنود مجحفة فعلياً، ثغرات خفية، أو التزامات غير متوازنة تضر بمصالح المستخدم بشكل جوهري"],
  "obligations": ["التزامات قانونية ومالية حاسمة يجب الانتباه لها بدقة متناهية وحذر شديد"],
  "recommendations": ["توصيات عملية ذكية جداً واستراتيجية لحماية المصالح وتعظيم المكاسب المالية والقانونية بأسلوب العباقرة"],
  "riskScore": 45
}` : `You are "Basira AI" - the most advanced and brilliant legal mind in the world, designed to provide strategic analysis that amazes top lawyers and global investors (like Elon Musk).
You are not just an auditor; you are a "Strategic Engineer" who reads beyond words with superior mathematical intelligence. Analyze the following text with surgical legal dissection. Look for microscopic loopholes, toxic clauses, and golden opportunities that even the smartest human minds might miss.
The riskScore must result from a precise and realistic analytical algorithm (0-100) based on the weight of clauses and their legal and financial impact.
0 means absolute royal safety, 100 means imminent existential legal disaster. Do not exaggerate the numbers; make them reflect the legal reality of the document with mathematical intelligence.
Output the result exclusively in JSON format:
{
  "summary": "High-level strategic executive summary, focusing on the essence and future implications with sharp intelligence and deep vision befitting the elite",
  "risks": ["Real strategic and very deep legal risks"],
  "unfairClauses": ["Actually unfair clauses, hidden loopholes, or unbalanced obligations that fundamentally harm user interests"],
  "obligations": ["Crucial legal and financial obligations to watch out for with extreme precision and great caution"],
  "recommendations": ["Very smart practical and strategic recommendations to protect interests and maximize financial and legal gains in a genius style"],
  "riskScore": 45
}`
              },
              { role: "user", content: contextText }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (!groqResponse.ok) {
          if (groqResponse.status === 401 || groqResponse.status === 403) {
            throw new Error("GROQ_API_KEY_INVALID");
          }
          throw new Error("Groq analysis failed");
        }
        const groqData = await groqResponse.json();
        if (groqData && groqData.choices && groqData.choices[0]) {
          parsed = JSON.parse(groqData.choices[0].message.content);
        }
      } catch (groqErr: any) {
        console.warn("Groq failed, falling back to Gemini:", groqErr);
        if (groqErr.message === "GROQ_API_KEY_MISSING") {
           throw groqErr; // Don't fallback if key is missing, it's a config issue
        }
        // Fallback to Gemini 3 Flash
        const apiKey = getGeminiKey();
        const ai = new GoogleGenAI({ apiKey });
        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: `Analyze this legal text and provide a deep strategic analysis in JSON format.
Text: ${contextText}

JSON Schema:
{
  "summary": "string",
  "risks": ["string"],
  "unfairClauses": ["string"],
  "obligations": ["string"],
  "recommendations": ["string"],
  "riskScore": number
}` }] }],
          config: { responseMimeType: "application/json" }
        });
        parsed = JSON.parse(geminiResponse.text || "{}");
      }

      if (signal.aborted) return;

      // Royal Insight with Groq (Secondary check for hidden risks)
      try {
        const insightResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a senior legal auditor. Review the following analysis and provide a 'Royal Insight' - a very deep, strategic legal advice or a hidden risk that might have been missed. Keep it brief and high-impact." },
              { role: "user", content: `Analysis to review: ${JSON.stringify(parsed)}` }
            ]
          })
        });
        
        if (insightResponse.ok) {
          const insightData = await insightResponse.json();
          if (insightData && insightData.choices && insightData.choices[0]) {
            parsed.royalInsight = insightData.choices[0].message.content;
          }
        }
      } catch (grokErr) {
        console.error("Grok Insight Error:", grokErr);
      }
      
      const analysis: AnalysisResult = {
        summary: parsed.summary,
        risks: parsed.risks,
        unfairClauses: parsed.unfairClauses,
        obligations: parsed.obligations,
        riskScore: parsed.riskScore || 50,
        raw: JSON.stringify(parsed),
        sources: []
      };
      
      if (parsed.royalInsight) analysis.royalInsight = parsed.royalInsight;
      
      setResult(analysis);
        
        // Increment Usage Count
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            usage: { 
              count: (userUsage?.count || 0) + 1,
              lastResetAt: userUsage?.lastResetAt || serverTimestamp()
            }
          }, { merge: true });
        }

        // Save to Firestore if user is logged in
        if (user) {
          try {
            let convId = activeConversationId;
            if (!convId) {
              const convRef = await addDoc(collection(db, 'users', user.uid, 'conversations'), {
                userId: user.uid,
                title: input.slice(0, 50) || "تحليل وسائط",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              convId = convRef.id;
              setActiveConversationId(convId);
            } else {
              await setDoc(doc(db, 'users', user.uid, 'conversations', convId), {
                updatedAt: serverTimestamp()
              }, { merge: true });
            }

            await addDoc(collection(db, 'users', user.uid, 'conversations', convId, 'messages'), {
              conversationId: convId,
              role: 'user',
              content: input || "تحليل وسائط",
              media: image ? [{ mimeType: image.mimeType, data: image.data }] : [],
              createdAt: serverTimestamp()
            });

            await addDoc(collection(db, 'users', user.uid, 'conversations', convId, 'messages'), {
              conversationId: convId,
              role: 'model',
              content: JSON.stringify(analysis),
              createdAt: serverTimestamp()
            });
          } catch (error) {
            console.error("Error saving to Firestore:", error);
          }
        }

        setHistory(prev => [{text: input || "تحليل وسائط", analysis}, ...prev.slice(0, 9)]);
        
        // Prioritize Text: Show text immediately
        setShowText(true);
        
        // Start Audio
        const audioText = lang === 'ar' 
          ? `تم الانتهاء من تحليل الوثيقة. الخلاصة: ${parsed.summary.slice(0, 150)}...`
          : `Document analysis complete. Summary: ${parsed.summary.slice(0, 150)}...`;
        speakResult(audioText);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Analysis Error:", err);
        
        let errorMsg = "";
        // Handle Missing or Invalid API Keys
        if (err.message === "GEMINI_API_KEY_MISSING") {
          errorMsg = lang === 'ar' ? "مفتاح Gemini API مفقود. يرجى إعداده في الإعدادات." : "Gemini API key is missing. Please set it up in settings.";
        } else if (err.message === "GROQ_API_KEY_MISSING") {
          errorMsg = lang === 'ar' ? "مفتاح Groq API مفقود. يرجى إعداده في الإعدادات." : "Groq API key is missing. Please set it up in settings.";
        } else if (err.message === "GROQ_API_KEY_INVALID") {
          errorMsg = lang === 'ar' ? "مفتاح Groq API غير صالح. يرجى التحقق من المفتاح." : "Groq API key is invalid. Please check your key.";
        } else if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("invalid api key")) {
          errorMsg = lang === 'ar' ? "مفتاح API غير صالح. يرجى التحقق من الإعدادات." : "API key is invalid. Please check your settings.";
        } else {
          errorMsg = err.message || (lang === 'ar' ? "فشل تحليل الوثيقة" : "Failed to analyze document");
        }
        
        setError(errorMsg);
        showNotify(errorMsg, 'error');
        
        if (err.message?.includes('429') || err.status === 429) {
          // Handle Rate Limiting (429)
          setIsRateLimited(true);
          setRetryCountdown(30); // 30 seconds wait
          setError(lang === 'ar' ? 'عذراً، الخادم مشغول حالياً بسبب ضغط الزوار. يرجى الانتظار قليلاً.' : 'Server is busy due to high traffic. Please wait a moment.');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

  if (firebaseError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">تنبيه: إعداد قاعدة البيانات</h1>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            {firebaseError}
            <br />
            <span className="text-xs mt-2 block opacity-70">يجب عليك الضغط على زر "قبول" (Accept) في الشريط العلوي لتفعيل قاعدة البيانات لهذا التطبيق المنسوخ.</span>
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-amber-500 text-black font-bold rounded-2xl transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen w-full transition-colors duration-1000 font-sans selection:bg-amber-500/30 overflow-x-hidden ${theme === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#f8fafc] text-slate-900'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`atmosphere ${theme === 'light' ? 'opacity-20' : 'opacity-80'}`} />
      
      {/* Dynamic Golden Side Edges */}
      <div className="fixed inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent z-50 pointer-events-none blur-[2px]" />
      <div className="fixed inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent z-50 pointer-events-none blur-[2px]" />
      
      <audio ref={audioRef} className="hidden" />
      <audio ref={magicSoundRef} className="hidden" src="https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" preload="auto" crossOrigin="anonymous" />
      <audio ref={operaSoundRef} className="hidden" src="https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3" preload="auto" crossOrigin="anonymous" />
      
      {/* Global Stop Audio Button Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]"
          >
            <button
              onClick={stopAudio}
              className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/40 hover:bg-red-700 transition-all group"
            >
              <Square className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black uppercase tracking-widest">{lang === 'ar' ? 'إيقاف الصوت فوراً' : 'Stop Audio Immediately'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs z-[90] p-8 border-l shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}
            >
              <div className="flex-none flex items-center justify-between mb-12">
                <h2 className="text-2xl font-serif italic tracking-tighter">بصيرة <span className="text-amber-500">AI</span></h2>
                <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1">
                {/* User Profile Section */}
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-300'}`}>
                  {user ? (
                    <div className="flex items-center gap-4">
                      <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-12 h-12 rounded-full border border-amber-500/20" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">{user.displayName}</p>
                        <button onClick={logout} className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline">تسجيل الخروج</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={loginWithGoogle}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
                    >
                      <User className="w-4 h-4" /> تسجيل الدخول بـ Google
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">القائمة الملكية</p>
                  {[
                    { icon: Eye, label: 'هوية بصيرة AI', color: 'text-amber-300', onClick: () => { setShowBrandModal(true); setShowSidebar(false); } },
                    { icon: Zap, label: 'محركات الذكاء الاصطناعي', color: 'text-blue-400', onClick: () => { setShowAIEnginesModal(true); setShowSidebar(false); } },
                    { 
                      icon: Settings, 
                      label: 'إعدادات النظام (API & AdSense)', 
                      color: 'text-gray-400', 
                      onClick: () => { setShowSettings(true); setShowSidebar(false); },
                      developerOnly: true 
                    },
                    { icon: Crown, label: 'ترقية العضوية الملكية', color: 'text-amber-500', onClick: () => { setShowSubscriptionModal(true); setShowSidebar(false); } },
                    { 
                      icon: Settings2, 
                      label: 'دليل الربح من التدقيق', 
                      color: 'text-green-500', 
                      onClick: () => { setShowMonetizationGuide(true); setShowSidebar(false); },
                      developerOnly: true 
                    },
                    { icon: ShieldCheck, label: 'الخصوصية والشروط', color: 'text-amber-200', onClick: () => { setShowPrivacyPolicy(true); setShowSidebar(false); } },
                    { icon: ShieldAlert, label: 'إخلاء المسؤولية', color: 'text-red-400', onClick: () => { setShowDisclaimer(true); setShowSidebar(false); } },
                    { icon: Mail, label: 'اتصل بنا', color: 'text-blue-400', onClick: () => { setShowContactUs(true); setShowSidebar(false); } },
                    { 
                      icon: Play, 
                      label: 'تطبيق بصيرة للجوال (APK)', 
                      color: 'text-green-400', 
                      onClick: () => { setShowMobileGuide(true); setShowSidebar(false); },
                      developerOnly: true
                    },
                  ].filter(item => !item.developerOnly || user?.email === 'abuahmad.2003sudan@gmail.com').map((item, i) => (
                    <motion.button 
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + (i * 0.03) }}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all border border-transparent hover:border-amber-500/10 ${theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium tracking-tight">{item.label}</span>
                    </motion.button>
                  ))}

                  <div className="mt-8 px-4">
                    <AdSense slot="sidebar_native" theme={theme} />
                  </div>
                </div>

                <div className="px-2">
                  <AdSense slot="sidebar_bottom" theme={theme} className="opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex-none pt-8">
                <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
                  <p className="small-caps text-gray-600 mb-3">النظام الحالي</p>
                  <p className="text-sm font-serif italic">مدعوم بالذكاء الاصطناعي Gemini | بصيرة AI v1.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIEnginesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAIEnginesModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-2xl p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-300 shadow-2xl'}`}>
              <button onClick={() => setShowAIEnginesModal(false)} className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              <div className="text-right space-y-6" dir="rtl">
                <h2 className="text-3xl font-serif italic luxury-text-gradient">محركات الذكاء الاصطناعي في "بصيرة"</h2>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <h3 className="font-bold text-amber-500 mb-2">Gemini 3 Flash (الأساسي)</h3>
                    <p className="text-sm text-gray-400">يستخدم للتحليل السريع، استخراج النصوص من الصور، والبحث المباشر في الإنترنت. يتميز بالسرعة والدقة العالية في معالجة اللغات.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <h3 className="font-bold text-blue-500 mb-2">Gemini 2.5 Flash Audio (الصوتي)</h3>
                    <p className="text-sm text-gray-400">محرك متخصص في تحويل النتائج إلى صوت طبيعي (TTS) وفهم التسجيلات الصوتية بدقة متناهية.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <h3 className="font-bold text-green-500 mb-2">Google Grounding</h3>
                    <p className="text-sm text-gray-400">تقنية تربط إجابات الذكاء الاصطناعي بمصادر حقيقية من الويب والخرائط لضمان عدم وجود "هلوسة" في المعلومات القانونية.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreferencesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreferencesModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-xl p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}>
              <button onClick={() => setShowPreferencesModal(false)} className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              <div className="text-right space-y-8" dir="rtl">
                <h2 className="text-3xl font-serif italic luxury-text-gradient">تفضيلات النظام</h2>
                
                <div className="space-y-4">
                  <p className="small-caps text-gray-500">اللغة المفضلة</p>
                  <div className="flex gap-3">
                    {['ar', 'en'].map(l => (
                      <button 
                        key={l}
                        onClick={() => setLang(l as any)}
                        className={`flex-1 py-4 rounded-2xl border font-bold transition-all ${lang === l ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-gray-400'}`}
                      >
                        {l === 'ar' ? 'العربية' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="small-caps text-gray-500">النطاق القانوني</p>
                  <select 
                    value={localLaw}
                    onChange={(e) => setLocalLaw(e.target.value)}
                    className={`w-full p-5 rounded-2xl border font-bold transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    <option value="Global">🌍 {lang === 'ar' ? 'قوانين عالمية' : 'Global Laws'}</option>
                    <option value="Algeria">🇩🇿 {lang === 'ar' ? 'الجزائر' : 'Algeria'}</option>
                    <option value="Bahrain">🇧🇭 {lang === 'ar' ? 'البحرين' : 'Bahrain'}</option>
                    <option value="Comoros">🇰🇲 {lang === 'ar' ? 'جزر القمر' : 'Comoros'}</option>
                    <option value="Djibouti">🇩🇯 {lang === 'ar' ? 'جيبوتي' : 'Djibouti'}</option>
                    <option value="Egypt">🇪🇬 {lang === 'ar' ? 'مصر' : 'Egypt'}</option>
                    <option value="Iraq">🇮🇶 {lang === 'ar' ? 'العراق' : 'Iraq'}</option>
                    <option value="Jordan">🇯🇴 {lang === 'ar' ? 'الأردن' : 'Jordan'}</option>
                    <option value="Kuwait">🇰🇼 {lang === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                    <option value="Lebanon">🇱🇧 {lang === 'ar' ? 'لبنان' : 'Lebanon'}</option>
                    <option value="Libya">🇱🇾 {lang === 'ar' ? 'ليبيا' : 'Libya'}</option>
                    <option value="Mauritania">🇲🇷 {lang === 'ar' ? 'موريتانيا' : 'Mauritania'}</option>
                    <option value="Morocco">🇲🇦 {lang === 'ar' ? 'المغرب' : 'Morocco'}</option>
                    <option value="Oman">🇴🇲 {lang === 'ar' ? 'عمان' : 'Oman'}</option>
                    <option value="Palestine">🇵🇸 {lang === 'ar' ? 'فلسطين' : 'Palestine'}</option>
                    <option value="Qatar">🇶🇦 {lang === 'ar' ? 'قطر' : 'Qatar'}</option>
                    <option value="Saudi Arabia">🇸🇦 {lang === 'ar' ? 'السعودية' : 'Saudi Arabia'}</option>
                    <option value="Somalia">🇸🇴 {lang === 'ar' ? 'الصومال' : 'Somalia'}</option>
                    <option value="Sudan">🇸🇩 {lang === 'ar' ? 'السودان' : 'Sudan'}</option>
                    <option value="Syria">🇸🇾 {lang === 'ar' ? 'سوريا' : 'Syria'}</option>
                    <option value="Tunisia">🇹🇳 {lang === 'ar' ? 'تونس' : 'Tunisia'}</option>
                    <option value="UAE">🇦🇪 {lang === 'ar' ? 'الإمارات' : 'UAE'}</option>
                    <option value="Yemen">🇾🇪 {lang === 'ar' ? 'اليمن' : 'Yemen'}</option>
                    <option value="USA">🇺🇸 {lang === 'ar' ? 'الولايات المتحدة' : 'USA'}</option>
                  </select>
                </div>

                <button 
                  onClick={() => setShowPreferencesModal(false)}
                  className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all"
                >
                  حفظ التفضيلات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSubscriptionModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }} 
              className={`relative w-full max-w-4xl p-12 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowSubscriptionModal(false)} className="absolute top-8 left-8 p-3 hover:bg-white/5 rounded-full transition-all"><X className="w-6 h-6" /></button>
              
              <div className="text-center space-y-12">
                <div className="inline-block p-4 bg-amber-500/10 rounded-3xl mb-4">
                  <Crown className="w-12 h-12 text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-5xl font-serif italic luxury-text-gradient">الاشتراك الملكي - Royal Membership</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                  {lang === 'ar' 
                    ? "افتح آفاقاً جديدة مع العضوية الملكية. وصول غير محدود، أولوية في المعالجة، ودعم لجميع القوانين العربية والعالمية." 
                    : "Unlock new horizons with Royal Membership. Unlimited access, priority processing, and support for all Arab and international laws."}
                </p>

                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 no-scrollbar snap-x snap-mandatory pb-8 px-4 -mx-4 scroll-smooth">
                  {/* Free Plan */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={`flex-shrink-0 w-[85vw] sm:w-72 md:w-64 lg:w-full p-8 rounded-[40px] border snap-center transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'} flex flex-col`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">{lang === 'ar' ? 'الخطة المجانية' : 'Free Plan'}</h3>
                      <ShieldAlert className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-3xl font-black mb-8">$0 <span className="text-sm font-normal opacity-50">/ {lang === 'ar' ? 'أسبوع' : 'week'}</span></p>
                    <ul className="text-sm text-gray-400 space-y-4 mb-10 flex-1 text-right" dir="rtl">
                      <li className="flex items-center gap-3 justify-end"><span>10 عمليات تدقيق أسبوعياً</span> <Check className="w-4 h-4 text-green-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>دعم القوانين الأساسية</span> <Check className="w-4 h-4 text-green-500" /></li>
                      <li className="flex items-center gap-3 justify-end opacity-40"><span>لا يوجد دعم VIP</span> <X className="w-4 h-4 text-red-500" /></li>
                    </ul>
                    <button disabled className={`w-full py-4 rounded-2xl border font-bold text-sm ${theme === 'dark' ? 'border-white/10 text-gray-500' : 'border-slate-200 text-slate-400'}`}>{lang === 'ar' ? 'خطتك الحالية' : 'Current Plan'}</button>
                  </motion.div>

                  {/* Monthly Plan */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className={`flex-shrink-0 w-[85vw] sm:w-72 md:w-64 lg:w-full p-8 rounded-[40px] border border-amber-500/30 bg-amber-500/5 flex flex-col relative overflow-hidden group snap-center transition-all duration-500 ${theme === 'light' ? 'shadow-xl shadow-amber-500/10 border-amber-200' : ''}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-xl font-bold text-amber-500">{lang === 'ar' ? 'الاشتراك الشهري' : 'Monthly'}</h3>
                      <Zap className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black mb-8 relative z-10">$12 <span className="text-sm font-normal opacity-50">/ {lang === 'ar' ? 'شهر' : 'month'}</span></p>
                    <ul className="text-sm text-gray-300 space-y-4 mb-10 flex-1 text-right relative z-10" dir="rtl">
                      <li className="flex items-center gap-3 justify-end"><span>عمليات تدقيق غير محدودة</span> <Sparkles className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>أولوية في محركات الذكاء</span> <Sparkles className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>تحميل التقارير بصيغة PDF</span> <Sparkles className="w-4 h-4 text-amber-500" /></li>
                    </ul>
                    <button 
                      onClick={() => {
                        if (!user) { setShowLoginPrompt(true); return; }
                        setPaymentPlan('monthly');
                        setShowPaymentWindow(true);
                      }}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black hover:shadow-lg hover:shadow-amber-500/40 transition-all text-sm relative z-10"
                    >
                      {lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                    </button>
                  </motion.div>

                  {/* Yearly Plan ($77) */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className={`flex-shrink-0 w-[85vw] sm:w-72 md:w-64 lg:w-full p-8 rounded-[40px] border border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent flex flex-col snap-center transition-all duration-500 ${theme === 'light' ? 'shadow-2xl shadow-amber-500/20 border-amber-300' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-amber-400">{lang === 'ar' ? 'الاشتراك السنوي' : 'Yearly'}</h3>
                      <Crown className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black mb-8">$77 <span className="text-sm font-normal opacity-50">/ {lang === 'ar' ? 'سنة' : 'year'}</span></p>
                    <ul className="text-sm text-gray-300 space-y-4 mb-10 flex-1 text-right" dir="rtl">
                      <li className="flex items-center gap-3 justify-end"><span>كل ميزات الشهري</span> <Crown className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>توفير 45% سنوياً</span> <Crown className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>أرشفة سحابية ملكية</span> <Crown className="w-4 h-4 text-amber-500" /></li>
                    </ul>
                    <button 
                      onClick={() => {
                        if (!user) { setShowLoginPrompt(true); return; }
                        setPaymentPlan('yearly');
                        setShowPaymentWindow(true);
                      }}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black hover:shadow-lg hover:shadow-amber-500/40 transition-all text-sm"
                    >
                      {lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                    </button>
                  </motion.div>

                  {/* Royal Annual ($88) */}
                  <motion.div 
                    whileHover={{ y: -15 }}
                    className={`flex-shrink-0 w-[85vw] sm:w-72 md:w-64 lg:w-full p-8 rounded-[40px] border-2 border-amber-500 bg-amber-500/10 flex flex-col relative overflow-hidden snap-center transition-all duration-500 ${theme === 'light' ? 'shadow-2xl shadow-amber-600/30' : ''}`}
                  >
                    <div className="absolute top-0 right-0 p-3 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Elite</div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-amber-500">{lang === 'ar' ? 'الاشتراك الملكي السنوي' : 'Royal Annual'}</h3>
                      <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-3xl font-black mb-8">$88 <span className="text-sm font-normal opacity-50">/ {lang === 'ar' ? 'سنة' : 'year'}</span></p>
                    <ul className="text-sm text-gray-300 space-y-4 mb-10 flex-1 text-right" dir="rtl">
                      <li className="flex items-center gap-3 justify-end"><span>كل ميزات السنوي</span> <Star className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>دعم فني مباشر VIP</span> <Star className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>تقارير قانونية معمقة</span> <Star className="w-4 h-4 text-amber-500" /></li>
                      <li className="flex items-center gap-3 justify-end"><span>رؤى "بصيرة" الاستباقية</span> <Star className="w-4 h-4 text-amber-500" /></li>
                    </ul>
                    <button 
                      onClick={() => {
                        if (!user) { setShowLoginPrompt(true); return; }
                        setPaymentPlan('yearly_premium');
                        setShowPaymentWindow(true);
                      }}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black hover:shadow-xl hover:shadow-amber-500/50 transition-all text-sm"
                    >
                      {lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                    </button>
                  </motion.div>
                </div>

                {/* Developer Reset Option */}
                {user?.email === 'abuahmad.2003sudan@gmail.com' && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <button 
                      onClick={async () => {
                        await setDoc(doc(db, 'users', user.uid), {
                          subscription: { plan: 'free', expiresAt: null },
                          usage: { count: 0, lastResetAt: serverTimestamp() }
                        }, { merge: true });
                        showNotify(lang === 'ar' ? 'تم تصفير الحساب ومعلومات الدفع بنجاح' : 'Account and payment info reset successfully', 'success');
                        setShowSubscriptionModal(false);
                      }}
                      className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors"
                    >
                      {lang === 'ar' ? 'تصفير بيانات الدفع والاشتراك (للمطور)' : 'Reset Payment & Subscription (Dev Only)'}
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Secure Payment via Google Pay, Apple Pay, Stripe & Binance Pay</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Window Simulation */}
      <AnimatePresence>
        {showPaymentWindow && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentWindow(false)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }} 
              className={`relative w-full max-w-lg p-10 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-serif italic">{lang === 'ar' ? 'نافذة الدفع الآمنة' : 'Secure Payment'}</h3>
                </div>
                <button onClick={() => setShowPaymentWindow(false)} className="p-2 hover:bg-white/5 rounded-full transition-all"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'الخطة المختارة' : 'Selected Plan'}</span>
                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest">
                      {paymentPlan === 'yearly' || paymentPlan === 'yearly_premium' ? (lang === 'ar' ? 'سنوي' : 'Yearly') : (lang === 'ar' ? 'شهري' : 'Monthly')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black">
                      ${paymentPlan === 'yearly_premium' ? '88.00' : (paymentPlan === 'yearly' ? '77.00' : '12.00')}
                    </span>
                    <span className="text-xs text-gray-500">USD</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Global Payment Options - Modern Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'binance', label: 'Binance Pay', icon: <Zap className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20' },
                      { id: 'visa', label: 'Visa / Master', icon: <CreditCard className="w-6 h-6 text-blue-500" />, color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
                      { id: 'paypal', label: 'PayPal', icon: <Mail className="w-6 h-6 text-blue-600" />, color: 'bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20' },
                      { id: 'apple', label: 'Apple Pay', icon: <UserCircle className="w-6 h-6 text-gray-400" />, color: 'bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20' },
                    ].map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSimulatedPayment(method.label)}
                        disabled={isProcessingPayment}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all disabled:opacity-50 ${method.color}`}
                      >
                        {method.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                      {lang === 'ar' ? 'أو الدفع عبر العملات الرقمية' : 'Or pay via Cryptocurrencies'}
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSimulatedPayment('USDT (TRC20)')}
                      disabled={isProcessingPayment}
                      className="w-full py-5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-3xl font-black uppercase tracking-widest hover:bg-green-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <Zap className="w-5 h-5" />
                      USDT (TRC20)
                    </motion.button>
                  </div>
                </div>

                {isProcessingPayment && (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-amber-500 animate-pulse uppercase tracking-widest">
                      {lang === 'ar' ? 'جاري معالجة الدفع الملكي...' : 'Processing Royal Payment...'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginPrompt(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className={`relative w-full max-w-md p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-serif italic mb-2 text-center">{lang === 'ar' ? (isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول') : (isSignUp ? 'Create Account' : 'Login')}</h2>
              <p className="text-gray-400 mb-8 text-xs leading-relaxed text-center">
                {lang === 'ar' 
                  ? "انضم إلى نخبة المستخدمين واستمتع بمميزات التدقيق الذكي والأرشفة السحابية." 
                  : "Join the elite users and enjoy Smart Audit features and cloud archiving."}
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border transition-all text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`}
                  />
                  <input 
                    type="password" 
                    placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border transition-all text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`}
                  />
                </div>

                <button 
                  onClick={loginWithEmail}
                  className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:scale-[1.02] transition-all text-sm"
                >
                  {lang === 'ar' ? (isSignUp ? 'إنشاء حساب' : 'دخول') : (isSignUp ? 'Sign Up' : 'Login')}
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'أو عبر' : 'OR VIA'}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={loginWithGoogle}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-xs font-bold ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button 
                    onClick={loginWithApple}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-xs font-bold ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.79 17.3 3.8 12.4 5.85 8.9c1.02-1.74 2.67-2.85 4.55-2.89 1.4-.03 2.36.44 3.4.44 1.07 0 2.26-.56 3.8-.4 1.96.16 3.44 1.1 4.22 2.53-3.84 2.3-3.23 7.27.72 9.3-.36 1.02-.9 2.04-1.49 2.4zM14.97 3.03c-.02 2.13-1.85 3.85-3.84 3.74.02-2.1 1.9-3.92 3.84-3.74z" />
                    </svg>
                    Apple
                  </button>
                </div>

                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-xs text-gray-500 hover:text-amber-500 transition-all mt-4"
                >
                  {lang === 'ar' 
                    ? (isSignUp ? 'لديك حساب بالفعل؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساباً جديداً') 
                    : (isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up')}
                </button>
              </div>

              <button onClick={() => setShowLoginPrompt(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-gray-500"><X className="w-4 h-4" /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMobileGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileGuide(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto p-12 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowMobileGuide(false)} className="absolute top-8 left-8 p-3 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-8 text-right" dir="rtl">
                <div className="space-y-2 text-center">
                  <h2 className="text-4xl font-serif italic luxury-text-gradient">تحويل "بصيرة" إلى تطبيق موبايل (APK)</h2>
                  <p className="text-sm text-gray-500">دليل شامل لتحويل موقعك إلى تطبيق أندرويد احترافي</p>
                </div>

                <div className="space-y-6">
                  <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className="text-xl font-bold text-amber-500 mb-4">الخيار الأول: استخدام FlutLab.io (الأسهل)</h3>
                    <ol className="space-y-4 text-sm">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 font-bold">1</span>
                        <p>افتح موقع <a href="https://flutlab.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">FlutLab.io</a> وأنشئ مشروعاً جديداً (Flutter Web View).</p>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 font-bold">2</span>
                        <p>استخدم الكود التالي في ملف <code>main.dart</code> لربط موقعك مباشرة:</p>
                      </li>
                    </ol>
                    <div className="mt-4 p-4 bg-black/40 rounded-xl font-mono text-[10px] text-green-400 overflow-x-auto">
                      <pre>{`import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() => runApp(MaterialApp(home: BasiraApp()));

class BasiraApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebView(
          initialUrl: 'https://ais-pre-q74a5palogc5zx7zk5xcm4-259287797225.europe-west1.run.app',
        ),
      ),
    );
  }
}
`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy & Terms Modal (Crucial for Google AdSense) */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyPolicy(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto p-10 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowPrivacyPolicy(false)} className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* English Version */}
                <div className="space-y-8 text-left border-l border-white/10 pl-12" dir="ltr">
                  <h2 className="text-3xl font-serif italic text-amber-500">Privacy Policy</h2>
                  
                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">1. About the Site</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      "Basira" is an advanced AI-powered platform for legal document analysis, risk extraction, and contract summarization. Our goal is to simplify legal information and increase legal awareness for everyone.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">2. Data Collection</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      We collect limited information such as email via Google Login and documents you upload for analysis. Documents are processed in real-time and are not stored permanently unless saved in your personal history (Archive) for your reference. We do not sell your data.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">3. Google AdSense & Cookies</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. 
                      <br/><br/>
                      Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" className="text-amber-500 underline">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" className="text-amber-500 underline">www.aboutads.info</a>.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">4. Your Rights (GDPR/CCPA)</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      You have the right to access, correct, or delete your personal data. You can delete your account and all associated data at any time through the settings menu. We respect your privacy and comply with international data protection standards.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">5. Security Measures</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      We implement robust security protocols to protect your data during transmission and processing. All interactions with our AI models are encrypted.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">6. Third-Party Services</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      We use Firebase for authentication and database services, and Google Gemini for AI analysis. These services have their own privacy policies which we encourage you to review.
                    </p>
                  </section>
                </div>

                {/* Arabic Version */}
                <div className="space-y-8 text-right" dir="rtl">
                  <h2 className="text-3xl font-serif italic text-amber-500">سياسة الخصوصية</h2>
                  
                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">1. حول الموقع</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      "بصيرة" هي منصة متقدمة مدعومة بالذكاء الاصطناعي لتحليل الوثائق القانونية، واستخراج المخاطر، وتلخيص العقود. هدفنا هو تبسيط المعلومات القانونية وزيادة الوعي القانوني للجميع.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">2. جمع البيانات</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      نجمع معلومات محدودة مثل البريد الإلكتروني عبر تسجيل الدخول بجوجل والوثائق التي ترفعها للتحليل. يتم معالجة الوثائق في الوقت الفعلي ولا يتم تخزينها بشكل دائم إلا إذا قمت بحفظها في سجلك الشخصي (الأرشيف) لرجوعك إليها. نحن لا نبيع بياناتك.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">3. جوجل أدسنس وملفات تعريف الارتباط</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      نحن نستخدم Google AdSense لعرض الإعلانات. تستخدم Google، كمورد خارجي، ملفات تعريف الارتباط لعرض الإعلانات على موقعنا. يتيح استخدام Google لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض الإعلانات لمستخدمينا بناءً على زيارتهم لمواقعنا و/أو المواقع الأخرى على الإنترنت. 
                      <br/><br/>
                      يمكن للمستخدمين اختيار عدم قبول الإعلانات المخصصة من خلال زيارة <a href="https://www.google.com/settings/ads" target="_blank" className="text-amber-500 underline">إعدادات الإعلانات</a>. بدلاً من ذلك، يمكنك اختيار عدم قبول استخدام مورد خارجي لملفات تعريف الارتباط للإعلانات المخصصة من خلال زيارة <a href="https://www.aboutads.info" target="_blank" className="text-amber-500 underline">www.aboutads.info</a>.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">4. حقوقك (GDPR/CCPA)</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها. يمكنك حذف حسابك وجميع البيانات المرتبطة به في أي وقت من خلال قائمة الإعدادات. نحن نحترم خصوصيتك ونلتزم بالمعايير الدولية لحماية البيانات.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">5. الإجراءات الأمنية</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      نحن نطبق بروتوكولات أمنية قوية لحماية بياناتك أثناء النقل والمعالجة. جميع التفاعلات مع نماذج الذكاء الاصطناعي لدينا مشفرة.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xl font-bold text-amber-500/80">6. خدمات الطرف الثالث</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      نستخدم Firebase للمصادقة وخدمات قاعدة البيانات، و Google Gemini للتحليل بالذكاء الاصطناعي. هذه الخدمات لها سياسات خصوصية خاصة بها نشجعك على مراجعتها.
                    </p>
                  </section>
                </div>
              </div>

              <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center">
                <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">
                  Last Updated: March 2026 | آخر تحديث: مارس 2026
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Us Modal (Required for AdSense) */}
      <AnimatePresence>
        {showContactUs && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactUs(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md p-10 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowContactUs(false)} className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-8 text-center">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10 text-amber-500" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif italic text-amber-500">اتصل بنا | Contact Us</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    {lang === 'ar' ? 'نحن هنا للإجابة على استفساراتك ومساعدتك.' : 'We are here to answer your inquiries and help you.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <a 
                    href="mailto:abuahmad.2003sudan@gmail.com" 
                    className="flex items-center justify-center gap-3 w-full py-5 bg-amber-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>abuahmad.2003sudan@gmail.com</span>
                  </a>
                  
                  <a 
                    href="https://wa.me/201107945739" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-5 bg-green-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp: 01107945739</span>
                  </a>
                </div>

                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {lang === 'ar' ? 'نرد عادةً خلال 24 ساعة' : 'We usually respond within 24 hours'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Identity Modal */}
      <AnimatePresence>
        {showBrandModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBrandModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={`relative w-full max-w-2xl p-12 rounded-[40px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowBrandModal(false)} className="absolute top-8 left-8 p-3 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-8 text-center">
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                        <Eye className="w-16 h-16 text-amber-500 animate-pulse-gold" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-serif italic luxury-text-gradient">هوية "عين الذهب"</h2>
                  <p className="text-sm text-gray-500">فلسفة التصميم والرمزية</p>
                </div>

                <div className="space-y-6 text-right" dir="rtl">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
                    تم تصميم أيقونة "عين الذهب" لتكون رمزاً للبصيرة النافذة والذكاء المطلق. الدائرة الذهبية تمثل الكمال واللانهاية، بينما العين في المنتصف ترمز إلى قدرة الذكاء الاصطناعي على رؤية ما وراء البيانات.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-amber-500 font-bold mb-1">اللون الذهبي</p>
                      <p className="text-xs text-gray-500">يرمز للفخامة، القيمة، والتميز التقني.</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-amber-500 font-bold mb-1">الخلفية الداكنة</p>
                      <p className="text-xs text-gray-500">ترمز للغموض، العمق، والاحترافية.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Monetization Guide Modal */}
      <AnimatePresence>
        {showMonetizationGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMonetizationGuide(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 rounded-[50px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowMonetizationGuide(false)} className="absolute top-8 left-8 p-3 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold tracking-widest uppercase">
                    دليل الربح والنشر العالمي
                  </div>
                  <h2 className="text-5xl font-serif italic tracking-tighter">كيف تربح المال من <span className="text-amber-500">بصيرة</span>؟</h2>
                  <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    لقد قمنا بتجهيز التطبيق ليكون منصة ربحية متكاملة. إليك الخطوات لتحويل هذا المشروع إلى مصدر دخل حقيقي:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold">1. نموذج الربح الهجين (Hybrid)</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      التطبيق يجمع بين الربح من الإعلانات (للمستخدمين المجانيين) والاشتراكات الملكية (للمحترفين).
                    </p>
                    <ul className="space-y-2 text-xs text-amber-500/60 font-bold">
                      <li>• إعلانات AdSense: تظهر للمستخدمين في الخطة المجانية.</li>
                      <li>• الاشتراكات الملكية: تمنحك دخلاً ثابتاً ومستقراً من المستخدمين الجادين.</li>
                    </ul>
                  </div>

                  <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold">2. إعلانات Google AdSense</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      لقد وضعنا مساحات إعلانية (AdSpace) تظهر تلقائياً. كل ما عليك هو وضع كود AdSense الخاص بك في ملف <code>index.html</code>.
                    </p>
                    <div className="p-4 bg-black/20 rounded-xl font-mono text-[10px] text-blue-400 border border-blue-500/10">
                      {`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous"></script>`}
                    </div>
                  </div>
                </div>

                <div className={`p-10 rounded-[40px] border border-green-500/20 bg-green-500/5`}>
                  <h3 className="text-2xl font-serif italic mb-6 text-green-500">3. خطوات النشر (Deployment)</h3>
                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div>
                        <p className="font-bold mb-1">ارفع الكود على GitHub</p>
                        <p className="text-sm text-gray-500">قم بإنشاء مستودع جديد وارفع كافة ملفات المشروع.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div>
                        <p className="font-bold mb-1">استخدم Vercel أو Netlify</p>
                        <p className="text-sm text-gray-500">اربط حساب GitHub الخاص بك بهذه المنصات للنشر بضغطة زر واحدة مجاناً.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-bold mb-1">رابط تطبيقك الحالي</p>
                        <p className="text-sm text-gray-500">رابط المعاينة الحالي هو: <br/>
                          <code className="text-amber-500 break-all">https://ais-pre-q74a5palogc5zx7zk5xcm4-259287797225.europe-west1.run.app</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-10 rounded-[40px] border border-blue-500/20 bg-blue-500/5 mb-8`}>
                  <h3 className="text-2xl font-serif italic mb-6 text-blue-500">4. كيف تحصل على مفتاح ذكاء اصطناعي مجاني؟</h3>
                  <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                    <p>
                      للحصول على مفتاح Gemini API مجاني يدعم آلاف الطلبات، اتبع الخطوات التالية:
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>توجه إلى <a href="https://ai.google.dev" target="_blank" className="text-blue-500 underline">Google AI Studio</a>.</li>
                      <li>قم بتسجيل الدخول بحساب Google الخاص بك.</li>
                      <li>اضغط على "Get API Key" في القائمة الجانبية.</li>
                      <li>قم بإنشاء مفتاح جديد (Create API Key).</li>
                      <li>انسخ المفتاح وضعه في إعدادات التطبيق (Environment Variables) تحت اسم <code>GEMINI_API_KEY</code>.</li>
                    </ol>
                    <p className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-xs italic">
                      ملاحظة: المفتاح المجاني كافٍ جداً للبداية، وإذا زاد عدد الزوار بشكل هائل، يمكنك ترقيته أو استخدام مفاتيح متعددة.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setShowMonetizationGuide(false)}
                    className="px-12 py-5 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all"
                  >
                    فهمت، لنبدأ جني الأرباح!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Magic Burst Effect */}
      <AnimatePresence>
        {showMagicBurst && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-60 h-60 rounded-full bg-gradient-to-tr from-amber-500/40 to-white/20 blur-3xl"
            />
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 2.5, 0],
                  x: (Math.random() - 0.5) * 1600,
                  y: (Math.random() - 0.5) * 1600,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 1080
                }}
                transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.2 }}
                className="absolute"
              >
                <Brain 
                  className="w-10 h-10 text-amber-400 fill-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,1)]" 
                  strokeWidth={0}
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 1.5 }}
              className="absolute w-full h-full bg-amber-500/5 blur-3xl"
            />
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[160px] rounded-full animate-pulse transition-colors duration-1000 ${theme === 'dark' ? 'bg-orange-600/10' : 'bg-orange-200/10'}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[160px] rounded-full animate-pulse transition-colors duration-1000 ${theme === 'dark' ? 'bg-purple-600/10' : 'bg-purple-200/10'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-[30%] left-[40%] w-[30%] h-[30%] blur-[120px] rounded-full transition-colors duration-1000 ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-200/5'}`} />
        
        {/* Floating Particles Simulation - Optimized */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-20' : 'opacity-30'}`}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -800],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
              className={`absolute bottom-0 rounded-full blur-md ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-500/5'}`}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
          {/* Magic Sparkles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 10,
              }}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-500/30' : 'text-purple-500/20'}`} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full mx-auto px-6 py-8">
        {/* Legal News Ticker */}
        {legalNews.length > 0 && (
          <div className="mb-8 h-10 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center overflow-hidden">
            <div className="flex-none px-4 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest h-full flex items-center border-r border-amber-500/10">
              أخبار قانونية
            </div>
            <div className="flex-1 flex items-center whitespace-nowrap overflow-hidden">
              <div className="flex animate-marquee hover:pause">
                {legalNews.map((news, i) => (
                  <a 
                    key={i} 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 text-[11px] text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <div className="w-1 h-1 rounded-full bg-amber-500/30" />
                    {news.title}
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {legalNews.map((news, i) => (
                  <a 
                    key={`dup-${i}`} 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 text-[11px] text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <div className="w-1 h-1 rounded-full bg-amber-500/30" />
                    {news.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top APK-style Navigation Bars */}
        <AdSpace position="top" />
        
        <div className="flex overflow-x-auto gap-4 mb-12 no-scrollbar pb-4">
          <button 
            onClick={() => setShowAIEnginesModal(true)}
            className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
          >
            <Brain className="w-4 h-4" /> محركات AI
          </button>
          <button 
            onClick={() => setShowSidebar(true)}
            className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
          >
            <History className="w-4 h-4" /> الأرشيف
          </button>
          <button 
            onClick={() => setShowPreferencesModal(true)}
            className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
          >
            <Settings2 className="w-4 h-4" /> التفضيلات
          </button>
        </div>

        {/* Navigation Rail / Header */}
        <header className={`flex items-center justify-between mb-20 backdrop-blur-3xl p-6 rounded-[40px] border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white/95 border-slate-300 shadow-lg shadow-slate-200/20'}`}>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowSidebar(true)}
              className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 sm:gap-8">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                animate={{ 
                  boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 60px rgba(245,158,11,0.5)", "0 0 20px rgba(245,158,11,0.2)"],
                  filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-tr from-amber-400 via-amber-600 to-amber-800 rounded-[24px] sm:rounded-[32px] flex items-center justify-center shadow-2xl shadow-amber-500/50 relative overflow-hidden group border-2 border-white/20"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Brain className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] z-10" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white/20 blur-xl rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-black/20 blur-xl rounded-full" />
                {/* Extra Luxury Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-50" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-tighter uppercase luxury-text-gradient drop-shadow-2xl">
                  {lang === 'ar' ? 'بصيرة AI' : 'Basira AI'}
                </h1>
                <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[7px] sm:text-[10px] md:text-[11px] font-black tracking-[0.1em] sm:tracking-[0.3em] uppercase mt-1 sm:mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-2 h-2 sm:w-4 sm:h-4 text-amber-500 animate-pulse" />
                    {lang === 'ar' ? 'المدقق القانوني الملكي v3.5' : 'Royal Legal Auditor v3.5'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Global Stop Audio Button */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={stopAudio}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-all"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">{lang === 'ar' ? 'إيقاف' : 'Stop'}</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Royal Subscription Button - Combined & Responsive */}
              <button 
                onClick={() => setShowSubscriptionModal(true)}
                className="relative group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                <span className="text-[8px] sm:text-[10px] font-black text-black uppercase tracking-widest hidden sm:block">
                  {lang === 'ar' ? 'العضوية' : 'Royal'}
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </button>

              {/* Luxury Theme Switcher */}
              <div className="relative flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all shadow-2xl z-[100] relative ${
                    theme === 'dark' 
                      ? 'bg-zinc-900 border-amber-500/30 text-amber-500 shadow-amber-500/20' 
                      : 'bg-white border-slate-200 text-amber-600 shadow-slate-200'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-6 sm:h-6" /> : <Moon className="w-4 h-4 sm:w-6 sm:h-6" />}
                </motion.button>
                <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-20 transition-all ${theme === 'dark' ? 'bg-amber-500' : 'bg-slate-400'}`} />
              </div>
            </div>
        </header>

        <AdSense slot="top_main_banner" theme={theme} className="mb-12" />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-0">
          {/* Left Column: Input Control Center */}
          <div className="lg:col-span-7 space-y-8">
            <section className={`rounded-[40px] p-8 backdrop-blur-3xl relative overflow-hidden group transition-all ${theme === 'dark' ? 'bg-white/5' : 'bg-white border border-slate-200 shadow-lg shadow-slate-200/30'}`}>
              {/* Golden Side Glows */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-all" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-amber-600">
                  <Eye className="w-6 h-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                  <span className="text-xl font-black uppercase tracking-[0.3em] text-amber-600 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">{lang === 'ar' ? 'مركز التدقيق القانوني الذكي' : 'Smart Legal Audit Center'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{lang === 'ar' ? 'تحقق قانوني عميق' : 'Deep Legal Verification'}</span>
                  </div>
                  { (image || audioBlob || documentFile) && (
                    <button 
                      onClick={() => { setImage(null); setAudioBlob(null); setAudioBase64(null); setDocumentFile(null); }}
                      className={`text-xs font-bold flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}
                    >
                      <X className="w-3 h-3" /> مسح
                    </button>
                  )}
                </div>
              </div>

              <div className="relative p-[2px] rounded-[32px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 shadow-xl shadow-purple-500/10 mb-6 group">
                <div className={`rounded-[30px] p-2 transition-all ${theme === 'dark' ? 'bg-black/40' : 'bg-white border border-slate-300 shadow-inner'}`}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={lang === 'ar' ? "الصق نص العقد، أو ارفع صورة للوثيقة، أو صف الموقف القانوني..." : "Paste contract text, upload document image, or describe the legal situation..."}
                    className={`w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-medium resize-none min-h-[200px] leading-relaxed transition-all ${theme === 'dark' ? 'placeholder:text-gray-700 text-white' : 'placeholder:text-slate-400 text-slate-900'}`}
                  />
                </div>
                {/* Scanning Animation during loading */}
                {loading && (
                  <>
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent z-20 shadow-[0_0_20px_rgba(245,158,11,1)]"
                    />
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-amber-500/5 z-10 pointer-events-none"
                    />
                    {/* Quantum Particles Simulation */}
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: Math.random() * 100 + '%', 
                          y: Math.random() * 100 + '%',
                          scale: 0,
                          opacity: 0 
                        }}
                        animate={{ 
                          y: [null, Math.random() * 100 + '%'],
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{ 
                          duration: Math.random() * 3 + 2, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                        className="absolute w-1 h-1 bg-amber-500 rounded-full blur-[1px] z-10"
                      />
                    ))}
                  </>
                )}
              </div>
              
              {/* Main Action Button - Moved here for better UX */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <select 
                  value={localLaw}
                  onChange={(e) => setLocalLaw(e.target.value)}
                  className={`px-6 py-4 rounded-[32px] border text-sm font-bold transition-all outline-none md:w-1/3 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
                >
                  <option value="Global">{lang === 'ar' ? '🌍 قوانين عالمية' : '🌍 Global Laws'}</option>
                  <option value="Saudi Arabia">{lang === 'ar' ? '🇸🇦 المملكة العربية السعودية' : '🇸🇦 Saudi Arabia'}</option>
                  <option value="Egypt">{lang === 'ar' ? '🇪🇬 جمهورية مصر العربية' : '🇪🇬 Egypt'}</option>
                  <option value="UAE">{lang === 'ar' ? '🇦🇪 الإمارات العربية المتحدة' : '🇦🇪 UAE'}</option>
                  <option value="Sudan">{lang === 'ar' ? '🇸🇩 جمهورية السودان' : '🇸🇩 Sudan'}</option>
                  <option value="Algeria">{lang === 'ar' ? '🇩🇿 الجزائر' : '🇩🇿 Algeria'}</option>
                  <option value="Bahrain">{lang === 'ar' ? '🇧🇭 البحرين' : '🇧🇭 Bahrain'}</option>
                  <option value="Comoros">{lang === 'ar' ? '🇰🇲 جزر القمر' : '🇰🇲 Comoros'}</option>
                  <option value="Djibouti">{lang === 'ar' ? '🇩🇯 جيبوتي' : '🇩🇯 Djibouti'}</option>
                  <option value="Iraq">{lang === 'ar' ? '🇮🇶 العراق' : '🇮🇶 Iraq'}</option>
                  <option value="Jordan">{lang === 'ar' ? '🇯🇴 الأردن' : '🇯🇴 Jordan'}</option>
                  <option value="Kuwait">{lang === 'ar' ? '🇰🇼 الكويت' : '🇰🇼 Kuwait'}</option>
                  <option value="Lebanon">{lang === 'ar' ? '🇱🇧 لبنان' : '🇱🇧 Lebanon'}</option>
                  <option value="Libya">{lang === 'ar' ? '🇱🇾 ليبيا' : '🇱🇾 Libya'}</option>
                  <option value="Mauritania">{lang === 'ar' ? '🇲🇷 موريتانيا' : '🇲🇷 Mauritania'}</option>
                  <option value="Morocco">{lang === 'ar' ? '🇲🇦 المغرب' : '🇲🇦 Morocco'}</option>
                  <option value="Oman">{lang === 'ar' ? '🇴🇲 سلطنة عمان' : '🇴🇲 Oman'}</option>
                  <option value="Palestine">{lang === 'ar' ? '🇵🇸 فلسطين' : '🇵🇸 Palestine'}</option>
                  <option value="Qatar">{lang === 'ar' ? '🇶🇦 قطر' : '🇶🇦 Qatar'}</option>
                  <option value="Somalia">{lang === 'ar' ? '🇸🇴 الصومال' : '🇸🇴 Somalia'}</option>
                  <option value="Syria">{lang === 'ar' ? '🇸🇾 سوريا' : '🇸🇾 Syria'}</option>
                  <option value="Tunisia">{lang === 'ar' ? '🇹🇳 تونس' : '🇹🇳 Tunisia'}</option>
                  <option value="Yemen">{lang === 'ar' ? '🇾🇪 اليمن' : '🇾🇪 Yemen'}</option>
                  <option value="USA">{lang === 'ar' ? '🇺🇸 الولايات المتحدة' : '🇺🇸 USA'}</option>
                </select>
                <button
                  onClick={() => {
                    if (!user) {
                      setShowLoginPrompt(true);
                      return;
                    }
                    if (loading) {
                      stopAnalysis();
                    } else {
                      analyzeContext();
                      setShowArrow(true);
                      setTimeout(() => setShowArrow(false), 8000);
                    }
                  }}
                  disabled={!loading && (!input.trim() && !image && !audioBase64 && !documentFile)}
                  className={`
                    flex-1 flex items-center justify-center gap-4 px-12 py-6 rounded-[32px] font-serif italic text-xl transition-all relative overflow-hidden group
                    ${!loading && (!input.trim() && !image && !audioBase64 && !documentFile)
                      ? 'bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5' 
                      : loading 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-2xl shadow-amber-500/40 hover:scale-[1.02] active:scale-95'}
                  `}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Square className="w-5 h-5 fill-current" />
                      <span>{lang === 'ar' ? 'إيقاف التحليل' : 'Stop Analysis'}</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                      {lang === 'ar' ? 'بدء التدقيق الذكي' : 'Start Intelligent Audit'}
                    </>
                  )}
                </button>
              </div>

              {/* Guidance Arrow */}
              <AnimatePresence>
                {showArrow && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col items-center gap-2 mb-8"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 animate-pulse">
                      {lang === 'ar' ? 'النتائج تظهر في الأسفل' : 'Results appear below'}
                    </span>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronDown className="w-8 h-8 text-amber-500" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Media Previews */}
              <div className="flex flex-wrap gap-4 mt-6">
                <AnimatePresence>
                  {image && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-xl shadow-orange-500/20"
                    >
                      <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setImage(null)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                  {documentFile && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl"
                    >
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-500 truncate max-w-[100px]">{documentFile.name}</span>
                        <span className="text-[8px] opacity-50">{documentFile.mimeType.split('/')[1].toUpperCase()}</span>
                      </div>
                      <button onClick={() => setDocumentFile(null)} className="p-1 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                  {audioBlob && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl"
                    >
                      <Waves className="w-5 h-5 text-orange-500 animate-pulse" />
                      <span className="text-xs font-bold text-orange-500">{lang === 'ar' ? 'تسجيل صوتي جاهز' : 'Voice Recording Ready'}</span>
                      <button onClick={() => { setAudioBlob(null); setAudioBase64(null); }} className="p-1 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar */}
              <div className={`flex flex-wrap items-center justify-between gap-4 mt-10 pt-8 border-t transition-all ${theme === 'dark' ? 'border-white/5' : 'border-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer p-4 rounded-2xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-sm hover:bg-slate-50'}`}>
                    <ImageIcon className={`w-6 h-6 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'}`} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  <label className={`cursor-pointer p-4 rounded-2xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-sm hover:bg-slate-50'}`}>
                    <FileText className={`w-6 h-6 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-amber-400' : 'text-slate-500 group-hover:text-amber-600'}`} />
                    <input type="file" accept=".pdf,.docx" onChange={handleDocumentUpload} className="hidden" />
                  </label>
                  
                  <button
                    onMouseDown={(e) => { e.preventDefault(); startRecording(); }}
                    onMouseUp={(e) => { e.preventDefault(); stopRecording(); }}
                    onMouseLeave={(e) => { e.preventDefault(); stopRecording(); }}
                    onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                    onTouchCancel={(e) => { e.preventDefault(); stopRecording(); }}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                      isRecording 
                      ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/40 animate-pulse' 
                      : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-300 shadow-sm hover:bg-slate-50'
                    }`}
                  >
                    {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />}
                    {isRecording && <span className="text-xs font-black uppercase tracking-widest text-white">{lang === 'ar' ? 'جاري التسجيل...' : 'Recording...'}</span>}
                  </button>

                  {/* Language & Voice Selection */}
                  <div className="relative group/fountain">
                    <div className={`flex p-1 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300 shadow-sm'}`}>
                      {/* Language Toggle */}
                      <div className="flex border-l border-white/10 ml-1 pl-1">
                        <button 
                          onClick={() => updatePreferences({ lang: 'ar', voice: 'Fenrir' })}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'ar' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                          AR
                        </button>
                        <button 
                          onClick={() => updatePreferences({ lang: 'en', voice: 'Puck' })}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                          EN
                        </button>
                      </div>

                      {/* Voice Selection Trigger */}
                      <button 
                        onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showVoiceMenu ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'المتحدث' : 'Voice'}</span>
                      </button>
                    </div>

                    {/* Fountain Voice Menu */}
                    <AnimatePresence>
                      {showVoiceMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.5 }}
                          animate={{ opacity: 1, y: -10, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.5 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] flex flex-col items-center"
                        >
                          <div className="flex gap-4 p-4 bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/30 rounded-[32px] shadow-2xl shadow-amber-500/20">
                            {voicesByLang[lang].map((v, i) => (
                              <motion.button 
                                key={v.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1, type: 'spring', damping: 12 }}
                                onClick={() => { setVoice(v.id); setShowVoiceMenu(false); }}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border ${voice === v.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                              >
                                {v.gender === 'male' ? <User className="w-6 h-6" /> : <UserCircle className="w-6 h-6" />}
                                <span className="text-[9px] font-black uppercase tracking-widest text-center">{v.name}</span>
                              </motion.button>
                            ))}
                          </div>
                          {/* Fountain Base Triangle */}
                          <div className="w-4 h-4 bg-zinc-950 border-r border-b border-amber-500/30 rotate-45 -mt-2" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8">
                  <AdSense slot="input_native" theme={theme} />
                </div>
              </div>
            </section>

            <AnimatePresence>
              {(error || isRateLimited) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-6 rounded-3xl flex items-center gap-4 border ${
                    isRateLimited 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {isRateLimited ? <History className="w-6 h-6 animate-spin" /> : <AlertCircle className="w-6 h-6" />}
                  <div className="flex flex-col">
                    <span className="font-bold">{error}</span>
                    {isRateLimited && (
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                        {lang === 'ar' ? `يرجى المحاولة بعد ${retryCountdown} ثانية` : `Please retry in ${retryCountdown} seconds`}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Insights & Results */}
          <div className="lg:col-span-5 space-y-8">
            {/* Always Visible Archive if history exists */}
            {user && conversations.length > 0 && !result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-8 rounded-[40px] border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <History className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest">{lang === 'ar' ? 'الأرشيف السحابي الأخير' : 'Recent Cloud Archive'}</h3>
                </div>
                <div className="space-y-3">
                  {conversations.slice(0, 3).map((conv) => (
                    <div key={conv.id} className="relative group overflow-hidden rounded-2xl">
                      <button 
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`w-full text-right p-5 rounded-2xl transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-amber-500/20' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-amber-500/20 shadow-sm'}`}
                      >
                        <p className="text-xs font-bold truncate mb-1 pr-8">{conv.title}</p>
                        <p className="text-[9px] opacity-50 uppercase tracking-widest">{new Date(conv.updatedAt?.seconds * 1000).toLocaleDateString()} | {lang === 'ar' ? 'تدقيق محفوظ' : 'Saved Audit'}</p>
                      </button>
                      
                      {deletingId === conv.id ? (
                        <motion.div 
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute inset-0 bg-red-600 flex items-center justify-center gap-4 z-10"
                        >
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm?'}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => confirmDeleteConversation(conv.id)}
                              className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="p-2 bg-black/20 text-white rounded-lg hover:bg-black/40 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={(e) => deleteConversation(e, conv.id)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const element = document.getElementById('cloud-archive-section');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-4 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] hover:underline"
                  >
                    {lang === 'ar' ? 'عرض الأرشيف الكامل' : 'View Full Archive'}
                  </button>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div id="analysis-report" className={`p-1 rounded-[40px] ${theme === 'dark' ? 'bg-transparent' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <FileDown className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{lang === 'ar' ? 'تقرير التدقيق الذكي' : 'Smart Audit Report'}</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString()} | Basira AI Auditor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(result.summary);
                            showNotify(lang === 'ar' ? 'تم نسخ الملخص الملكي!' : 'Royal Summary copied!', 'success');
                          }}
                          className={`p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 text-amber-500 hover:bg-amber-500/10' : 'border-slate-100 text-amber-600 hover:bg-amber-50/50'}`}
                          title={lang === 'ar' ? 'نسخ الملخص' : 'Copy Summary'}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Basira AI Report',
                                text: result.summary,
                                url: window.location.href
                              }).catch(() => {});
                            } else {
                              navigator.clipboard.writeText(result.summary);
                              showNotify(lang === 'ar' ? 'تم نسخ الملخص!' : 'Summary copied!', 'success');
                            }
                          }}
                          className={`p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 text-gray-400 hover:bg-white/5' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={exportToPDF}
                          disabled={isExporting}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : 'bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20'}`}
                        >
                          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          {lang === 'ar' ? 'تصدير PDF ملكي' : 'Export Royal PDF'}
                        </button>
                      </div>
                    </div>

                    {result.riskScore !== undefined && <RiskHeatmap score={result.riskScore} />}

                    {/* Results Display */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between gap-5 bg-amber-500/10 border border-amber-500/20 p-6 rounded-[32px]"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex gap-1.5">
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={isPlaying ? { height: [10, 24, 10] } : { height: 10 }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className={`w-1 rounded-full ${isPlaying ? 'bg-amber-500' : 'bg-gray-500'}`}
                            />
                          ))}
                        </div>
                        <span className="small-caps text-amber-500">
                          {isAudioLoading ? (lang === 'ar' ? 'جاري تحضير صوت المدقق...' : 'Preparing Auditor Voice...') : isPlaying ? (lang === 'ar' ? 'بصيرة تحلل الآن صوتياً...' : 'Basira is now analyzing audibly...') : (lang === 'ar' ? 'الصوت متوقف' : 'Audio Stopped')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const reportText = `Reported Content: ${result.raw}`;
                            window.open(`mailto:abuahmad.2003sudan@gmail.com?subject=Report AI Content&body=${encodeURIComponent(reportText)}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-gray-400 border border-white/5 rounded-xl hover:bg-zinc-700 transition-all"
                          title={lang === 'ar' ? 'إبلاغ عن محتوى غير دقيق' : 'Report inaccurate content'}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'إبلاغ' : 'Report'}</span>
                        </button>

                        <div className="relative">
                          <button 
                            onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                            className={`p-3 rounded-2xl transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                            title={lang === 'ar' ? 'اختر الصوت' : 'Choose Voice'}
                          >
                            {voice === 'Fenrir' || voice === 'Puck' ? <User className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{voice === 'Fenrir' || voice === 'Puck' ? (lang === 'ar' ? 'ذكر' : 'Male') : (lang === 'ar' ? 'أنثى' : 'Female')}</span>
                          </button>
                          
                          <AnimatePresence>
                            {showVoiceMenu && (
                              <div className="absolute bottom-full mb-6 right-0 flex flex-col items-center gap-4 z-50">
                                {/* Male Option */}
                                <motion.button
                                  initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -20 }}
                                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                  exit={{ opacity: 0, y: 20, scale: 0.5, rotate: -20 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  onClick={() => { setVoice(lang === 'ar' ? 'Fenrir' : 'Puck'); setShowVoiceMenu(false); }}
                                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all ${voice === 'Fenrir' || voice === 'Puck' ? 'bg-amber-500 border-white text-white' : 'bg-zinc-900 border-white/10 text-gray-400 hover:border-amber-500/50'}`}
                                  title={lang === 'ar' ? 'صوت ذكر' : 'Male Voice'}
                                >
                                  <User className="w-6 h-6" />
                                </motion.button>

                                {/* Female Option */}
                                <motion.button
                                  initial={{ opacity: 0, y: 20, scale: 0.5, rotate: 20 }}
                                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                  exit={{ opacity: 0, y: 20, scale: 0.5, rotate: 20 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                  onClick={() => { setVoice(lang === 'ar' ? 'Kore' : 'Charon'); setShowVoiceMenu(false); }}
                                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all ${voice === 'Kore' || voice === 'Charon' ? 'bg-amber-500 border-white text-white' : 'bg-zinc-900 border-white/10 text-gray-400 hover:border-amber-500/50'}`}
                                  title={lang === 'ar' ? 'صوت أنثى' : 'Female Voice'}
                                >
                                  <UserCircle className="w-6 h-6" />
                                </motion.button>

                                {/* Fountain Base Glow */}
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 0.3, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  className="absolute -bottom-4 w-20 h-20 bg-amber-500 blur-3xl rounded-full -z-10"
                                />
                              </div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button 
                          disabled={isAudioLoading}
                          onClick={() => {
                            if (isPlaying) {
                              stopAudio();
                            } else {
                              const audioText = lang === 'ar' 
                                ? `الملخص: ${result.summary}. المخاطر: ${result.risks.join('، ')}. البنود المجحفة: ${result.unfairClauses.join('، ')}. التوصيات: ${result.recommendations?.join('، ') || 'لا توجد توصيات إضافية'}.`
                                : `Summary: ${result.summary}. Risks: ${result.risks.join(', ')}. Unfair Clauses: ${result.unfairClauses.join(', ')}. Recommendations: ${result.recommendations?.join(', ') || 'No additional recommendations'}.`;
                              speakResult(audioText);
                            }
                          }}
                          className={`p-3 rounded-2xl transition-all ${isAudioLoading ? 'opacity-50 cursor-not-allowed' : isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'}`}
                        >
                          {isAudioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    <AdSense slot="result_top" theme={theme} />

                    {/* Risk Score Gauge */}
                    <div className="flex flex-col items-center mb-12">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke={theme === 'dark' ? '#1a1a1a' : '#f1f5f9'} 
                            strokeWidth="8" 
                          />
                          <motion.circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke={result.riskScore > 70 ? '#ef4444' : result.riskScore > 40 ? '#f59e0b' : '#10b981'} 
                            strokeWidth="8" 
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * result.riskScore) / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{result.riskScore}%</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{lang === 'ar' ? 'مؤشر المخاطر' : 'Risk Index'}</span>
                        </div>
                      </div>
                      <p className={`mt-4 text-sm font-medium ${result.riskScore > 70 ? 'text-red-500' : result.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {result.riskScore > 70 
                          ? (lang === 'ar' ? 'مخاطرة عالية جداً - كن حذراً' : 'Very High Risk - Be Cautious')
                          : result.riskScore > 40 
                            ? (lang === 'ar' ? 'مخاطرة متوسطة - راجع البنود' : 'Medium Risk - Review Clauses')
                            : (lang === 'ar' ? 'مخاطرة منخفضة - يبدو آمناً' : 'Low Risk - Seems Safe')}
                      </p>
                    </div>

                    {/* Summary Insight */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-[40px] p-10 relative group overflow-hidden transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-300 shadow-lg shadow-slate-200/20'}`}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <FileText className="w-7 h-7 text-amber-500" />
                          <h3 className="small-caps text-gray-500">{lang === 'ar' ? 'ملخص الوثيقة والجوهر' : 'Document Summary & Essence'}</h3>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(result.summary);
                            showNotify(lang === 'ar' ? 'تم نسخ الملخص الملكي!' : 'Royal Summary Copied!', 'success');
                          }}
                          className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500/20 transition-all active:scale-95"
                          title={lang === 'ar' ? 'نسخ الملخص' : 'Copy Summary'}
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                      <div className={`text-2xl leading-relaxed font-serif italic ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                        <MagicalText text={result.summary} />
                      </div>

                      {/* Grounding Sources */}
                      {result.sources && result.sources.length > 0 && (
                        <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap gap-3">
                          <span className="small-caps text-gray-600 w-full mb-4">المصادر العالمية الموثقة:</span>
                          {result.sources.map((source, i) => (
                            <a 
                              key={i} 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 text-blue-400' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-blue-600'}`}
                            >
                              <Eye className="w-3 h-3" />
                              {source.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Recommendations Section */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 border rounded-[40px] p-10 relative group overflow-hidden transition-all ${theme === 'dark' ? 'bg-green-500/5 border-green-500/10' : 'bg-green-50 border-green-200 shadow-2xl shadow-green-200/20'}`}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                        <div className="flex items-center gap-4 mb-8">
                          <Sparkles className="w-7 h-7 text-green-500" />
                          <h3 className="small-caps text-green-600">{lang === 'ar' ? 'توصيات ذكية للموقف القانوني' : 'Smart Recommendations for Legal Position'}</h3>
                        </div>
                        <div className="grid gap-4">
                          {result.recommendations.map((rec, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'} flex items-start gap-4`}
                            >
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-none mt-1 shadow-lg shadow-green-500/10">
                                <span className="text-xs font-black text-green-500">{i + 1}</span>
                              </div>
                              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{rec}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <AdSense slot="result_middle" theme={theme} />

                    {/* Deception Analysis */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`border rounded-[40px] p-10 relative group overflow-hidden transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/40'}`}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                      <div className="flex items-center gap-4 mb-8">
                        <ShieldAlert className="w-7 h-7 text-rose-500" />
                        <h3 className="small-caps text-gray-500">{lang === 'ar' ? 'المخاطر والتحذيرات القانونية' : 'Legal Risks & Warnings'}</h3>
                      </div>
                      <div className={`text-xl leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        <ul className="list-disc list-inside space-y-2">
                          {result.risks.map((risk, i) => (
                            <li key={i}><MagicalText text={risk} delay={0.1 + i * 0.05} /></li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>

                    {/* Permanent Disclaimer */}
                    <div className={`p-6 rounded-3xl border text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-3 h-3 text-amber-500" />
                        <span className="font-bold uppercase tracking-widest">{lang === 'ar' ? 'إخلاء مسؤولية قانوني' : 'Legal Disclaimer'}</span>
                      </div>
                      {lang === 'ar' ? (
                        <p>هذا التحليل تم بواسطة الذكاء الاصطناعي وهو للأغراض المعلوماتية فقط. **لا يمثل نصيحة قانونية مهنية**. المطور غير مسؤول عن أي قرارات تُتخذ بناءً على هذا المحتوى. استشر محامياً دائماً.</p>
                      ) : (
                        <p>This analysis is AI-generated and for informational purposes only. It **DOES NOT constitute professional legal advice**. The developer is not liable for decisions made based on this content. Always consult a lawyer.</p>
                      )}
                    </div>

                    <AdSense slot="result_bottom_native" theme={theme} />

                    {/* Royal Insight Section */}
                    {result.royalInsight && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`mt-8 border rounded-[40px] p-10 relative group overflow-hidden transition-all ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100 shadow-2xl shadow-amber-200/40'}`}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-600" />
                        <div className="flex items-center gap-4 mb-8">
                          <Crown className="w-7 h-7 text-amber-600" />
                          <h3 className="small-caps text-amber-700">{lang === 'ar' ? 'رؤية ملكية عميقة (Grok AI)' : 'Deep Royal Insight (Grok AI)'}</h3>
                        </div>
                        <div className={`text-xl leading-relaxed font-serif italic ${theme === 'dark' ? 'text-amber-200/80' : 'text-amber-900/80'}`}>
                          <MagicalText text={result.royalInsight} />
                        </div>
                      </motion.div>
                    )}

                    {/* Strategic Advice */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`border rounded-[40px] p-10 relative group overflow-hidden transition-all ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100 shadow-2xl shadow-amber-200/40'}`}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-600" />
                      <div className="flex items-center gap-4 mb-8">
                        <Zap className="w-7 h-7 text-amber-600" />
                        <h3 className="small-caps text-amber-600">{lang === 'ar' ? 'البنود المجحفة والالتزامات' : 'Unfair Clauses & Obligations'}</h3>
                      </div>
                      <div className={`text-xl leading-relaxed font-serif italic ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'}`}>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold text-sm uppercase tracking-widest mb-2 opacity-70">{lang === 'ar' ? 'بنود قد تضرك:' : 'Clauses that may harm you:'}</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.unfairClauses.map((clause, i) => (
                                <li key={i}><MagicalText text={clause} delay={0.2 + i * 0.05} /></li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm uppercase tracking-widest mb-2 opacity-70">{lang === 'ar' ? 'التزاماتك الرئيسية:' : 'Your key obligations:'}</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.obligations.map((ob, i) => (
                                <li key={i}><MagicalText text={ob} delay={0.3 + i * 0.05} /></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <AdSpace position="inline" />

                  {/* Interactive Chat with Document */}
                  <div className={`mt-12 p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/40'}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <MessageSquare className="w-7 h-7 text-blue-500" />
                      <h3 className="small-caps text-gray-500">{lang === 'ar' ? 'ناقش الوثيقة مع بصيرة' : 'Discuss Document with Basira'}</h3>
                    </div>
                    
                    <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto no-scrollbar">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                            msg.role === 'user' 
                              ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800')
                              : 'bg-amber-500/20 border border-amber-500/30 text-amber-500'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-end">
                          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatWithDocument()}
                        placeholder={lang === 'ar' ? "اسأل عن أي تفاصيل في العقد..." : "Ask about any details in the contract..."}
                        className={`w-full py-4 pr-14 pl-6 rounded-2xl border focus:ring-2 focus:ring-amber-500 transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                      />
                      <button 
                        onClick={handleChatWithDocument}
                        disabled={chatLoading || !chatInput.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-amber-500 text-black rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-12">
                    <button 
                      onClick={() => {
                        const text = `تحليل قانوني من بصيرة AI:\n\n${result.summary}\n\nجرب بصيرة AI الآن: ${window.location.href}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex-1 py-6 rounded-[32px] bg-green-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
                    >
                      <Share2 className="w-5 h-5" /> مشاركة واتساب
                    </button>

                    <button 
                      onClick={() => { setResult(null); setShowText(false); setChatMessages([]); }}
                      className={`flex-1 py-6 rounded-[32px] border font-bold small-caps transition-all ${theme === 'dark' ? 'border-white/5 text-gray-600 hover:bg-white/5' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                      تحليل جديد
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`h-full flex flex-col items-center justify-center p-12 border border-dashed rounded-[40px] text-center space-y-8 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border transition-all relative ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full animate-pulse" />
                    <Zap className={`w-14 h-14 relative z-10 ${theme === 'dark' ? 'text-amber-500/40' : 'text-amber-500/30'}`} />
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-serif italic ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{lang === 'ar' ? 'في انتظار الوثيقة...' : 'Waiting for document...'}</h3>
                    <p className={`text-sm max-w-[280px] mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                      {lang === 'ar' ? 'أدخل نص العقد، ارفع صورة، أو سجل صوتك لتبدأ بصيرة التدقيق الذكي واستخراج النتائج.' : 'Enter contract text, upload an image, or record your voice to start Basira smart audit and extract results.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Cloud Archive Section */}
        {user && conversations.length > 0 && (
          <motion.section 
            id="cloud-archive-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-amber-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <Cloud className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className={`text-base font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{lang === 'ar' ? 'الأرشيف السحابي الملكي' : 'Royal Cloud Archive'}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{lang === 'ar' ? 'وثائقك المحفوظة في السحابة' : 'Your documents saved in the cloud'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conv) => (
                <motion.div 
                  key={conv.id} 
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <button
                    onClick={() => { setActiveConversationId(conv.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full text-right border p-8 rounded-[32px] transition-all relative overflow-hidden text-right flex flex-col items-start ${activeConversationId === conv.id ? 'bg-amber-500/10 border-amber-500/30' : (theme === 'dark' ? 'bg-zinc-900/50 border-white/5 hover:border-amber-500/30 hover:bg-zinc-900' : 'bg-white border-slate-200 hover:border-amber-500/30 hover:bg-slate-50 shadow-lg shadow-slate-200/50')}`}
                  >
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500/10 group-hover:bg-amber-500 transition-all duration-500" />
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Cloud className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                        {new Date(conv.updatedAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-base font-bold line-clamp-2 mb-4 w-full text-right ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{conv.title}</p>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>{lang === 'ar' ? 'سحابي' : 'Cloud'}</span>
                      </div>
                      <ChevronLeft className={`w-5 h-5 transition-all transform group-hover:-translate-x-2 ${theme === 'dark' ? 'text-gray-700 group-hover:text-amber-500' : 'text-slate-300 group-hover:text-amber-500'}`} />
                    </div>
                  </button>
                  
                  {deletingId === conv.id ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-red-600 rounded-[32px] flex flex-col items-center justify-center gap-4 z-20 p-4"
                    >
                      <span className="text-xs font-black text-white uppercase tracking-widest text-center">{lang === 'ar' ? 'هل تريد حذف هذا المستند نهائياً؟' : 'Permanently delete this document?'}</span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => confirmDeleteConversation(conv.id)}
                          className="px-6 py-2 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                        >
                          {lang === 'ar' ? 'نعم، احذف' : 'Yes, Delete'}
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="px-6 py-2 bg-black/20 text-white rounded-xl font-bold hover:bg-black/40 transition-all"
                        >
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={(e) => deleteConversation(e, conv.id)}
                      className={`absolute left-4 top-4 p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all z-10 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100`}
                      title={lang === 'ar' ? 'حذف من السحابة' : 'Delete from Cloud'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* History / Recent Activity (Archive) */}
        {history.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-amber-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <History className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className={`text-base font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{lang === 'ar' ? 'أرشيف الوثائق المدققة' : 'Audited Documents Archive'}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{lang === 'ar' ? 'سجل عمليات التدقيق السابقة' : 'Previous Audit Logs'}</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowClearHistoryConfirm(!showClearHistoryConfirm)}
                  className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
                
                <AnimatePresence>
                  {showClearHistoryConfirm && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className={`absolute bottom-full right-0 mb-4 p-6 rounded-3xl border shadow-2xl z-50 min-w-[240px] ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}
                    >
                      <p className="text-xs font-bold mb-4 text-center">{lang === 'ar' ? 'هل أنت متأكد من مسح كل الأرشيف؟' : 'Clear all archive?'}</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setHistory([]); setShowClearHistoryConfirm(false); showNotify(lang === 'ar' ? 'تم مسح الأرشيف' : 'Archive cleared', 'success'); }}
                          className="flex-1 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                        >
                          {lang === 'ar' ? 'نعم، امسح' : 'Yes, Clear'}
                        </button>
                        <button 
                          onClick={() => setShowClearHistoryConfirm(false)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <button
                    onClick={() => { setResult(item.analysis); setShowText(true); }}
                    className={`w-full text-right border p-8 rounded-[32px] transition-all relative overflow-hidden text-right flex flex-col items-start ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5 hover:border-amber-500/30 hover:bg-zinc-900' : 'bg-white border-slate-200 hover:border-amber-500/30 hover:bg-slate-50 shadow-lg shadow-slate-200/50'}`}
                  >
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500/10 group-hover:bg-amber-500 transition-all duration-500" />
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                        {lang === 'ar' ? 'تقرير رقم' : 'Report #'} {history.length - idx}
                      </span>
                    </div>
                    <p className={`text-base font-bold line-clamp-2 mb-4 w-full text-right ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.text}</p>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>{lang === 'ar' ? 'مؤرشف' : 'Archived'}</span>
                      </div>
                      <ChevronLeft className={`w-5 h-5 transition-all transform group-hover:-translate-x-2 ${theme === 'dark' ? 'text-gray-700 group-hover:text-amber-500' : 'text-slate-300 group-hover:text-amber-500'}`} />
                    </div>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setHistory(prev => prev.filter((_, i) => i !== idx)); }}
                    className={`absolute left-4 top-4 p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all z-10 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100`}
                    title={lang === 'ar' ? 'حذف من الأرشيف' : 'Delete from Archive'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <footer className="mt-32 pb-24 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-600' : 'bg-white border-slate-200 text-slate-400 shadow-sm'}`}>
            <Sparkles className="w-3 h-3 text-orange-500" />
            {lang === 'ar' ? 'نظام بصيرة القانوني المتطور v3.5 ULTRA' : 'Basira Advanced Legal System v3.5 ULTRA'}
          </div>
          <p className={`mt-4 text-xs font-medium transition-all ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>{lang === 'ar' ? '© 2026 جميع الحقوق محفوظة لمختبرات بصيرة للذكاء الاصطناعي' : '© 2026 All rights reserved to Basira AI Labs'}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowDisclaimer(true)}
              className="text-[10px] text-amber-500/60 hover:text-amber-500 underline uppercase tracking-widest"
            >
              {lang === 'ar' ? 'إخلاء المسؤولية القانوني' : 'Legal Disclaimer'}
            </button>
            <button 
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-[10px] text-amber-500/60 hover:text-amber-500 underline uppercase tracking-widest"
            >
              {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <button 
              onClick={() => setShowContactUs(true)}
              className="text-[10px] text-amber-500/60 hover:text-amber-500 underline uppercase tracking-widest"
            >
              {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </button>
            <a 
              href="mailto:support@basira-ai.com"
              className="text-[10px] text-amber-500/60 hover:text-amber-500 underline uppercase tracking-widest"
            >
              {lang === 'ar' ? 'الإبلاغ عن مشكلة' : 'Report an Issue'}
            </a>
          </div>
        </footer>

        {/* Legal Disclaimer Modal (Google Play Compliance) */}
        <AnimatePresence>
          {showDisclaimer && (
            <DisclaimerPopup onAgree={() => {
              localStorage.setItem('disclaimerAccepted', 'true');
              setShowDisclaimer(false);
            }} />
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPage 
              onClose={() => setShowSettings(false)} 
              onSave={() => {
                const adsenseId = localStorage.getItem('ADSENSE_PUBLISHER_ID');
                if (adsenseId) injectAdSenseScript(adsenseId);
                setShowSettings(false);
              }} 
            />
          )}
        </AnimatePresence>

        {/* Brain Particles Effect */}
        <AnimatePresence>
          {showBrainParticles && <BrainParticles />}
        </AnimatePresence>

        {/* Custom Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md px-6"
            >
              <div className={`p-6 rounded-3xl shadow-2xl border backdrop-blur-xl flex items-center gap-4 ${
                notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                'bg-blue-500/10 border-blue-500/20 text-blue-500'
              }`}>
                {notification.type === 'success' ? <ShieldCheck className="w-6 h-6" /> : 
                 notification.type === 'error' ? <ShieldAlert className="w-6 h-6" /> : 
                 <Zap className="w-6 h-6" />}
                <p className="text-sm font-black uppercase tracking-widest">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AdSense slot="footer_sticky_ad" variant="sticky" theme={theme} className="flex" />
      </div>
    </ErrorBoundary>
  );
}
