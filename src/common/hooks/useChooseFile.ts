import type { FileTypeEnum } from "@/common/enum/file.enmu";
import type { FileOptions } from "@/common/types/file.type";

/**
 * 文件选择并自动上传Hook
 * @param {FileTypeEnum} type 上传类型
 * @param {FileOptions} options 上传选项
 */
export const useChooseFile = (type: FileTypeEnum, options: FileOptions) => {};
