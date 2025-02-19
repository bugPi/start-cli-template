<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import VConsole from "vconsole";
// #ifdef H5
const vConsole = new VConsole();
// #endif

onLaunch(() => {
  console.log(`当前环境: ${process.env.NODE_ENV}`);
});

onShow(() => {

});

onHide(() => { });
</script>


<style lang="scss">
@use "tailwindcss/base";
@use "tailwindcss/utilities";
@use "tailwindcss/components";
@use "./uni.scss";
</style>
