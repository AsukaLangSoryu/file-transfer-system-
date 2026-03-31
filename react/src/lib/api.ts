// API配置
const API_BASE_URL = `http://${window.location.hostname}:8000`;
const WS_URL = `ws://${window.location.hostname}:8000/ws`;

// API客户端
export const api = {
  // 上传文件
  uploadFile: async (file: File, onProgress?: (progress: number, loaded: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress, e.loaded);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));

      xhr.open('POST', `${API_BASE_URL}/api/upload`);
      xhr.send(formData);
    });
  },

  // 获取文件列表
  getFiles: async () => {
    const res = await fetch(`${API_BASE_URL}/api/files`);
    return res.json();
  },

  // 下载文件
  downloadFile: (filename: string) => {
    window.open(`${API_BASE_URL}/api/files/${filename}`, '_blank');
  },

  // 预览文件
  previewFile: async (filename: string) => {
    const res = await fetch(`${API_BASE_URL}/api/preview/${filename}`);
    return res.json();
  },

  // 群发文件
  broadcastFile: async (filename: string, users: string[]) => {
    const res = await fetch(`${API_BASE_URL}/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, users })
    });
    return res.json();
  },

  // 获取服务器状态
  getServerStatus: async () => {
    const res = await fetch(`${API_BASE_URL}/api/server/status`);
    return res.json();
  },

  // 删除文件
  deleteFile: async (filename: string) => {
    const res = await fetch(`${API_BASE_URL}/api/files/${filename}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// WebSocket连接
export const createWebSocket = (onMessage: (data: any) => void, onOpen?: () => void) => {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    if (onOpen) onOpen();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};
