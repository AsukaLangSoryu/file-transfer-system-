#!/usr/bin/env python3
"""RDT客户端主程序"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import argparse
import socket
import logging
import os
from protocol.connection import Connection
from protocol.sender import Sender
from src import config


def setup_logging():
    """配置日志"""
    log_dir = Path(config.LOG_FILE).parent
    log_dir.mkdir(exist_ok=True)

    logging.basicConfig(
        level=getattr(logging, config.LOG_LEVEL),
        format='[%(asctime)s] %(levelname)s: %(message)s',
        handlers=[
            logging.FileHandler(config.LOG_FILE),
            logging.StreamHandler()
        ]
    )


def send_file(conn: Connection, file_path: str):
    """发送文件"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"文件不存在: {file_path}")

    with open(file_path, 'rb') as f:
        data = f.read()

    logging.info(f"开始发送文件: {file_path}, 大小: {len(data)} 字节")

    sender = Sender()
    sender.send(conn, data)

    logging.info("文件发送完成")


def run_client(host: str, port: int, file_path: str):
    """运行客户端"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        logging.info(f"连接到服务器 {host}:{port}")
        sock.bind(('', 0))
        local_port = sock.getsockname()[1]
        conn = Connection(sock, ('', local_port))
        conn.connect((host, port))

        send_file(conn, file_path)
        conn.close()

        logging.info("传输完成，连接关闭")

    except Exception as e:
        logging.error(f"传输失败: {e}")
        raise
    finally:
        sock.close()


def main():
    parser = argparse.ArgumentParser(description='RDT文件传输客户端')
    parser.add_argument('file', help='要发送的文件路径')
    parser.add_argument('--host', default=config.HOST, help='服务器地址')
    parser.add_argument('--port', type=int, default=config.PORT, help='服务器端口')

    args = parser.parse_args()

    setup_logging()
    run_client(args.host, args.port, args.file)


if __name__ == '__main__':
    main()
