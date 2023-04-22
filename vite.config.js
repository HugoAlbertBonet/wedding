import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
      outDir: 'dist',
  
      rollupOptions: {
          input: {
            index: fileURLToPath(new URL('index.html', import.meta.url)),
            public: fileURLToPath(
              new URL('transmit.html', import.meta.url)
            ),
            audio: fileURLToPath(
              new URL('/src/audio', import.meta.url)
            ),
          },
      },
    },
  });