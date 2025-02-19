const codeMsg: Record<number, string> = {
  500: "服务器错误",
  400: "请求参数错误",
  401: "登录已过期",
};

/**
 * 请求提示错误信息
 * @param { number } code 错误代码
 * @returns
 */
export const showReqCodeTip = (code: number) => {
  if (code === 401) {
    return uni.showModal({
      content: codeMsg[code],
      showCancel: false,
      success: () => {
        uni.reLaunch({
          url: "/pages/login/login",
        });
      },
    });
  }

  uni.showToast({
    title: codeMsg[code],
    icon: "none",
  });
};
