import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  base: '/todo-app/',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: ('./index.html'),
        signIn: ('./sign-in.html'),
      }
    }
  }
})