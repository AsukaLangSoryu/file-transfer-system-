import React, { useState, useEffect } from "react";
import { Input, Select, Modal } from "antd";
import { Search, SlidersHorizontal } from "lucide-react";
import FileCard from "../components/FileCard";
import FilePreviewModal from "../components/FilePreviewModal";
import { api } from "../lib/api";

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await api.getFiles();
      setFiles(data.files);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleDelete = async (filename: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文件 "${filename}" 吗？`,
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.deleteFile(filename);
          await loadFiles();
        } catch (error) {
          console.error('Delete failed:', error);
          Modal.error({ title: '删除失败', content: '无法删除文件，请重试' });
        }
      }
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handlePreview = async (file: any) => {
    try {
      if (file.type === "document") {
        const data = await api.previewFile(file.name);
        setPreview({ ...file, content: data.content, previewType: "text" });
      } else if (file.type === "image") {
        setPreview({ ...file, url: `http://${window.location.hostname}:8000/api/files/${file.name}`, previewType: "image" });
      } else if (file.type === "video") {
        setPreview({ ...file, url: `http://${window.location.hostname}:8000/api/files/${file.name}`, previewType: "video" });
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-4">
        <div>
          <h1 className="text-[32px] font-bold text-slate-800 tracking-tight m-0">文件库</h1>
          <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">访问和管理所有成功传输的文件</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            prefix={<Search size={16} className="text-slate-400 mr-1" />}
            placeholder="按名称搜索..."
            className="w-full sm:w-[240px] shadow-sm font-medium text-[14px]"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            className="w-[140px] shadow-sm font-medium"
            suffixIcon={<SlidersHorizontal size={14} className="text-slate-400" />}
            size="large"
            options={[
              { value: 'all', label: '所有类型' },
              { value: 'image', label: '图片' },
              { value: 'video', label: '视频' },
              { value: 'document', label: '文档' },
              { value: 'archive', label: '压缩包' },
            ]}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, idx) => (
            <div key={idx} onClick={() => handlePreview(file)}>
              <FileCard
                name={file.name}
                size={formatFileSize(file.size)}
                type={file.type}
                date={formatDate(file.modified)}
                onDownload={() => api.downloadFile(file.name)}
                onDelete={() => handleDelete(file.name)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {searchTerm || filterType !== 'all' ? '未找到匹配的文件' : '暂无文件'}
          </div>
        )}
      </div>

      {preview && (
        <FilePreviewModal
          filename={preview.name}
          type={preview.previewType}
          content={preview.content}
          url={preview.url}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

export default FilesPage;