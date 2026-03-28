"""发送端单元测试"""
import unittest
import time
from src.protocol.sender import Sender
from src.protocol.packet import Packet


class TestSender(unittest.TestCase):
    """发送端测试用例"""

    def setUp(self):
        """测试前初始化"""
        self.sender = Sender(window_size=5)

    def test_init(self):
        """测试初始化"""
        self.assertEqual(self.sender.base, 0)
        self.assertEqual(self.sender.next_seq, 0)
        self.assertEqual(self.sender.window_size, 5)

    def test_can_send(self):
        """测试窗口控制"""
        self.assertTrue(self.sender.can_send())

        # 填满窗口
        for i in range(5):
            packet = Packet(data=f"data{i}".encode())
            self.assertTrue(self.sender.send_packet(packet))

        self.assertFalse(self.sender.can_send())

    def test_send_packet(self):
        """测试发送数据包"""
        packet = Packet(data=b"test")
        result = self.sender.send_packet(packet)

        self.assertTrue(result)
        self.assertEqual(packet.seq_num, 0)
        self.assertEqual(self.sender.next_seq, 1)
        self.assertIn(0, self.sender.send_window)

    def test_receive_ack(self):
        """测试接收ACK"""
        # 发送3个包
        for i in range(3):
            packet = Packet(data=f"data{i}".encode())
            self.sender.send_packet(packet)

        # 累积确认到seq=2
        result = self.sender.receive_ack(2)
        self.assertTrue(result)
        self.assertEqual(self.sender.base, 2)
        self.assertNotIn(0, self.sender.send_window)
        self.assertNotIn(1, self.sender.send_window)
        self.assertIn(2, self.sender.send_window)

    def test_timeout(self):
        """测试超时检测"""
        packet = Packet(data=b"test")
        self.sender.send_packet(packet)

        # 未超时
        self.assertIsNone(self.sender.check_timeout())

        # 模拟超时
        self.sender.timers[0].start_time = time.time() - 10
        seq = self.sender.check_timeout()
        self.assertEqual(seq, 0)

    def test_retransmit(self):
        """测试重传"""
        packet = Packet(data=b"test")
        self.sender.send_packet(packet)

        retrans_packet = self.sender.retransmit(0)
        self.assertIsNotNone(retrans_packet)
        self.assertEqual(self.sender.retries[0], 1)

    def test_rtt_update(self):
        """测试RTT更新"""
        initial_rto = self.sender.rto
        self.sender._update_rtt(0.5)
        self.assertNotEqual(self.sender.rto, initial_rto)


if __name__ == '__main__':
    unittest.main()
