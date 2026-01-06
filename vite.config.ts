import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@react-three/drei'],
  },
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - cached separately
          'vendor-react': ['react', 'react-dom'],
          // Animation libraries
          'vendor-animation': ['framer-motion'],
          // 3D/WebGL libraries
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
