# UDP 文件传输系统 - Web界面

## 🎨 设计风格

**赛博朋克极简主义** - 融合未来科技感与精致设计

- 深色主题 + 霓虹蓝/紫/粉强调色
- 几何网格背景 + 毛玻璃效果
- 流畅动画 + 光效
- Orbitron字体（标题）+ JetBrains Mono（代码）

## 🚀 快速开始

### 后端启动

```bash
cd web/backend
pip install -r requirements.txt
python main.py
```

### 前端启动

```bash
cd web/frontend
npm install
npm run dev
```

访问: http://localhost:5173

## 📦 功能模块

- **服务器控制**: 启动/停止服务器，查看在线用户
- **文件上传**: 拖拽上传，3个并发传输进度
- **文件预览**: 支持文本/图片/视频在线预览
- **群发功能**: 多选用户批量发送文件

## 🛠️ 技术栈

- 前端: Vue 3 + Vite + Element Plus
- 后端: FastAPI + WebSocket
- 样式: 自定义CSS（赛博朋克风格）
