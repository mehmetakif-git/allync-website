import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Serve static HTML files from public/blog without React Router interference
    {
      name: 'serve-static-blog',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle /blog paths - serve static HTML files
          if (req.url && req.url.startsWith('/blog')) {
            let filePath = req.url;

            // If URL ends with / or has no extension, try to serve index.html or add .html
            if (filePath.endsWith('/')) {
              filePath = filePath + 'index.html';
            } else if (!path.extname(filePath)) {
              filePath = filePath + '.html';
            }

            const fullPath = path.join(process.cwd(), 'public', filePath);

            if (fs.existsSync(fullPath)) {
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(fullPath, 'utf-8'));
              return;
            }
          }
          next();
        });
      },
    },
  ],
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
