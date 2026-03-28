"""数据包封装与解析模块"""
import struct
from typing import Tuple
from src.utils.checksum import calculate_checksum, verify_checksum


class Packet:
    """UDP可靠传输协议数据包

    包头格式（20字节）：
    - src_port: 2字节
    - dst_port: 2字节
    - seq_num: 4字节
    - ack_num: 4字节
    - flags: 1字节 (SYN|ACK|FIN|RST)
    - window: 2字节
    - checksum: 2字节
    - data_len: 2字节
    - reserved: 1字节
    """

    HEADER_FORMAT = '!HHIIBHHHB'
    HEADER_SIZE = 20

    # 标志位
    FLAG_SYN = 0x01
    FLAG_ACK = 0x02
    FLAG_FIN = 0x04
    FLAG_RST = 0x08

    def __init__(self, src_port: int = 0, dst_port: int = 0, seq_num: int = 0,
                 ack_num: int = 0, flags: int = 0, window: int = 0,
                 data: bytes = b''):
        """初始化数据包

        Args:
            src_port: 源端口
            dst_port: 目标端口
            seq_num: 序列号
            ack_num: 确认号
            flags: 标志位
            window: 窗口大小
            data: 数据负载
        """
        self.src_port = src_port
        self.dst_port = dst_port
        self.seq_num = seq_num
        self.ack_num = ack_num
        self.flags = flags
        self.window = window
        self.data = data
        self.checksum = 0

    def pack(self) -> bytes:
        """打包数据包为字节流

        Returns:
            打包后的字节流
        """
        data_len = len(self.data)
        header = struct.pack(
            self.HEADER_FORMAT,
            self.src_port,
            self.dst_port,
            self.seq_num,
            self.ack_num,
            self.flags,
            self.window,
            0,  # checksum placeholder
            data_len,
            0   # reserved
        )
        packet = header + self.data
        self.checksum = calculate_checksum(packet)

        header = struct.pack(
            self.HEADER_FORMAT,
            self.src_port,
            self.dst_port,
            self.seq_num,
            self.ack_num,
            self.flags,
            self.window,
            self.checksum,
            data_len,
            0
        )
        return header + self.data

    @staticmethod
    def unpack(packet_bytes: bytes) -> 'Packet':
        """解包字节流为数据包对象

        Args:
            packet_bytes: 字节流

        Returns:
            解包后的Packet对象

        Raises:
            ValueError: 数据包格式错误或校验和错误
        """
        if len(packet_bytes) < Packet.HEADER_SIZE:
            raise ValueError("数据包长度不足")

        header = packet_bytes[:Packet.HEADER_SIZE]
        data = packet_bytes[Packet.HEADER_SIZE:]

        fields = struct.unpack(Packet.HEADER_FORMAT, header)
        src_port, dst_port, seq_num, ack_num, flags, window, checksum, data_len, _ = fields

        packet = Packet(src_port, dst_port, seq_num, ack_num, flags, window, data)

        # 验证校验和：将checksum字段置零后重新计算
        header_zero_checksum = struct.pack(
            Packet.HEADER_FORMAT,
            src_port, dst_port, seq_num, ack_num, flags, window, 0, data_len, 0
        )
        if not verify_checksum(header_zero_checksum + data, checksum):
            raise ValueError("校验和错误")

        return packet

    def is_syn(self) -> bool:
        """是否为SYN包"""
        return bool(self.flags & self.FLAG_SYN)

    def is_ack(self) -> bool:
        """是否为ACK包"""
        return bool(self.flags & self.FLAG_ACK)

    def is_fin(self) -> bool:
        """是否为FIN包"""
        return bool(self.flags & self.FLAG_FIN)

    def is_rst(self) -> bool:
        """是否为RST包"""
        return bool(self.flags & self.FLAG_RST)

    def __repr__(self) -> str:
        flags_str = []
        if self.is_syn():
            flags_str.append('SYN')
        if self.is_ack():
            flags_str.append('ACK')
        if self.is_fin():
            flags_str.append('FIN')
        if self.is_rst():
            flags_str.append('RST')
        return f"Packet(seq={self.seq_num}, ack={self.ack_num}, flags={','.join(flags_str)}, len={len(self.data)})"

