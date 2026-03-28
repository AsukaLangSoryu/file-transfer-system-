import React from "react";
import { Laptop, Smartphone, Tablet, Monitor } from "lucide-react";

interface UserItemProps {
  name?: string;
  ip?: string;
  deviceType?: "desktop" | "mobile" | "tablet";
  isOnline?: boolean;
}

const UserItem: React.FC<UserItemProps> = ({
  name = "MacBook Pro M2",
  ip = "192.168.1.102",
  deviceType = "desktop",
  isOnline = true,
}) => {
  
  const getDeviceIcon = () => {
    switch(deviceType) {
      case 'desktop': return <Monitor size={20} />;
      case 'mobile': return <Smartphone size={20} />;
      case 'tablet': return <Tablet size={20} />;
      default: return <Laptop size={20} />;
    }
  };

  const isMobile = deviceType === 'mobile';

  return (
    <div data-cmp="UserItem" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100/80 hover:border-[#4facfe]/30 hover-lift transition-all duration-300 group cursor-default shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors duration-300 ${
          isMobile 
            ? 'bg-rose-50 text-[#ff6b9d] group-hover:bg-[#ff6b9d] group-hover:text-white' 
            : 'bg-indigo-50 text-[#a18cd1] group-hover:bg-[#a18cd1] group-hover:text-white'
        }`}>
          {getDeviceIcon()}
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-slate-800 m-0">{name}</h4>
          <p className="text-[13px] text-slate-400 font-mono mt-0.5 m-0 bg-slate-50 inline-block px-1.5 rounded-md">{ip}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        </div>
      </div>
    </div>
  );
};

export default UserItem;