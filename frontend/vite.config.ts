import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) as {
    VITE_API_BASE: string
    VITE_API_PROXY: string
  }

  return {
    server: {
      port: 5183,
      host: '0.0.0.0',
      proxy: {
        [env.VITE_API_BASE]: env.VITE_API_PROXY,
      },
    },
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: '/src/',
        },
      ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          // 让所有 SCSS 模块都能直接使用 @use 'tokens'
          loadPaths: [path.resolve(__dirname, 'src/styles')],
        },
      },
    },

    plugins: [
      react(),
      viteMockServe({
        enable: false,
      }),
    ],
  }
})
