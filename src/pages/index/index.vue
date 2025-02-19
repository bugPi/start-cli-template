<template>
  <view class="w-full h-screen flex flex-col gap-y-2 items-center justify-center">
    <image src="@/static/logo.png" mode="widthFix" class="w-[50px]" />
    <text class="text-green-500 text-lg font-bold">欢迎 🎉</text>
  </view>
</template>


<script setup lang="tsx">
import { md5Hash } from "@/common/plugins/crypto"
const hash = md5Hash("hello world")
console.log('HASH', hash)
</script>