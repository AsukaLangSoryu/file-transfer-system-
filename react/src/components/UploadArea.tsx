import React, { useRef } from "react";
import { CloudUpload, Sparkles } from "lucide-react";
import { api } from "../lib/api";

interface UploadAreaProps {
  onUploadStart?: (filename: string) => void;
  onUploadProgress?: (filename: string, progress: number, loaded: number) => void;
  onUploadComplete?: (filename: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  onUploadStart,
  onUploadProgress,
  onUploadComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onUploadStart?.(file.name);

      try {
        await api.uploadFile(file, (progress, loaded) => {
          onUploadProgress?.(file.name, progress, loaded);
        });
        onUploadComplete?.(file.name);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return (
    <div
      data-cmp="UploadArea"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative w-full rounded-[28px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group overflow-hidden bg-white border border-slate-200/80 hover:border-[#4facfe]/40 hover:shadow-[0_0_0_1px_rgba(79,172,254,0.1),0_8px_24px_-4px_rgba(79,172,254,0.12)] hover:scale-[1.01]"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      {/* Dynamic hover background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] to-white opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#4facfe]/5 to-[#a18cd1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Dashed inner border */}
      <div className="absolute inset-4 border-2 border-dashed border-slate-200/80 rounded-[20px] group-hover:border-[#4facfe]/50 transition-all duration-500 pointer-events-none group-hover:scale-[0.98]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#4facfe] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
          <div className="w-20 h-20 rounded-[24px] bg-white border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
            <CloudUpload size={32} className="text-[#4facfe]" strokeWidth={1.5} />
          </div>
          <Sparkles size={16} className="absolute -top-1 -right-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 m-0 mb-3 text-center tracking-tight">
          拖放文件到此处
        </h3>
        <p className="text-[14px] text-slate-500 text-center max-w-sm leading-relaxed">
          或点击浏览本地文件。支持批量上传文档、图片和视频。
        </p>

        <div className="mt-6 px-6 py-2.5 rounded-full bg-slate-100 text-slate-600 text-[13px] font-medium group-hover:bg-[#4facfe] group-hover:text-white transition-all duration-300 group-hover:shadow-[0_4px_12px_rgba(79,172,254,0.25)]">
          浏览文件
        </div>
      </div>
    </div>
  );
};

export default UploadArea;