import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // Optional: falls nötig, um bestimmte Tools zu unterstützen
  },
});
