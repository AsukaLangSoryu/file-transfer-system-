import React from "react";
import { Button } from "antd";
import { Image as ImageIcon, Film, FileText, Package, DownloadCloud, Trash2 } from "lucide-react";

interface FileCardProps {
  name?: string;
  size?: string;
  type?: "image" | "video" | "document" | "archive";
  date?: string;
  onDownload?: () => void;
  onDelete?: () => void;
}

const FileCard: React.FC<FileCardProps> = ({
  name = "brand_assets_2024.zip",
  size = "45.8 MB",
  type = "archive",
  date = "Oct 24, 2023",
  onDownload = () => console.log("Download"),
  onDelete = () => console.log("Delete"),
}) => {
  
  const getStyleConfig = () => {
    switch(type) {
      case "image": return { icon: ImageIcon, color: "text-rose-500", bg: "bg-rose-50", gradient: "from-rose-500/10 to-rose-500/0" };
      case "video": return { icon: Film, color: "text-purple-500", bg: "bg-purple-50", gradient: "from-purple-500/10 to-purple-500/0" };
      case "document": return { icon: FileText, color: "text-blue-500", bg: "bg-blue-50", gradient: "from-blue-500/10 to-blue-500/0" };
      default: return { icon: Package, color: "text-amber-500", bg: "bg-amber-50", gradient: "from-amber-500/10 to-amber-500/0" };
    }
  };

  const { icon: Icon, color, bg, gradient } = getStyleConfig();

  return (
    <div data-cmp="FileCard" className="bg-white rounded-[22px] p-5 border border-slate-100/80 hover:border-slate-200 hover-lift relative group flex flex-col cursor-pointer overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top soft gradient mask */}
      <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-b ${gradient} opacity-50 pointer-events-none`} />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center shadow-sm ${bg} ${color}`}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        
        {/* Action Buttons visible on hover */}
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#4facfe] hover:border-[#4facfe]/30 transition-colors"
          >
            <DownloadCloud size={14} strokeWidth={2} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-200 transition-colors"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
      
      <div className="mt-auto relative z-10">
        <h4 className="text-[14px] font-semibold text-slate-800 m-0 truncate mb-1.5" title={name}>{name}</h4>
        <div className="flex items-center justify-between text-[12px] text-slate-400 font-medium">
          <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-500">{size}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;