<template>
  <view class="w-full h-full">
    <rich-text v-if="type" :nodes="data"></rich-text>
    <web-view
      v-else
      :src="data"
      :fullscreen="false"
      style="width: 100%; height: 100%"
    ></web-view>
  </view>
</template>

<script lang="ts" setup name="custom-privacy">
defineProps({
  type: {
    type: Boolean, // true 富文本 false 网页链接
    default: true,
  },
  data: {
    type: String,
    default: "",
  },
});
</script>
