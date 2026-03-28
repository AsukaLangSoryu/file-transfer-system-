"""接收端模块 - 实现接收窗口和乱序处理"""
from typing import Dict, Optional, List
from src.protocol.packet import Packet
from src.config import WINDOW_SIZE


class Receiver:
    """接收端 - 实现接收窗口、乱序缓存和累积确认"""

    def __init__(self, window_size: int = WINDOW_SIZE):
        """初始化接收端

        Args:
            window_size: 接收窗口大小
        """
        self.window_size = window_size
        self.expected_seq = 0  # 期望接收的序号

        # 接收缓存：存储乱序到达的数据包
        self.recv_buffer: Dict[int, Packet] = {}

    def receive_packet(self, packet: Packet) -> int:
        """接收数据包并返回ACK号

        Args:
            packet: 接收到的数据包

        Returns:
            ACK号（期望接收的下一个序号）
        """
        seq = packet.seq_num

        # 重复包或超出窗口范围
        if seq < self.expected_seq or seq >= self.expected_seq + self.window_size:
            return self.expected_seq

        # 按序到达
        if seq == self.expected_seq:
            self.expected_seq += 1

            # 检查缓存中是否有连续的包
            while self.expected_seq in self.recv_buffer:
                del self.recv_buffer[self.expected_seq]
                self.expected_seq += 1

        # 乱序到达，缓存
        elif seq > self.expected_seq:
            self.recv_buffer[seq] = packet

        return self.expected_seq

    def get_data(self, seq: int) -> Optional[bytes]:
        """获取指定序号的数据

        Args:
            seq: 序号

        Returns:
            数据，如果不存在返回None
        """
        if seq in self.recv_buffer:
            return self.recv_buffer[seq].data
        return None

    def get_buffered_count(self) -> int:
        """获取缓存中的数据包数量"""
        return len(self.recv_buffer)

    def receive(self, connection) -> bytes:
        """接收完整数据流

        Args:
            connection: RDT连接对象

        Returns:
            接收到的完整数据
        """
        data_parts = []
        packets_received = {}

        while True:
            packet = connection.recv_packet()
            if packet is None:
                continue

            # FIN包表示传输结束
            if packet.is_fin():
                break

            seq = packet.seq_num
            if seq not in packets_received:
                packets_received[seq] = packet.data

            # 发送ACK
            ack_num = self.receive_packet(packet)
            connection.send_ack(ack_num)

        # 按序号排序并组合数据
        for seq in sorted(packets_received.keys()):
            data_parts.append(packets_received[seq])

        return b''.join(data_parts)
