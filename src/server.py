#!/usr/bin/env python3
"""RDT服务器主程序"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import argparse
import socket
import logging
import os
from protocol.connection import Connection
from protocol.receiver import Receiver
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


def receive_file(conn: Connection, save_path: str):
    """接收文件并保存"""
    receiver = Receiver()

    logging.info(f"开始接收文件，保存到: {save_path}")
    data = receiver.receive(conn)

    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    with open(save_path, 'wb') as f:
        f.write(data)

    logging.info(f"文件接收完成，大小: {len(data)} 字节")


def run_server(host: str, port: int, save_dir: str):
    """运行服务器"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((host, port))
    logging.info(f"服务器启动，监听 {host}:{port}")

    try:
        file_count = 0
        while True:
            logging.info("等待客户端连接...")
            conn = Connection(sock, (host, port))
            conn.listen()
            conn.accept()

            file_count += 1
            save_path = os.path.join(save_dir, f"received_{file_count}.dat")

            try:
                receive_file(conn, save_path)
                conn.close()
            except Exception as e:
                logging.error(f"文件传输失败: {e}")
                conn.close()

    except KeyboardInterrupt:
        logging.info("服务器关闭")
    finally:
        sock.close()


def main():
    parser = argparse.ArgumentParser(description='RDT文件传输服务器')
    parser.add_argument('--host', default=config.HOST, help='监听地址')
    parser.add_argument('--port', type=int, default=config.PORT, help='监听端口')
    parser.add_argument('--save-dir', default='received', help='文件保存目录')

    args = parser.parse_args()

    setup_logging()
    run_server(args.host, args.port, args.save_dir)


if __name__ == '__main__':
    main()
