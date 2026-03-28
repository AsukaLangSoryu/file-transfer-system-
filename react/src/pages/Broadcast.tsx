import React, { useState, useEffect } from "react";
import { Select, Button, message, Upload } from "antd";
import { Send, Users, Upload as UploadIcon } from "lucide-react";
import { api, createWebSocket } from "../lib/api";

const BroadcastPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
    const ws = createWebSocket((data) => {
      if (data.type === 'users_update') {
        setOnlineUsers(data.users);
      }
    });
    return () => ws.close();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await api.getFiles();
      setFiles(data.files);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleUpload = async (file: any) => {
    setUploading(true);
    try {
      await api.uploadFile(file);
      message.success('文件上传成功');
      setUploadedFile(file);
      setSelectedFile(file.name);
      await loadFiles();
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleBroadcast = async () => {
    if (!selectedFile || selectedUsers.length === 0) {
      message.warning('请选择文件和目标用户');
      return;
    }
    setLoading(true);
    try {
      await api.broadcastFile(selectedFile, selectedUsers);
      message.success(`已向 ${selectedUsers.length} 个用户广播文件`);
      setSelectedUsers([]);
      setSelectedFile("");
      setUploadedFile(null);
    } catch (error) {
      message.error('广播失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-[800px] mx-auto animate-fade-in">
      <header>
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight m-0">群发广播</h1>
        <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">同时向网络中的多个设备分发文件</p>
      </header>

      <div className="bg-white rounded-[32px] p-10 border border-slate-100/80 shadow-[0_8px_40px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-10 relative overflow-hidden">

        {/* Decorative element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#4facfe]/10 to-[#00f2fe]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Step 1 */}
        <section className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4facfe] flex items-center justify-center text-[14px] font-bold shadow-sm">1</div>
            <h3 className="text-[18px] font-semibold text-slate-800 m-0">选择文件</h3>
          </div>
          <div className="flex gap-3">
            <Select
              className="flex-1 font-medium"
              placeholder="从已上传文件中选择..."
              value={selectedFile}
              onChange={setSelectedFile}
              options={files.map(f => ({ value: f.name, label: f.name }))}
              size="large"
            />
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button size="large" loading={uploading} icon={<UploadIcon size={16} />}>
                或上传新文件
              </Button>
            </Upload>
          </div>
        </section>

        {/* Step 2 */}
        <section className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#ff6b9d] flex items-center justify-center text-[14px] font-bold shadow-sm">2</div>
            <h3 className="text-[18px] font-semibold text-slate-800 m-0">目标设备</h3>
          </div>
          <Select
            mode="multiple"
            allowClear
            className="w-full font-medium"
            placeholder="选择接收者..."
            value={selectedUsers}
            onChange={setSelectedUsers}
            options={onlineUsers.map((u, i) => ({ value: u.name, label: `${u.name} (${u.ip})` }))}
            size="large"
            suffixIcon={<Users size={16} className="text-slate-400" />}
          />
        </section>

        {/* Action */}
        <div className="pt-6 mt-2 border-t border-slate-100 flex justify-end relative z-10">
          <Button
            type="primary"
            size="large"
            loading={loading}
            disabled={!selectedFile || selectedUsers.length === 0}
            onClick={handleBroadcast}
            className={`h-14 px-8 rounded-xl text-[15px] border-0 transition-all duration-300 ${
              selectedFile && selectedUsers.length > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-[0_8px_20px_rgba(30,41,59,0.2)] hover:-translate-y-1'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send size={18} />
              执行广播
              {selectedUsers.length > 0 && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded text-[12px] font-bold">
                  {selectedUsers.length}
                </span>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastPage;