import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob'
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import liveReload from 'vite-plugin-live-reload';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig({
  base: '/', //設置Git Pages的根目錄
  //assetsDir: 'assets', //設置靜態資源目錄
  plugins: [
    ViteEjsPlugin(), //使用ejs模板
    liveReload('pages/**/*.ejs','pages/**/*.html'), //使用liveReload
    moveOutputPlugin(), //自定義插件 - 調整輸出後路徑
  ],
  // 設定伺服器選項
  server: {
    port: 3000, //設置服務器啟動端口號
    open: 'pages/index.html', //設置服務器啟動時是否自動打開瀏覽器
  },
  // 設定構建選項
  build: {
    outDir: 'dist', //設置輸出目錄
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },    
  }
})