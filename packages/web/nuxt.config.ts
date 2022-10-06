import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { readdirSync, existsSync } from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MODULES_PATH = resolve(__dirname, 'src/modules');
const modules = readdirSync(MODULES_PATH)
  .map(m => resolve(MODULES_PATH, `${m}/module.ts`))
  .filter(entryPoint => existsSync(entryPoint));

export default defineNuxtConfig({
  srcDir: 'src',
  modules: [
    ...modules,
    'nuxt-typed-router',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@unocss/nuxt'
  ],

  trpc: {
    baseURL: process.env.TRPC_URL,
    endpoint: '/api/trpc' // defaults to /trpc
  },

  unocss: {
    preflight: true,
    icons: true,
    attributify: true,
    webFonts: {
      fonts: {
        sans: 'Roboto'
      }
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: ''
  }
});