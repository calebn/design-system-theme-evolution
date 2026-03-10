import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // Serve the project root so /generated/* paths resolve correctly in dev
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
