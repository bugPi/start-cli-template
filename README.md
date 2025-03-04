# Start Cil Template

![npm](https://img.shields.io/badge/node-v18.19.0-brightgreen)
![vue](https://img.shields.io/badge/vue-3-%2341b883)
![webpack](https://img.shields.io/badge/bulid-vite-brightgreen)
![uni-app](https://img.shields.io/badge/uniapp-latest-%2341b883)
![pinia](https://img.shields.io/badge/pinia-latest-f5d86c)
<br/>

## 文档目录

- [特征](#特征)
- [食用方法](#食用方法)
- [项目结构](#项目结构)
- [API](#API)

## 👉 特征

- 支持 Tailwindcss,echarts
- 支持打包后 File 协议访问
- 模块化组件化

## 👉 食用方法

> 项目运行前请确保已安装 [Visual Studio Code](https://code.visualstudio.com/download)

使用 Visual Studio Code 导入项目，并执行以下命令

```bash
$ pnpm install
```

运行

```bash
$ pnpm dev:h5
$ pnpm dev:mp-weixin
```

打包

```bash
$ pnpm build:h5
$ pnpm build:mp-weixin
```

## 👉 项目结构

```
| - common 公共模块
| | - config 公共配置
| | - hooks 自定义hook
| | - enum 枚举
| | - request 请求模块
| | - styles 全局样式
| | - type 类型定义
| | - utils 工具函数
| - components 公共组件
| - hybrid App端存放本地html文件的目录
| - pages 页面
| - static 静态资源
| - store 公共状态管理
```

## 👉 API

### WebSocketService

```
import { WebSocketService } from '@/common/request';
const ws = new WebSocketService('wss://echo.websocket.org');

// 连接 WebSocket
ws.connect(
  () => console.log('WebSocket创建成功'),
  (err) => console.error('WebSocket创建失败', err)
);

// 监听 WebSocket 消息
ws.onMessage((msg) => {
  console.log('收到消息:', msg);
});

// 发送消息
ws.sendMessage('Hello, Server!');

// 关闭 WebSocket
ws.close();
```

### useDebounce

```
<template>
  <input v-model="query" placeholder="Search" />
  <p>Debounced Query: {{ debouncedQuery }}</p>
</template>

import { ref } from 'vue';
import { useDebounce } from '@/common/hooks/useDebounce';

const query = ref('');
const debouncedQuery = useDebounce(query, 500); // 500ms 防抖
```

### useThrottle

```
<template>
  <div>Scroll Position: {{ throttledScrollY }}</div>
</template>

import { ref, onMounted, onUnmounted } from 'vue';
import { useThrottle } from '@/common/hooks/useThrottle';
const scrollY = ref(window.scrollY);
const throttledScrollY = useThrottle(scrollY, 1000); // 1秒节流

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
```

### mkcert

> mkcert 是什么？  
> mkcert 是一个用于在本地生成 自签名 SSL/TLS 证书的工具，适用于本地开发环境。它可以快速创建受信任的 HTTPS 证书，避免浏览器的不安全警告。

修改开发环境下的.env.development 文件

```
VITE_HTTPS=true
```

安装

```
pnpm install -g mkcert
```

**方式一：**

创建证书

```
mkcert create-ca // 生成 CA 证书
mkcert create-cert // 生成证书
```

执行上面的命令您将得到 ca.crt,ca.key,cert.pem,cert.key 四个文件。 将它们移入到 public/ssl 文件夹中完成 SSL 证书配置

**方式二：**

创建证书

```
mkcert -install // 创建安装 CA 证书
mkcert -key-file localhost.key -cert-file localhost.crt localhost // 创建localhost的SSL证书

```

将生成的 localhost.crt 和 localhost.key 文件移动到 public/ssl 文件夹中。
更改 vite.config.ts 文件中的 https 配置

```
https: {
  key: fs.readFileSync('./public/ssl/localhost.key'),
  cert: fs.readFileSync('./public/ssl/localhost.crt'),
}
```
