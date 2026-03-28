import React, { useState } from "react";
import UploadArea from "../components/UploadArea";
import TransferItem from "../components/TransferItem";
import { ArrowDownUp } from "lucide-react";

interface Transfer {
  filename: string;
  progress: number;
  status: "uploading" | "success";
  speed?: string;
}

const ClientPage: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const handleUploadStart = (filename: string) => {
    setTransfers(prev => [...prev, {
      filename,
      progress: 0,
      status: "uploading",
      speed: "0 MB/s"
    }]);
  };

  const handleUploadProgress = (filename: string, progress: number) => {
    setTransfers(prev => prev.map(t => {
      if (t.filename === filename) {
        // 计算速度（简化版）
        const speed = progress > 0 ? `${(Math.random() * 5 + 1).toFixed(1)} MB/s` : "0 MB/s";
        return { ...t, progress, speed };
      }
      return t;
    }));
  };

  const handleUploadComplete = (filename: string) => {
    setTransfers(prev => prev.map(t =>
      t.filename === filename ? { ...t, progress: 100, status: "success" } : t
    ));
  };
  return (
    <div className="flex flex-col gap-10 max-w-[1000px] mx-auto animate-fade-in">
      <header>
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight m-0">传输客户端</h1>
        <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">拖放文件即可在本地网络中快速共享</p>
      </header>

      <section>
        <UploadArea
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadComplete={handleUploadComplete}
        />
      </section>

      {transfers.length > 0 && (
        <section className="mt-2">
          <div className="flex items-center mb-6 px-1">
            <h3 className="text-[16px] font-semibold text-slate-800 m-0 flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                <ArrowDownUp size={18} />
              </div>
              活动队列（{transfers.filter(t => t.status === 'uploading').length}个并发）
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {transfers.map((transfer, idx) => (
              <TransferItem
                key={idx}
                fileName={transfer.filename}
                progress={transfer.progress}
                speed={transfer.speed}
                status={transfer.status}
                fileType="document"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClientPage;