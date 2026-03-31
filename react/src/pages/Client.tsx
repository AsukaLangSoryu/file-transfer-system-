import React, { useState, useEffect } from "react";
import { message } from "antd";
import UploadArea from "../components/UploadArea";
import TransferItem from "../components/TransferItem";
import { ArrowDownUp } from "lucide-react";
import { api } from "../lib/api";
import { useWebSocket } from "../contexts/WebSocketContext";

interface Transfer {
  filename: string;
  progress: number;
  status: "uploading" | "success";
  speed?: string;
  startTime?: number;
  loaded?: number;
}

const ClientPage: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const { addMessageHandler, removeMessageHandler } = useWebSocket();

  useEffect(() => {
    const handleMessage = (data: any) => {
      if (data.type === 'broadcast') {
        message.info({
          content: `收到广播文件: ${data.filename}`,
          duration: 5,
          onClick: () => api.downloadFile(data.filename)
        });
      }
    };

    addMessageHandler('client', handleMessage);
    return () => removeMessageHandler('client');
  }, []);

  const handleUploadStart = (filename: string) => {
    setTransfers(prev => [...prev, {
      filename,
      progress: 0,
      status: "uploading",
      speed: "0 MB/s",
      startTime: Date.now(),
      loaded: 0
    }]);
  };

  const handleUploadProgress = (filename: string, progress: number, loaded: number) => {
    setTransfers(prev => prev.map(t => {
      if (t.filename === filename) {
        const elapsed = (Date.now() - (t.startTime || Date.now())) / 1000;
        const speed = elapsed > 0 ? `${(loaded / 1024 / 1024 / elapsed).toFixed(1)} MB/s` : "0 MB/s";
        return { ...t, progress, speed, loaded };
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