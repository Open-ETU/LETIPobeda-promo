import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

function stripCrossoriginFromBuiltAssets() {
  return {
    name: 'strip-crossorigin-from-built-assets',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/\s+crossorigin(?=[\s>])/g, '')
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), stripCrossoriginFromBuiltAssets()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/__tests__/**/*.{test,spec}.js',
      'src/__tests__/**/*.integration.test.js',
    ],
  },
})
