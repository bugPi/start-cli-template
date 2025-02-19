<template>
  <view class="w-full h-full">
    <view v-if="title">
      <text class="text-xs text-gray-500">{{ title }}</text>
    </view>
    <slot name="header" v-else></slot>
    <view :style="{ width: width, height: height }">
      <l-echart ref="chartRef" @finished="handleChartFinished" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";

interface Props {
  option: echarts.EChartsOption;
  width?: string;
  height?: string;
  loading?: boolean;
  theme?: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%",
  loading: false,
  theme: "default",
});

const emit = defineEmits<{
  (event: "init", chart: echarts.EChartsType): void;
  (event: "error", error: Error): void;
}>();

const chartRef = ref(null); // 图表容器
const chartInstance = ref<echarts.EChartsType | null>(null); // 图表实例

/**
 * 初始化图表
 */
const initChart = async () => {
  try {
    if (!chartRef.value) return;

    chartInstance.value = await chartRef.value?.init(echarts, props.theme);

    if (chartInstance.value) {
      chartInstance.value.setOption(props.option);
      emit("init", chartInstance.value);
    }
  } catch (error) {
    console.error("图表初始化失败:", error);
    emit("error", error as Error);
  }
};

/**
 * 更新图表配置
 */
const updateChart = () => {
  try {
    if (!chartInstance.value) return;

    if (props.loading) {
      chartInstance.value.showLoading();
    } else {
      chartInstance.value.hideLoading();
    }

    chartInstance.value.setOption(props.option);
  } catch (error) {
    console.error("图表更新失败:", error);
    emit("error", error as Error);
  }
};

/**
 * 处理图表完成事件
 */
const handleChartFinished = () => {
  initChart();
};

/**
 * 监听配置变化
 */
watch(
  () => props.option,
  () => updateChart(),
  { deep: true }
);

/**
 * 监听加载状态
 */
watch(
  () => props.loading,
  (newLoading) => {
    if (!chartInstance.value) return;
    newLoading
      ? chartInstance.value.showLoading()
      : chartInstance.value.hideLoading();
  }
);

/**
 * 组件卸载时销毁图表实例
 */
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

/**
 * 暴露方法给父组件
 */
defineExpose({
  getChart: () => chartInstance.value,
  resize: () => chartInstance.value?.resize(),
});
</script>
