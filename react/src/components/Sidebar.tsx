import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Server, MonitorUp, FolderOpen, Send, Zap } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Server, label: "服务器面板" },
    { path: "/client", icon: MonitorUp, label: "传输客户端" },
    { path: "/files", icon: FolderOpen, label: "文件管理" },
    { path: "/broadcast", icon: Send, label: "群发广播" },
  ];

  return (
    <aside data-cmp="Sidebar" className="w-[280px] h-full bg-white/60 backdrop-blur-xl border-r border-slate-100/60 flex flex-col pt-10 pb-8 px-6 flex-shrink-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-14">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,172,254,0.3)]">
          <Zap size={20} strokeWidth={2.5} fill="currentColor" className="opacity-90" />
        </div>
        <span className="text-[22px] font-bold font-['Poppins'] tracking-tight text-slate-800">
          文件<span className="text-[#4facfe]">传输</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">主菜单</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} to={item.path} className="relative group outline-none">
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4facfe] rounded-r-full" />
              )}
              
              <div
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ml-2 ${
                  isActive
                    ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] text-[#4facfe] font-medium border border-slate-100/50"
                    : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#4facfe]" : "text-slate-400 group-hover:text-slate-500 transition-colors"} />
                <span className="text-[14px] leading-none mt-0.5">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User / Footer Area */}
      <div className="mt-auto pt-6 border-t border-slate-100/50 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-soft border border-white flex items-center justify-center text-[#a18cd1] text-sm font-semibold">
            US
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-700 leading-tight">本地网络</p>
            <p className="text-[11px] text-slate-400 mt-0.5">已连接 • v2.1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;