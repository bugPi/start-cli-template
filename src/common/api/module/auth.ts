import type { ParamsType } from "@/common/types/request.types";

import { requestService } from "@/common/request";
import { RequestMethodTypeEnum } from "@/common/enum/request.enmu";

enum PATH {
  LOGIN = `/auth/signin`,
}

// 系统登录
export const sysSingin = (params: ParamsType) =>
  requestService(
    {
      url: PATH.LOGIN,
      method: RequestMethodTypeEnum.POST,
    },
    params
  );
