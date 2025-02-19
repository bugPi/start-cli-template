import type { AcceptedPlugin } from "postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import cssMacro from "weapp-tailwindcss/css-macro/postcss";
// 初始化插件数组
const plugins: AcceptedPlugin[] = [tailwindcss(), autoprefixer()];
// 动态添加 weapp-tailwindcss 的兼容插件
plugins.push(cssMacro);

export default plugins;
