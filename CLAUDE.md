# 项目说明文档

## 项目概述

这是一个计算机网络课程设计项目（题目1），实现了基于Web的文件传输系统。

**技术栈：**
- 前端：React 18 + TypeScript + Tailwind CSS + Vite
- 后端：Python FastAPI + asyncio + WebSocket
- 并发控制：asyncio.Semaphore(3) 实现3线程并发上传

## 项目结构

```
计网课设/
├── react/                    # 前端项目
│   ├── src/
│   │   ├── components/      # UI组件
│   │   ├── pages/           # 页面组件
│   │   └── lib/api.ts       # API客户端
│   └── package.json
├── web/backend/             # 后端项目
│   ├── main.py              # FastAPI服务器
│   └── uploads/             # 文件存储目录
└── test_files/              # 测试文件
```

## 已实现功能

✅ **多线程文件上传**（≥3并发）
✅ **文件列表管理**（查看/下载/删除）
✅ **文件预览**（文本/图片/视频）
✅ **实时搜索**（按文件名）
✅ **类型筛选**（图片/视频/文档/压缩包）
✅ **群发功能**（多用户广播，支持上传新文件）
✅ **实时进度显示**（WebSocket推送）
✅ **多设备连接**（WebSocket自动注册和移除）
✅ **用户名持久化**（localStorage保存）

## 启动项目

### 1. 启动后端
```bash
cd D:\cursor\code\计网课设\web\backend
python main.py
```
后端运行在：http://localhost:8000

### 2. 启动前端
```bash
cd D:\cursor\code\计网课设\react
npm run dev
```
前端运行在：http://localhost:8081

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

## 已知问题

### ✅ 已修复的问题

1. **删除功能** - 已修复，添加了确认对话框
2. **搜索功能** - 已修复，实时过滤文件列表
3. **筛选功能** - 已修复，按文件类型筛选
4. **多设备连接** - 已修复，WebSocket自动注册和移除用户
5. **群发广播** - 已修复，支持选择已有文件或上传新文件

### 后端重启问题
**现象：** 修改后端代码后，重启时报错 `[Errno 10048] 端口已被占用`

**原因：** 旧的Python进程未正确关闭，仍占用8000端口

**解决方案：**
```bash
# 查找Python进程
ps aux | grep python

# 停止进程（替换PID）
kill <PID>

# 重新启动
cd D:\cursor\code\计网课设\web\backend
python main.py
```

### 2. 前端开发注意事项
- 所有UI文本已翻译为中文
- 使用真实数据，禁止硬编码假数据
- 文件预览仅支持文本/图片/视频格式
- 搜索和筛选在前端实现（实时过滤）

### 3. 并发限制
- 后端使用 `asyncio.Semaphore(3)` 限制最多3个并发上传
- 超过3个上传请求会自动排队等待

## 测试文件

项目包含以下测试文件：
- `test_files/test_text.txt` - 460字节文本文件
- `test_files/test_data.json` - JSON数据文件
- `test_files/big_test.txt` - 114MB大文件（测试进度条）

## 开发规范

1. **不要创建假数据** - 所有数据必须来自真实API
2. **保持代码简洁** - 只写必要的代码，避免过度设计
3. **UI风格** - 遵循现代App风格（Linear/Arc/Raycast）
4. **中文优先** - 所有用户界面文本使用中文

## 下一步计划

- [ ] 添加更多测试文件（图片、视频）
- [ ] 测试群发功能（需要多个客户端）
- [ ] 优化UI动画和交互体验
- [ ] 添加错误处理和用户提示
