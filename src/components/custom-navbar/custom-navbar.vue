<template>
  <view class="pb-1 box-border" :style="{ backgroundColor: background }">
    <view class="safe-area" :style="{ height: `${statusBarHeight}px` }"></view>
    <uni-nav-bar :statusBar="true" :border="false" :title="title" :backgroundColor="background" :color="color"
      :leftIcon="back ? 'left' : ''" :leftWidth="leftWidth" @clickLeft="back ? handleBack() : ''" :fixed="fixed">
      <template v-slot:left>
        <slot name="left"></slot>
      </template>
    </uni-nav-bar>
  </view>
</template>

<script setup lang="ts" name="custom-navbar">
defineProps({
  back: {
    type: Boolean,
    default: true,
  },
  background: {
    type: String,
    default: "#ffffff",
  },
  color: {
    type: String,
    default: "#000000",
  },
  leftWidth: {
    type: Number,
    default: 60,
  },
  title: {
    type: String,
    default: "",
  },
  fixed: {
    type: Boolean,
    default: true,
  },
});

const statusBarHeight = ref(0);

const handleBack = () => uni.navigateBack();

onMounted(() => {
  statusBarHeight.value = uni.getStorageSync("statusBarHeight");
});
</script>
