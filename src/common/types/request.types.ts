import type {
  RequestTypeEnum,
  RequestMethodTypeEnum,
} from "@/common/enum/request.enmu";

export type RespontType = {
  code: number;
  data: any;
  message: string;
  success: boolean;
  timestamp: number;
  traceId: string;
};

export type ParamsType = {
  [key: string]: any;
};

export interface FileOptions {
  files: Array<{
    name?: string;
    file?: File;
    uri?: string;
  }>;
  name: string;
  formData: Object;
  header: Record<string, string>;
}

export interface WSOptions {
  multiple: boolean;
  header: Record<string, string>;
  method: RequestMethodTypeEnum;
  protocols: Array<string>;
}

export interface RequestOptions {
  url: string;
  method?: RequestMethodTypeEnum;
  header?: Record<string, string>;
  reqType?: RequestTypeEnum;
  file?: FileOptions;
}
