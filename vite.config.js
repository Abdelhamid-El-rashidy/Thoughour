import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Must match the GitHub repo name for project Pages:
  // https://abdelhamid-el-rashidy.github.io/Thoughour/
  base: '/Thoughour/',
  build: { outDir: 'dist', emptyOutDir: true }
});

