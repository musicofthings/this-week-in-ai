import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' to refer to the current directory, avoiding TypeScript error with process.cwd()
  const env = loadEnv(mode, '.', '');
  
  // Safely retrieve the API key from the loaded env or the process env
  // This prioritizes the variable set in Cloudflare Dashboard
  const apiKey = env.API_KEY || process.env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      port: 3000,
    }
  };
});