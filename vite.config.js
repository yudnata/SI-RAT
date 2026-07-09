import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'

console.log("--- BUNDLE BUILD ENV CHECK ---");
console.log("VITE_API_URL:", process.env.VITE_API_URL);
console.log("------------------------------");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

