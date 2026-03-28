import React from "react";
import { Progress } from "antd";
import { FileCode, FileImage, FileVideo, FileArchive, CheckCircle2, PauseCircle, Zap } from "lucide-react";

interface TransferItemProps {
  fileName?: string;
  progress?: number;
  speed?: string;
  status?: "uploading" | "downloading" | "success" | "paused";
  fileType?: "image" | "video" | "document" | "archive";
}

const TransferItem: React.FC<TransferItemProps> = ({
  fileName = "design_system_v2.fig",
  progress = 68,
  speed = "12.4 MB/s",
  status = "uploading",
  fileType = "document"
}) => {
  const isSuccess = status === "success";
  
  const getIconConfig = () => {
    switch(fileType) {
      case "image": return { icon: FileImage, color: "text-[#ff6b9d]", bg: "bg-rose-50" };
      case "video": return { icon: FileVideo, color: "text-[#a18cd1]", bg: "bg-purple-50" };
      case "archive": return { icon: FileArchive, color: "text-amber-500", bg: "bg-amber-50" };
      default: return { icon: FileCode, color: "text-[#4facfe]", bg: "bg-blue-50" };
    }
  };

  const { icon: Icon, color, bg } = getIconConfig();

  return (
    <div data-cmp="TransferItem" className="bg-white p-5 rounded-[20px] border border-slate-100/80 hover-lift relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Success subtle background */}
      {isSuccess && <div className="absolute inset-0 bg-emerald-50/30 pointer-events-none" />}
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-50 text-emerald-500' : `${bg} ${color}`}`}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h4 className="text-[14px] font-semibold text-slate-800 m-0 truncate" title={fileName}>{fileName}</h4>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[12px] text-slate-400 capitalize font-medium">
                {status === 'uploading' ? '上传中' : status === 'downloading' ? '下载中' : status === 'success' ? '成功' : '暂停'}
              </span>
              {!isSuccess && (
                <span className="text-[12px] font-mono text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                  <Zap size={10} className="text-amber-400" /> {speed}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 pt-1">
            {isSuccess ? (
              <CheckCircle2 size={22} className="text-emerald-500 drop-shadow-sm" />
            ) : status === "paused" ? (
              <PauseCircle size={22} className="text-slate-300" />
            ) : (
              <div className="text-[13px] font-bold text-[#4facfe]">{progress}%</div>
            )}
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${isSuccess ? "opacity-0 h-0" : "opacity-100 h-auto"}`}>
          <Progress 
            percent={progress} 
            showInfo={false}
            size="small" 
            strokeColor={{ '0%': '#4facfe', '100%': '#00f2fe' }}
            trailColor="#f1f5f9"
          />
        </div>
      </div>
    </div>
  );
};

export default TransferItem;