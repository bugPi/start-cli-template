import { ref, watch, onUnmounted } from "vue";

/**
 * 防抖 Hook，避免在短时间内多次触发同一操作。
 * @param {any} value - 需要防抖的输入值。
 * @param {number} delay - 防抖延迟时间（毫秒）。
 * @returns {ref} debouncedValue - 防抖处理后的值。
 */
export function useDebounce(value: any, delay: number) {
  const debouncedValue = ref(value);
  let timeout: number | NodeJS.Timeout;

  const clearTimer = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  watch(value, () => {
    clearTimer();
    timeout = setTimeout(() => {
      debouncedValue.value = value;
    }, delay);
  });

  onUnmounted(() => {
    clearTimer();
  });

  return debouncedValue;
}
