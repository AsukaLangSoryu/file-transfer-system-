# 文件传输系统

基于Web的文件传输系统 - 计算机网络课程设计项目

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS + Vite + Ant Design
- **后端**: Python FastAPI + asyncio + WebSocket
- **并发控制**: asyncio.Semaphore(3) 实现3线程并发上传

## 功能特性

✅ 多线程文件上传（≥3并发）
✅ 文件列表管理（查看/下载/删除）
✅ 文件预览（文本/图片/视频）
✅ 实时搜索和类型筛选
✅ 群发广播（多用户文件分发）
✅ 多设备连接（WebSocket实时通信）
✅ 实时进度显示

## 快速开始

### 1. 启动后端

```bash
cd web/backend
python main.py
```

后端运行在: http://localhost:8000

### 2. 启动前端

```bash
cd react
npm install
npm run dev
```

前端运行在: http://localhost:8081

### 3. 局域网访问

获取本机IP地址后，其他设备可通过 `http://你的IP:8081` 访问

## 项目结构

```
计网课设/
├── react/              # 前端项目
│   ├── src/
│   │   ├── components/ # UI组件
│   │   ├── pages/      # 页面组件
│   │   └── lib/        # API客户端
│   └── package.json
├── web/backend/        # 后端项目
│   ├── main.py         # FastAPI服务器
│   └── uploads/        # 文件存储目录
├── test_files/         # 测试文件
└── CLAUDE.md           # 开发文档
```

## API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload | 上传文件 |
| GET | /api/files | 获取文件列表 |
| GET | /api/files/{filename} | 下载文件 |
| DELETE | /api/files/{filename} | 删除文件 |
| GET | /api/preview/{filename} | 预览文件 |
| POST | /api/broadcast | 群发文件 |
| GET | /api/server/status | 服务器状态 |
| WS | /ws | WebSocket连接 |

## 开发说明

详细的开发文档请查看 [CLAUDE.md](./CLAUDE.md)

## 许可证

MIT
