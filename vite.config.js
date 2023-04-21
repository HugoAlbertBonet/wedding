export default defineConfig({
    build: {
      outDir: 'dist',
  
      rollupOptions: {
          input: {
            index: fileURLToPath(new URL('index.html', import.meta.url)),
            public: fileURLToPath(
              new URL('transmit.html', import.meta.url)
            ),
          },
      },
    },
  });