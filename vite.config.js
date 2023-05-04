import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import gltfPlugin from 'vite-plugin-gltf'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    gltfPlugin({
      // 指定 .glb 文件的根目录
      root: '/model',
      // 将 .glb 文件复制到输出目录中
      copy: true
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true
  }
})
