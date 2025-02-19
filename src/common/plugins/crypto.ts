import * as CryptoJS from "crypto-js";

/**
 * MD5加密
 */
export const md5Hash = (str: string) => {
  return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
};
