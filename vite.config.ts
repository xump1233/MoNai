import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import process from 'process'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: loadEnv(mode, process.cwd()).BASE_URL as string,
    plugins: [vue(),vueJsx()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'), // 将 @ 映射到 src 目录
      },
    },
  }
})
