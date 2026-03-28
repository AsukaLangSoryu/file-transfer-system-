"""拥塞控制模块单元测试"""

import unittest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.protocol.congestion import CongestionControl
from src.config import MSS, INITIAL_CWND, INITIAL_SSTHRESH


class TestCongestionControl(unittest.TestCase):
    """拥塞控制测试类"""

    def setUp(self):
        """测试前初始化"""
        self.cc = CongestionControl()

    def test_initialization(self):
        """测试初始化"""
        self.assertEqual(self.cc.cwnd, INITIAL_CWND * MSS)
        self.assertEqual(self.cc.ssthresh, INITIAL_SSTHRESH * MSS)
        self.assertEqual(self.cc.dup_ack_count, 0)
        self.assertFalse(self.cc.in_fast_recovery)

    def test_slow_start(self):
        """测试慢启动"""
        initial_cwnd = self.cc.cwnd
        self.cc.on_ack(1000)
        self.assertEqual(self.cc.cwnd, initial_cwnd + MSS)
        self.cc.on_ack(2000)
        self.assertEqual(self.cc.cwnd, initial_cwnd + 2 * MSS)

    def test_congestion_avoidance(self):
        """测试拥塞避免"""
        self.cc.cwnd = self.cc.ssthresh
        initial_cwnd = self.cc.cwnd
        self.cc.on_ack(1000)
        expected = initial_cwnd + int(MSS * MSS / initial_cwnd)
        self.assertEqual(self.cc.cwnd, expected)

    def test_fast_retransmit(self):
        """测试快速重传"""
        self.cc.cwnd = 10 * MSS
        self.cc.last_ack = 1000

        # 收到3个重复ACK
        self.cc.on_ack(1000)
        self.cc.on_ack(1000)
        self.cc.on_ack(1000)

        self.assertTrue(self.cc.in_fast_recovery)
        self.assertEqual(self.cc.ssthresh, 5 * MSS)
        self.assertEqual(self.cc.cwnd, 5 * MSS + 3 * MSS)

    def test_fast_recovery(self):
        """测试快速恢复"""
        self.cc.cwnd = 10 * MSS
        self.cc.last_ack = 1000

        # 进入快速恢复
        for _ in range(3):
            self.cc.on_ack(1000)

        # 快速恢复期间收到重复ACK
        cwnd_before = self.cc.cwnd
        self.cc.on_ack(1000)
        self.assertEqual(self.cc.cwnd, cwnd_before + MSS)

        # 收到新ACK，退出快速恢复
        self.cc.on_ack(2000)
        self.assertFalse(self.cc.in_fast_recovery)
        self.assertEqual(self.cc.cwnd, self.cc.ssthresh)

    def test_timeout(self):
        """测试超时处理"""
        self.cc.cwnd = 10 * MSS
        self.cc.on_timeout()

        self.assertEqual(self.cc.ssthresh, 5 * MSS)
        self.assertEqual(self.cc.cwnd, MSS)
        self.assertEqual(self.cc.dup_ack_count, 0)
        self.assertFalse(self.cc.in_fast_recovery)

    def test_effective_window(self):
        """测试有效窗口计算"""
        self.cc.cwnd = 10 * MSS
        recv_window = 8 * MSS

        effective = self.cc.get_effective_window(recv_window)
        self.assertEqual(effective, recv_window)

        recv_window = 12 * MSS
        effective = self.cc.get_effective_window(recv_window)
        self.assertEqual(effective, self.cc.cwnd)


if __name__ == '__main__':
    unittest.main()
