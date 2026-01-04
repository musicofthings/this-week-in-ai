import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' to refer to the current directory
  const env = loadEnv(mode, '.', '');
  
  // Prioritize environment variables, falling back to empty string to prevent crashes
  const apiKey = env.API_KEY || process.env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      // Inject the API key into the client bundle safely
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      port: 3000,
      // Optional: Proxy /api to local wrangler dev if you run it
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8788',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error', err);
            });
          }
        }
      }
    }
  };
});