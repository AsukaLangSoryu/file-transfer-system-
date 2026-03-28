import React, { useState, useEffect } from "react";
import ServerStatusCard from "../components/ServerStatusCard";
import UserItem from "../components/UserItem";
import { Users, HardDriveDownload } from "lucide-react";
import { api, createWebSocket } from "../lib/api";

const ServerPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    loadServerStatus();
    const interval = setInterval(loadServerStatus, 3000);

    const ws = createWebSocket((data) => {
      if (data.type === 'users_update') {
        setOnlineUsers(data.users);
      }
    });

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  const loadServerStatus = async () => {
    try {
      const status = await api.getServerStatus();
      setServerStatus(status);
    } catch (error) {
      console.error('Failed to load server status:', error);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-[1000px] mx-auto animate-fade-in">
      <header>
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight m-0">服务器控制台</h1>
        <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">管理本地网络实例并监控已连接设备</p>
      </header>

      <section>
        <ServerStatusCard isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Devices */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] font-semibold text-slate-800 m-0 flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
                <Users size={18} />
              </div>
              Connected Devices
            </h3>
            <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full text-[12px] font-bold">
              {serverStatus?.online_users || 0} 在线
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user, idx) => (
                <UserItem
                  key={idx}
                  name={user.name || `用户 ${idx + 1}`}
                  ip={user.ip || '未知'}
                  deviceType={user.type || 'desktop'}
                  isOnline={isRunning}
                />
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                暂无在线设备
              </div>
            )}
          </div>
        </section>

        {/* Recent Transfers Log */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center px-1">
            <h3 className="text-[16px] font-semibold text-slate-800 m-0 flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-50 text-[#4facfe] rounded-lg">
                <HardDriveDownload size={18} />
              </div>
              System Logs
            </h3>
          </div>

          <div className="bg-white/50 border border-slate-100/80 rounded-[24px] p-10 flex flex-col items-center justify-center text-center h-[280px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-inner">
              <HardDriveDownload size={28} strokeWidth={1.5} />
            </div>
            <p className="text-slate-600 font-medium text-[15px]">暂无活动</p>
            <p className="text-[13px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">接收的文件或系统通知将在此记录</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServerPage;