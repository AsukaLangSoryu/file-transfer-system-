import React from "react";
import { X } from "lucide-react";

interface FilePreviewModalProps {
  filename: string;
  type: "text" | "image" | "video";
  content?: string;
  url?: string;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  filename,
  type,
  content,
  url,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">{filename}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
          {type === "text" && (
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-slate-50 p-4 rounded-xl">
              {content}
            </pre>
          )}

          {type === "image" && url && (
            <img src={url} alt={filename} className="max-w-full h-auto rounded-xl" />
          )}

          {type === "video" && url && (
            <video controls className="w-full rounded-xl">
              <source src={url} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
