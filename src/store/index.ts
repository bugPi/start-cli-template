import useUserStore from "./modules/user.store";

const useStore = () => ({
  user: useUserStore(),
});

export default useStore;