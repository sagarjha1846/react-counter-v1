
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  output: {
    manualChunks(id) {
      // Specify how modules should be grouped into chunks
      if (id.includes('node_modules')) {
        return 'vendor'; // Group all modules from node_modules into a 'vendor' chunk
      } else {
        return 'main'; // Group all other modules into a 'main' chunk
      }
    },
    // other output options...
  },

  input: {
    main: resolve(__dirname, 'index.html'),
    404: resolve(__dirname, 'public/404.html'),
  },

  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000, // Adjust the chunk size warning limit to 500 kBs
    rollupOptions: {},
    // You need to change this between build runs to reproduce
    chunkFileNames: `assets/[name]-[hash].js`,
    entryFileNames: `assets/[name]-[hash].js`,
  },

  plugins: [react()],
});
