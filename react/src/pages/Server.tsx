import React, { useState, useEffect } from "react";
import ServerStatusCard from "../components/ServerStatusCard";
import UserItem from "../components/UserItem";
import { Users, HardDriveDownload } from "lucide-react";
import { api } from "../lib/api";
import { useWebSocket } from "../contexts/WebSocketContext";

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'broadcast';
}

const ServerPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { onlineUsers, addMessageHandler, removeMessageHandler } = useWebSocket();

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [{ time, message, type }, ...prev].slice(0, 10));
  };

  useEffect(() => {
    loadServerStatus();
    const interval = setInterval(loadServerStatus, 3000);

    const handleMessage = (data: any) => {
      if (data.type === 'users_update') {
        const newNames = data.users.map((u: any) => u.name);
        const prevNames = onlineUsers.map((u: any) => u.name);
        newNames.forEach((name: string) => {
          if (!prevNames.includes(name)) {
            addLog(`新设备已连接 (${name})`, 'success');
          }
        });
      } else if (data.type === 'broadcast') {
        addLog(`广播文件: ${data.filename} → ${data.targets?.length || 0}个用户`, 'broadcast');
      }
    };

    addMessageHandler('server', handleMessage);

    return () => {
      clearInterval(interval);
      removeMessageHandler('server');
    };
  }, [onlineUsers]);

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
              已连接设备
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
              系统日志
            </h3>
          </div>

          <div className="bg-white/50 border border-slate-100/80 rounded-[24px] p-6 max-h-[280px] overflow-y-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            {logs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-slate-400 font-mono text-xs mt-0.5">{log.time}</span>
                    <span className={`flex-1 ${
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'broadcast' ? 'text-blue-600' :
                      'text-slate-600'
                    }`}>{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                  <HardDriveDownload size={28} strokeWidth={1.5} />
                </div>
                <p className="text-slate-600 font-medium text-[15px]">暂无活动</p>
                <p className="text-[13px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">接收的文件或系统通知将在此记录</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServerPage;