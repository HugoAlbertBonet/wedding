export default defineConfig({
    build: {
      outDir: 'dist',
  
      rollupOptions: {
          input: {
            index: fileURLToPath(new URL('index.html', import.meta.url)),
            accordion: fileURLToPath(
              new URL('src/components/Accordion/index.html', import.meta.url)
            ),
          },
      },
    },
  });