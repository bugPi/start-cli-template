<template>
  <view class="flex flex-col items-center rounded p-4 box-border"
    :style="{ backgroundColor: bgColor || 'transparent' }">
    <image :src="icons[type || 'empty']" mode="widthFix" class="w-[200px] h-[200px]"></image>
    <view class="mt-2">
      <p v-if="text" class="text-xs text-gray-500 mt-2">{{ text }}</p>
      <slot v-else />
    </view>
  </view>
</template>

<script lang="tsx" setup name="custom-empty">
import address from '@/static/empty/address.png';
import empty from '@/static/empty/empty.png';
import files from '@/static/empty/files.png';
import folder from '@/static/empty/folder.png';
import massage from '@/static/empty/massage.png';
import meeting from '@/static/empty/meeting.png';

type EmptyType = 'address' | 'empty' | 'files' | 'folder' | 'massage' | 'meeting';


defineProps<{
  type?: EmptyType;
  text?: string;
  bgColor?: string;
}>();

// 图标映射
const icons: Record<EmptyType, string> = {
  address,
  empty,
  files,
  folder,
  massage,
  meeting,
};
</script>
