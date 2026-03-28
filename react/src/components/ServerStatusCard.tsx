import React from "react";
import { Button } from "antd";
import { Activity, Radio, ShieldCheck, Power, Cpu } from "lucide-react";

interface ServerStatusCardProps {
  isRunning?: boolean;
  ipAddress?: string;
  port?: number;
  onToggle?: () => void;
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  isRunning = true,
  ipAddress = "192.168.1.188",
  port = 8899,
  onToggle = () => console.log("Toggle server"),
}) => {
  return (
    <div data-cmp="ServerStatusCard" className="card-base rounded-[24px] p-8 relative overflow-hidden group border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Decorative gradient overlay */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none transition-all duration-1000 -translate-y-1/2 translate-x-1/3 ${
        isRunning ? 'bg-[#4facfe]/15' : 'bg-slate-200/50'
      }`} />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8">
        
        {/* Left Side: Status & Action */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {isRunning && (
              <div className="absolute inset-0 bg-[#4facfe] rounded-2xl blur-md opacity-30 animate-pulse" />
            )}
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border transition-all duration-500 ${
              isRunning 
                ? 'bg-blue-50/80 text-[#4facfe] border-blue-100 shadow-inner' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <Activity size={28} strokeWidth={2} />
            </div>
          </div>
          
          <div>
            <h2 className="text-[22px] font-semibold m-0 text-slate-800 tracking-tight">主服务器</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="relative flex h-2.5 w-2.5">
                {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              </span>
              <span className="text-[13px] text-slate-500 font-medium tracking-wide uppercase">
                {isRunning ? '广播中 & 活跃' : '服务离线'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Network Info */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 bg-slate-50/50 p-3 lg:p-4 rounded-2xl border border-slate-100/50">
          <div className="px-4">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Radio size={14} />
              <span className="text-[12px] font-medium uppercase tracking-wider">IPv4 地址</span>
            </div>
            <p className="text-[17px] font-semibold text-slate-700 m-0 font-mono tracking-tight">{ipAddress}</p>
          </div>
          
          <div className="w-px h-10 bg-slate-200/60 hidden sm:block" />
          
          <div className="px-4">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <ShieldCheck size={14} />
              <span className="text-[12px] font-medium uppercase tracking-wider">监听端口</span>
            </div>
            <p className="text-[17px] font-semibold text-slate-700 m-0 font-mono tracking-tight">{port}</p>
          </div>

          <div className="pl-4 sm:pl-2">
            <Button 
              type={isRunning ? "default" : "primary"} 
              danger={isRunning}
              icon={<Power size={16} />} 
              onClick={onToggle}
              className={`h-12 px-6 rounded-xl font-medium border-0 ${
                isRunning 
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600' 
                  : 'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white shadow-[0_4px_14px_rgba(79,172,254,0.3)] hover:opacity-90'
              }`}
            >
              {isRunning ? '终止' : '启动服务器'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusCard;