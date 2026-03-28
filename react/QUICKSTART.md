# AirDrop Pro - 快速启动指南

## 🎨 设计特点

已实现 **App-like Window 风格**，参考 Linear/Arc/Raycast 等顶级应用：

- ✨ 深色背景 + 磨砂玻璃质感的 1440px 固定宽容器
- 🎯 极细白边框 + 微弱阴影，清透悬浮视觉
- 🌈 低饱和灰白底色 + hover 时平滑过渡
- 💎 精致的组件重绘和交互动画

## 🚀 快速启动

```bash
cd react
npm install
npm run dev
```

访问：http://localhost:5173

## 📦 技术栈

- React 18 + TypeScript
- Tailwind CSS + Ant Design
- Framer Motion (动画)
- Lucide React (图标)
- Vite (构建工具)

## 🎯 核心优化

1. **玻璃质感增强** - backdrop-blur 32px + 饱和度 180%
2. **边框细节** - 半透明边框 + 微妙阴影层次
3. **交互动画** - scale + translateY + 阴影过渡
4. **色彩层次** - 渐变光晕 + hover 高亮效果

## 📄 页面结构

- `/` - Server Dashboard (服务器面板)
- `/client` - Transfer Client (传输客户端)
- `/files` - File Vault (文件管理)
- `/broadcast` - Group Broadcast (群发功能)
