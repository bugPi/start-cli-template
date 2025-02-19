import { ref, watch, onUnmounted } from "vue";

/**
 * 节流 Hook，限制操作的触发频率。
 * @param {any} value - 需要节流的输入值。
 * @param {number} limit - 节流的时间间隔（毫秒）。
 * @returns {ref} throttledValue - 节流处理后的值。
 */
export function useThrottle(value: any, limit: number) {
  const throttledValue = ref(value);
  let lastRan = Date.now();
  let timeout: number | NodeJS.Timeout;

  const clearTimer = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  watch(value, () => {
    clearTimer();
    const remainingTime = limit - (Date.now() - lastRan);

    if (remainingTime <= 0) {
      throttledValue.value = value;
      lastRan = Date.now();
    } else {
      timeout = setTimeout(() => {
        throttledValue.value = value;
        lastRan = Date.now();
      }, remainingTime);
    }
  });

  onUnmounted(() => {
    clearTimer();
  });

  return throttledValue;
}
