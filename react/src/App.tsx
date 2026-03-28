import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import ServerPage from "./pages/Server";
import ClientPage from "./pages/Client";
import FilesPage from "./pages/Files";
import BroadcastPage from "./pages/Broadcast";
import Sidebar from "./components/Sidebar";
import { createWebSocket } from "./lib/api";

const App: React.FC = () => {
  useEffect(() => {
    console.log('App mounted, creating WebSocket...');
    const ws = createWebSocket(() => {}, () => {
      console.log('WebSocket connected!');
      let userName = localStorage.getItem('userName');
      if (!userName) {
        userName = prompt("请输入你的名称：") || `用户${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('userName', userName);
      }
      console.log('Registering user:', userName);
      ws.send(JSON.stringify({
        type: 'register',
        user: {
          name: userName,
          ip: 'Auto',
          type: 'desktop'
        }
      }));
    });
    return () => {
      console.log('App unmounting, closing WebSocket...');
      ws.close();
    };
  }, []);
  // Ant Design customized theme focusing on elegance and modern spacing
  const themeConfig = {
    token: {
      colorPrimary: "#4facfe",
      colorInfo: "#4facfe",
      colorSuccess: "#10b981",
      colorWarning: "#f59e0b",
      colorError: "#ff6b9d",
      borderRadius: 12,
      fontFamily: "'Inter', sans-serif",
      colorBgContainer: "#ffffff",
      boxShadow: "0 12px 32px -4px rgba(12, 24, 44, 0.04)",
      controlHeight: 44,
    },
    components: {
      Button: {
        borderRadius: 10,
        fontWeight: 500,
        controlHeight: 44,
        paddingInline: 24,
      },
      Card: {
        borderRadiusLG: 20,
      },
      Input: {
        borderRadius: 10,
        colorBgContainer: "#f8fafc",
        colorBorder: "transparent",
        hoverBorderColor: "#4facfe",
        activeBorderColor: "#4facfe",
        activeShadow: "0 0 0 2px rgba(79, 172, 254, 0.1)",
      },
      Select: {
        borderRadius: 10,
        colorBgContainer: "#f8fafc",
        colorBorder: "transparent",
      }
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        {/* Outer ambient container */}
        <div className="min-h-screen w-full flex justify-center bg-[#f6f8fa] relative overflow-hidden text-slate-800">
          
          {/* Subtle glowing ambient background elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#4facfe]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#a18cd1]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

          {/* Main App Window - Max width 1440px */}
          <div className="w-full max-w-[1440px] m-4 sm:m-8 rounded-[32px] glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] flex overflow-hidden relative z-10 border border-white/60">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white/40 backdrop-blur-sm">
              <div className="p-8 sm:p-12 h-full">
                <Routes>
                  <Route path="/" element={<ServerPage />} />
                  <Route path="/client" element={<ClientPage />} />
                  <Route path="/files" element={<FilesPage />} />
                  <Route path="/broadcast" element={<BroadcastPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
          
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;