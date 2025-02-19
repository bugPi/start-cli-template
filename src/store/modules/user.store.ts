import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: () => ({
    username: "username",
  }),
  actions: {
    setRoleType() {},
  },
  persist: {
    storage: {
      getItem(key: string) {
        return uni.getStorageSync(key);
      },
      setItem(key: string, val: string) {
        uni.setStorageSync(key, val);
      },
    },
  },
});

export default useUserStore;
