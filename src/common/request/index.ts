import {
  RequestTypeEnum,
  RequestMethodTypeEnum,
} from "@/common/enum/request.enmu";
import type { RequestOptions } from "@/common/types/request.types";
import { showReqCodeTip } from "@/common/utils/request.utils";
import { CacheEnum } from "@/common/enum/cache.enum";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 存储所有请求的防抖计时器
const debounceMap = new Map<string, NodeJS.Timeout>();

/**
 * 请求封装
 * @param {RequestOptions} options 请求配置
 * @param data 请求参数
 * @return Promise 常规请求和文件上传返回Promise对象
 */
const requestService = (
  options: RequestOptions,
  data?: Record<string, unknown>,
  debounceTime: number = 300 // 默认防抖时间为300ms
): Promise<any> => {
  // 统一处理请求头
  const defaultHeaders = {
    Authorization: `Bearer ${uni.getStorageSync(CacheEnum.TOKEN_KEY) || ""}`,
    "Content-Type": "application/json",
  };

  const headers = Object.assign(defaultHeaders, options.header || {});
  const reqType = options.reqType || RequestTypeEnum.NORMAL;

  const handleResponse = (resp: any): Promise<any> => {
    if (resp.statusCode === 200) {
      return Promise.resolve(resp.data);
    } else {
      showReqCodeTip(resp.statusCode);
      return Promise.reject(new Error(`请求失败，状态码: ${resp.statusCode}`));
    }
  };

  // 获取唯一请求标识符，用于防抖判断（可以根据url和请求参数生成hash）
  const requestKey = `${options.url}_${JSON.stringify(data)}`;

  // 防抖处理，取消已有的相同请求
  if (debounceMap.has(requestKey)) {
    clearTimeout(debounceMap.get(requestKey));
  }

  return new Promise((resolve, reject) => {
    const debounceTimer = setTimeout(() => {
      // 普通请求
      if (reqType === RequestTypeEnum.NORMAL) {
        uni.request({
          url: `${apiBaseUrl}${options.url}`,
          method: options.method ?? RequestMethodTypeEnum.GET,
          data: data ?? {},
          header: headers,
          dataType: "json",
          success: (resp) => resolve(handleResponse(resp)),
          fail: (err) => {
            uni.showToast({
              title: "请求失败",
              icon: "none",
              position: "bottom",
            });
            reject(err);
          },
        });
      }

      // 文件上传请求
      if (reqType === RequestTypeEnum.FILE) {
        uni.uploadFile({
          url: `${apiBaseUrl}${options.url}`,
          files: options.file?.files,
          name: options.file?.name,
          formData: options.file?.formData,
          header: Object.assign(headers, options.file?.header || {}),
          success: (resp) => resolve(handleResponse(resp)),
          fail: (err) => {
            uni.showToast({
              title: "请求失败",
              icon: "none",
              position: "bottom",
            });
            reject(err);
          },
        });
      }
      // 清除当前请求的防抖计时器
      debounceMap.delete(requestKey);
    }, debounceTime);

    // 将防抖计时器存储
    debounceMap.set(requestKey, debounceTimer);
  });
};

/**
 * @class WebSocketService
 * @param {string} url - WebSocket 服务器的 URL 地址。
 * @description 包含了消息队列和错误时的自动重连功能，确保在网络异常时能够自动恢复连接。
 */
class WebSocketService {
  private socketTask: any; // WebSocket 任务实例
  private url: string; // WebSocket 地址
  private isConnected: boolean = false; // 是否建立成功
  private messageCallback: ((msg: any) => void) | null = null; // 消息回调函数
  private messageQueue: string[] = []; // 消息队列，用于存储在连接前发送的消息
  private reconnectAttempts: number = 0; // 重新连接次数限制
  private maxReconnectAttempts: number = 5; // 最大重连次数
  private heartbeatInterval: number = 300000; // 心跳间隔时间 (毫秒)
  private heartbeatTimer: any = null; // 心跳定时器
  private heartbeatTimeout: number = 180000; // 心跳超时时间 (毫秒)
  private heartbeatTimeoutTimer: any = null; // 心跳超时定时器
  private isReconnecting: boolean = false; // 新增标志位，防止重连过程中重复触发

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 初始化 WebSocket 事件监听，包括打开连接、接收消息、关闭连接和错误处理。
   * @method initSocketEvent
   * @private
   */
  private initSocketEvent() {
    uni.onSocketOpen(() => {
      this.updateConnectionStatus(true);
      this.reconnectAttempts = 0; // 重置重连次数
      this.flushMessageQueue(); // 发送队列中的消息
      this.startHeartbeat(); // 启动心跳
    });

    // 监听 WebSocket 接收消息事件
    uni.onSocketMessage((res) => {
      if (res.data === "PONG") this.clearTimer(this.heartbeatTimeoutTimer);
      this.messageCallback?.(res.data);
    });

    // 监听 WebSocket 关闭事件
    uni.onSocketClose(() => this.updateConnectionStatus(false));

    // 监听 WebSocket 错误事件
    uni.onSocketError(() => {
      this.updateConnectionStatus(false);
      if (
        !this.isReconnecting &&
        this.reconnectAttempts <= this.maxReconnectAttempts
      )
        this.retryConnection();
    });
  }

  /**
   * 更新 WebSocket 的连接状态，并在断开连接时停止心跳机制。
   * @method updateConnectionStatus
   * @private
   * @param {boolean} isConnected - 标记 WebSocket 是否已连接。
   */
  private updateConnectionStatus(isConnected: boolean) {
    this.isConnected = isConnected;
    if (!isConnected) {
      this.stopHeartbeat();
      console.log("连接已关闭");
    } else {
      console.log("已连接");
    }
  }

  /**
   * 处理消息队列中的消息
   * @method flushMessageQueue
   * @private
   */
  private flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) this.sendMessage(message);
    }
  }

  /**
   * 尝试重新连接
   * @method retryConnection
   * @private
   */
  private retryConnection() {
    this.isReconnecting = true;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("已达到最大重连次数，停止重连");
      return this.close();
    }

    this.reconnectAttempts++;
    const retryDelay = 1000 * Math.pow(2, this.reconnectAttempts); // 指数递增
    console.log(
      `尝试重新连接... 尝试次数: ${this.reconnectAttempts}, 延迟: ${
        retryDelay / 1000
      } 秒`
    );

    setTimeout(() => {
      this.connect(
        () => (this.isReconnecting = false),
        () => this.retryConnection()
      );
    }, retryDelay);
  }

  /**
   * 启动心跳机制
   * @method startHeartbeat
   * @private
   */
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (!this.isConnected) return;
      this.sendMessage("PING");
      this.startHeartbeatTimeout();
    }, this.heartbeatInterval);
  }

  /**
   * 停止心跳机制
   * @method stopHeartbeat
   * @private
   */
  private stopHeartbeat() {
    this.clearTimer(this.heartbeatTimer);
    this.clearTimer(this.heartbeatTimeoutTimer);
  }

  /**
   * 开始心跳超时检测
   * @method startHeartbeatTimeout
   * @private
   */
  private startHeartbeatTimeout() {
    this.clearTimer(this.heartbeatTimeoutTimer);
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.error("心跳超时，可能连接已断开");
      this.updateConnectionStatus(false);
      this.retryConnection();
    }, this.heartbeatTimeout);
  }

  /**
   * 清除定时器
   * @method clearTimer
   * @private
   */
  private clearTimer(timer: any) {
    if (timer) clearTimeout(timer);
  }

  /**
   * 建立 WebSocket 连接，支持传入连接成功和失败的回调函数。
   * @method connect
   * @param {Function} [onSuccess] - 可选的连接成功回调函数。
   * @param {Function} [onError] - 可选的连接失败回调函数。
   */
  connect(onSuccess?: (res: any) => void, onError?: (err: any) => void) {
    if (this.isConnected) return console.log("已连接");

    this.socketTask = uni.connectSocket({
      url: this.url,
      header: { "Content-Type": "application/json" },
      success: (res) => {
        this.initSocketEvent();
        onSuccess?.(res);
      },
      fail: (err) => {
        onError?.(err);
      },
    });
  }

  /**
   * 发送消息到 WebSocket 服务器。
   * 如果当前未建立连接，则将消息存入队列以待后续发送。
   * 发送成功后，在控制台输出成功信息；发送失败则输出错误信息。
   * @method sendMessage
   * @param {string} message - 要发送的消息内容。
   */
  sendMessage(message: string) {
    if (!this.isConnected) {
      console.warn("未连接，消息已存入队列");
      this.messageQueue.push(message);
      return;
    }
    uni.sendSocketMessage({
      data: message,
      success: () => console.log("消息发送成功:", message),
      fail: (err) => console.error("消息发送失败:", err),
    });
  }

  /**
   * 注册消息回调函数，用于处理从服务器接收的消息。
   * @method onMessage
   * @param {Function} callback - 处理消息的回调函数，回调参数是服务器发送的消息内容。
   */
  onMessage(callback: (msg: any) => void) {
    this.messageCallback = callback;
  }

  /**
   * 关闭 WebSocket 连接。
   * 如果连接已关闭，则不会重复执行关闭操作，并在控制台输出提示信息。
   * 在成功关闭连接后，更新连接状态为未连接。
   * @method close
   */
  close() {
    if (!this.isConnected) return console.log("连接已关闭，无需重复操作");
    uni.closeSocket({
      success: () => this.updateConnectionStatus(false),
      fail: (err) => console.error("连接关闭失败", err),
    });
  }
}

export { requestService, WebSocketService };
