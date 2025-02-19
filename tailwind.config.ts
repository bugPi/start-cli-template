import type { Config } from "tailwindcss";
import cssMacro from "weapp-tailwindcss/css-macro";
import { isMp } from "./paltform";

export default <Config>{
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx,vue}"],
  plugins: [
    cssMacro({
      variantsMap: {
        wx: "MP-WEIXIN",
        "-wx": {
          value: "MP-WEIXIN",
          negative: true,
        },
      },
    }),
  ],
  corePlugins: {
    preflight: !isMp,
    container: !isMp,
  },
};
