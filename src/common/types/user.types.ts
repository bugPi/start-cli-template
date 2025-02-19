export interface UserMenuType {
  avatar: string | null; // 用户头像的URL或路径
  phoneNumber: string | null; // 用户的手机号
  identityNumber: string | null; // 用户的身份证号或身份编号
  realNameAuthStatus: boolean; // 实名认证状态，true代表已认证，false代表未认证
}

export interface MenuItemsType {
  label: string;
  value: string | null | number;
  showArrow?: boolean;
  avatar?: boolean;
}
