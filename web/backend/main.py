from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import asyncio
import aiofiles
import os
from pathlib import Path
from datetime import datetime
import json
from typing import List
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 全局状态
clients = []
transfers = {}
online_users = []

class TransferManager:
    def __init__(self, max_concurrent=3):
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.active_transfers = {}

    async def add_transfer(self, transfer_id: str, filename: str):
        self.active_transfers[transfer_id] = {
            "filename": filename,
            "progress": 0,
            "status": "uploading",
            "start_time": datetime.now()
        }

    async def update_progress(self, transfer_id: str, progress: int):
        if transfer_id in self.active_transfers:
            self.active_transfers[transfer_id]["progress"] = progress
            await broadcast_transfer_update(transfer_id, self.active_transfers[transfer_id])

transfer_manager = TransferManager(max_concurrent=3)


async def broadcast_transfer_update(transfer_id: str, data: dict):
    """广播传输进度更新"""
    message = {"type": "transfer_update", "transfer_id": transfer_id, "data": data}
    for client in clients:
        try:
            await client.send_json(message)
        except:
            pass

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    current_user = None

    # 发送当前在线用户列表
    await websocket.send_json({
        "type": "users_update",
        "users": online_users
    })

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "register":
                current_user = data.get("user")
                online_users.append(current_user)
                await broadcast_users_update()
    except:
        clients.remove(websocket)
        if current_user and current_user in online_users:
            online_users.remove(current_user)
            await broadcast_users_update()

async def broadcast_users_update():
    """广播用户列表更新"""
    message = {"type": "users_update", "users": online_users}
    for client in clients:
        try:
            await client.send_json(message)
        except:
            pass


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """文件上传接口 - 支持多线程并发"""
    transfer_id = str(uuid.uuid4())

    async with transfer_manager.semaphore:
        await transfer_manager.add_transfer(transfer_id, file.filename)

        file_path = UPLOAD_DIR / file.filename
        file_size = 0

        async with aiofiles.open(file_path, 'wb') as f:
            while chunk := await file.read(8192):
                await f.write(chunk)
                file_size += len(chunk)
                # 更新进度
                if file.size:
                    progress = int((file_size / file.size) * 100)
                    await transfer_manager.update_progress(transfer_id, progress)

        # 完成
        transfer_manager.active_transfers[transfer_id]["status"] = "success"
        transfer_manager.active_transfers[transfer_id]["progress"] = 100

        return {
            "transfer_id": transfer_id,
            "filename": file.filename,
            "size": file_size,
            "status": "success"
        }


@app.get("/api/files")
async def list_files():
    """获取文件列表"""
    files = []
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.is_file():
            stat = file_path.stat()
            files.append({
                "name": file_path.name,
                "size": stat.st_size,
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "type": get_file_type(file_path.name)
            })
    return {"files": files}

@app.get("/api/files/{filename}")
async def download_file(filename: str):
    """下载文件"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

@app.delete("/api/files/{filename}")
async def delete_file(filename: str):
    """删除文件"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    file_path.unlink()
    return {"status": "deleted", "filename": filename}

@app.get("/api/preview/{filename}")
async def preview_file(filename: str):
    """预览文件（文本/图片）"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    file_type = get_file_type(filename)
    if file_type == "document":
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
        return {"type": "text", "content": content}
    else:
        return FileResponse(file_path)

def get_file_type(filename: str) -> str:
    """根据文件扩展名判断类型"""
    ext = filename.lower().split('.')[-1]
    if ext in ['txt', 'md', 'json', 'py', 'js', 'html', 'css']:
        return "document"
    elif ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
        return "image"
    elif ext in ['mp4', 'avi', 'mov', 'wmv', 'flv']:
        return "video"
    elif ext in ['zip', 'rar', '7z', 'tar', 'gz']:
        return "archive"
    return "document"


@app.post("/api/broadcast")
async def broadcast_file(data: dict):
    """群发文件到多个用户"""
    target_users = data.get("users", [])
    filename = data.get("filename")

    if not filename or not target_users:
        raise HTTPException(status_code=400, detail="Missing users or filename")

    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # 广播到所有目标用户
    broadcast_id = str(uuid.uuid4())
    message = {
        "type": "broadcast",
        "broadcast_id": broadcast_id,
        "filename": filename,
        "targets": target_users
    }

    for client in clients:
        try:
            await client.send_json(message)
        except:
            pass

    return {"broadcast_id": broadcast_id, "status": "sent", "targets": len(target_users)}

@app.get("/api/server/status")
async def get_server_status():
    """获取服务器状态"""
    return {
        "running": True,
        "online_users": len(online_users),
        "active_transfers": len(transfer_manager.active_transfers),
        "total_files": len(list(UPLOAD_DIR.iterdir()))
    }

@app.get("/api/transfers")
async def get_active_transfers():
    """获取活动传输列表"""
    return {"transfers": list(transfer_manager.active_transfers.values())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
