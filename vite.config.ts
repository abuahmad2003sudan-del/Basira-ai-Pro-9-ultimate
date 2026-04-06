import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'terser', // ضغط فائق للملفات
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // تقسيم الملفات لسرعة التحميل
          'vendor': ['react', 'react-dom', 'motion/react', 'lucide-react'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'mammoth']
  }
});
