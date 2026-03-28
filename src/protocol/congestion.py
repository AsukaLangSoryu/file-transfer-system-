"""拥塞控制模块

实现TCP Reno拥塞控制算法：
- 慢启动（Slow Start）
- 拥塞避免（Congestion Avoidance）
- 快速重传（Fast Retransmit）
- 快速恢复（Fast Recovery）
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.config import MSS, INITIAL_CWND, INITIAL_SSTHRESH


class CongestionControl:
    """拥塞控制类"""

    def __init__(self):
        """初始化拥塞控制参数"""
        self.cwnd = INITIAL_CWND * MSS  # 拥塞窗口（字节）
        self.ssthresh = INITIAL_SSTHRESH * MSS  # 慢启动阈值（字节）
        self.dup_ack_count = 0  # 重复ACK计数
        self.last_ack = 0  # 上一个ACK号
        self.in_fast_recovery = False  # 是否处于快速恢复状态

    def on_ack(self, ack_num):
        """处理收到的ACK

        Args:
            ack_num: 确认号
        """
        if ack_num > self.last_ack:
            # 新ACK
            if self.in_fast_recovery:
                # 退出快速恢复
                self.cwnd = self.ssthresh
                self.in_fast_recovery = False
            else:
                # 正常增长
                if self.cwnd < self.ssthresh:
                    # 慢启动：指数增长
                    self.cwnd += MSS
                else:
                    # 拥塞避免：线性增长
                    self.cwnd += int(MSS * MSS / self.cwnd)

            self.last_ack = ack_num
            self.dup_ack_count = 0

        elif ack_num == self.last_ack:
            # 重复ACK
            self.dup_ack_count += 1

            if self.dup_ack_count == 3:
                # 快速重传
                self.ssthresh = max(self.cwnd // 2, 2 * MSS)
                self.cwnd = self.ssthresh + 3 * MSS
                self.in_fast_recovery = True

            elif self.in_fast_recovery:
                # 快速恢复期间继续增长
                self.cwnd += MSS

    def on_timeout(self):
        """处理超时事件"""
        self.ssthresh = max(self.cwnd // 2, 2 * MSS)
        self.cwnd = MSS
        self.dup_ack_count = 0
        self.in_fast_recovery = False

    def get_cwnd(self):
        """获取当前拥塞窗口大小

        Returns:
            int: 拥塞窗口大小（字节）
        """
        return int(self.cwnd)

    def get_effective_window(self, recv_window):
        """获取有效发送窗口

        Args:
            recv_window: 接收窗口大小（字节）

        Returns:
            int: 有效窗口大小（字节）
        """
        return min(self.get_cwnd(), recv_window)
