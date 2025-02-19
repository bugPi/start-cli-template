<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "#000000",
  },
  size: {
    type: String,
    default: "16px",
  },
  href: {
    type: String,
    default: "",
  },
});

const handleClick = () => {
  uni.navigateTo({
    url: props.href,
  });
};
</script>

<template>
  <text
    :style="{ color: props.color, fontSize: props.size }"
    @click="handleClick"
  >
    <slot></slot>
  </text>
</template>

<style scoped lang="scss"></style>
