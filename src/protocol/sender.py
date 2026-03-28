"""发送端模块 - 实现滑动窗口和可靠传输"""
import time
from typing import Dict, Optional
from src.protocol.packet import Packet
from src.utils.timer import Timer
from src.config import WINDOW_SIZE, TIMEOUT, ALPHA, BETA, MAX_RETRIES


class Sender:
    """发送端 - 实现滑动窗口、超时重传和RTT估计"""

    def __init__(self, window_size: int = WINDOW_SIZE):
        """初始化发送端

        Args:
            window_size: 发送窗口大小
        """
        self.window_size = window_size
        self.base = 0  # 窗口基序号
        self.next_seq = 0  # 下一个可用序号

        # 发送窗口：存储已发送但未确认的数据包
        self.send_window: Dict[int, Packet] = {}

        # 定时器字典：每个数据包一个定时器
        self.timers: Dict[int, Timer] = {}

        # RTT估计
        self.srtt = TIMEOUT  # 平滑RTT
        self.rttvar = TIMEOUT / 2  # RTT变化量
        self.rto = TIMEOUT  # 重传超时时间

        # 发送时间记录
        self.send_times: Dict[int, float] = {}

        # 重传计数
        self.retries: Dict[int, int] = {}

    def can_send(self) -> bool:
        """检查是否可以发送新数据包"""
        return self.next_seq < self.base + self.window_size

    def send_packet(self, packet: Packet) -> bool:
        """发送数据包

        Args:
            packet: 要发送的数据包

        Returns:
            是否成功发送
        """
        if not self.can_send():
            return False

        packet.seq_num = self.next_seq
        self.send_window[self.next_seq] = packet
        self.send_times[self.next_seq] = time.time()
        self.retries[self.next_seq] = 0

        # 启动定时器
        timer = Timer(self.rto)
        timer.start()
        self.timers[self.next_seq] = timer

        self.next_seq += 1
        return True

    def receive_ack(self, ack_num: int) -> bool:
        """接收ACK - 累积确认

        Args:
            ack_num: 确认号

        Returns:
            是否有效ACK
        """
        if ack_num <= self.base:
            return False

        # 更新RTT估计（仅对未重传的包）
        if ack_num - 1 in self.send_times and self.retries.get(ack_num - 1, 0) == 0:
            sample_rtt = time.time() - self.send_times[ack_num - 1]
            self._update_rtt(sample_rtt)

        # 累积确认：移除所有小于ack_num的包
        for seq in range(self.base, ack_num):
            if seq in self.send_window:
                del self.send_window[seq]
            if seq in self.timers:
                self.timers[seq].stop()
                del self.timers[seq]
            if seq in self.send_times:
                del self.send_times[seq]
            if seq in self.retries:
                del self.retries[seq]

        self.base = ack_num
        return True

    def check_timeout(self) -> Optional[int]:
        """检查超时并返回需要重传的序号

        Returns:
            超时的序号，如果没有超时返回None
        """
        for seq, timer in self.timers.items():
            if timer.is_timeout():
                if self.retries[seq] >= MAX_RETRIES:
                    return None  # 超过最大重传次数
                return seq
        return None

    def retransmit(self, seq: int) -> Optional[Packet]:
        """重传指定序号的数据包

        Args:
            seq: 序号

        Returns:
            重传的数据包，如果不存在返回None
        """
        if seq not in self.send_window:
            return None

        self.retries[seq] += 1
        self.send_times[seq] = time.time()

        # 重置定时器，使用指数退避
        self.timers[seq].timeout = self.rto * (2 ** (self.retries[seq] - 1))
        self.timers[seq].reset()

        return self.send_window[seq]

    def _update_rtt(self, sample_rtt: float):
        """更新RTT估计 - 使用指数加权移动平均

        Args:
            sample_rtt: 采样RTT
        """
        if self.srtt == TIMEOUT:  # 首次测量
            self.srtt = sample_rtt
            self.rttvar = sample_rtt / 2
        else:
            self.rttvar = (1 - BETA) * self.rttvar + BETA * abs(self.srtt - sample_rtt)
            self.srtt = (1 - ALPHA) * self.srtt + ALPHA * sample_rtt

        self.rto = self.srtt + 4 * self.rttvar
        self.rto = max(0.2, min(self.rto, 60.0))  # 限制在[0.2, 60]秒

    def get_window_size(self) -> int:
        """获取当前可用窗口大小"""
        return self.window_size - (self.next_seq - self.base)

    def send(self, connection, data: bytes):
        """发送完整数据流

        Args:
            connection: RDT连接对象
            data: 要发送的数据
        """
        from src.config import MSS

        # 分片
        chunks = [data[i:i+MSS] for i in range(0, len(data), MSS)]

        for chunk in chunks:
            while not self.can_send():
                # 检查超时
                timeout_seq = self.check_timeout()
                if timeout_seq is not None:
                    packet = self.retransmit(timeout_seq)
                    if packet:
                        connection.send_packet(packet)

                # 接收ACK
                ack_packet = connection.recv_packet(timeout=0.01)
                if ack_packet and ack_packet.is_ack():
                    self.receive_ack(ack_packet.ack_num)

            # 发送数据包
            packet = Packet(data=chunk)
            if self.send_packet(packet):
                connection.send_packet(packet)

        # 等待所有ACK
        while self.base < self.next_seq:
            timeout_seq = self.check_timeout()
            if timeout_seq is not None:
                packet = self.retransmit(timeout_seq)
                if packet:
                    connection.send_packet(packet)

            ack_packet = connection.recv_packet(timeout=0.01)
            if ack_packet and ack_packet.is_ack():
                self.receive_ack(ack_packet.ack_num)

        # 发送FIN表示传输完成
        fin_packet = Packet(flags=Packet.FLAG_FIN)
        connection.send_packet(fin_packet)

