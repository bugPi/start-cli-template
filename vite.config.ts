import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from "weapp-tailwindcss/vite";
import { WeappTailwindcssDisabled } from "./paltform";
import { visualizer } from "rollup-plugin-visualizer";
import plugins from "./postcss.config";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";

const isH5 = process.env.UNI_PLATFORM === "h5";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_API_BASE_URL: apiProxyUrl } = env;
  return {
    base: "./",
    plugins: [
      uni(),
      vueJsx(),
      uvwt({
        rem2rpx: true,
        disabled: WeappTailwindcssDisabled,
        tailwindcssBasedir: __dirname,
      }),
      AutoImport({
        imports: ["vue", "uni-app", "pinia"],
        dirs: ["src/common/hooks/**"],
        dts: "./src/auto-imports.d.ts",
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
      ...(isH5 ? [legacy({ targets: ["defaults", "not IE 11"] })] : []),
      visualizer({
        filename: "./dist/stats.html",
        open: false,
        brotliSize: true,
      }),
    ],
    css: {
      postcss: {
        plugins: plugins,
      },
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: apiProxyUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    transpileDependencies: ["@dcloudio/uni-ui"],
    // 定义环境变量
    define: {
      "process.env": env,
    },
    // 打包
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          pure_funcs: ["console.log"],
        },
        mangle: true,
      },
      sourcemap: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: false,
        },
      },
    },
  };
});
