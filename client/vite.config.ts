import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
const SERVER_TARGET_PATH = `http://localhost:3100`;

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 8080,
        proxy: {
            "/api": {
                target: SERVER_TARGET_PATH,
                changeOrigin: true,
            },
            "/auth": {
                target: SERVER_TARGET_PATH,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: path.join(__dirname, "..", "server", "public"),
    },
});
