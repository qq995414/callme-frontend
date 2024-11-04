import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,  // 解决刷新后404问题
  },
  optimizeDeps: {
    include: ['swiper'],  // 或者根據需要增加其他依賴
    exclude: [], // 排除其他不必要的依賴
  },
});
