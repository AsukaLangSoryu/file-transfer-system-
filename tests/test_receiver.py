"""接收端单元测试"""
import unittest
from src.protocol.receiver import Receiver
from src.protocol.packet import Packet


class TestReceiver(unittest.TestCase):
    """接收端测试用例"""

    def setUp(self):
        """测试前初始化"""
        self.receiver = Receiver(window_size=5)

    def test_init(self):
        """测试初始化"""
        self.assertEqual(self.receiver.expected_seq, 0)
        self.assertEqual(self.receiver.window_size, 5)

    def test_receive_in_order(self):
        """测试按序接收"""
        packet = Packet(seq_num=0, data=b"data0")
        ack = self.receiver.receive_packet(packet)

        self.assertEqual(ack, 1)
        self.assertEqual(self.receiver.expected_seq, 1)

    def test_receive_out_of_order(self):
        """测试乱序接收"""
        # 先收到seq=2
        packet2 = Packet(seq_num=2, data=b"data2")
        ack = self.receiver.receive_packet(packet2)
        self.assertEqual(ack, 0)  # 仍期望seq=0
        self.assertEqual(self.receiver.get_buffered_count(), 1)

        # 收到seq=0
        packet0 = Packet(seq_num=0, data=b"data0")
        ack = self.receiver.receive_packet(packet0)
        self.assertEqual(ack, 1)  # 期望seq=1

    def test_receive_continuous_buffered(self):
        """测试缓存连续包的处理"""
        # 收到seq=1,2,3（缺seq=0）
        for i in range(1, 4):
            packet = Packet(seq_num=i, data=f"data{i}".encode())
            self.receiver.receive_packet(packet)

        self.assertEqual(self.receiver.get_buffered_count(), 3)

        # 收到seq=0，应该连续确认到seq=4
        packet0 = Packet(seq_num=0, data=b"data0")
        ack = self.receiver.receive_packet(packet0)
        self.assertEqual(ack, 4)
        self.assertEqual(self.receiver.get_buffered_count(), 0)

    def test_duplicate_packet(self):
        """测试重复包"""
        packet = Packet(seq_num=0, data=b"data0")
        ack1 = self.receiver.receive_packet(packet)
        self.assertEqual(ack1, 1)

        # 再次收到seq=0
        ack2 = self.receiver.receive_packet(packet)
        self.assertEqual(ack2, 1)  # 返回相同ACK

    def test_out_of_window(self):
        """测试超出窗口范围的包"""
        packet = Packet(seq_num=10, data=b"data10")
        ack = self.receiver.receive_packet(packet)
        self.assertEqual(ack, 0)  # 丢弃，返回期望序号
        self.assertEqual(self.receiver.get_buffered_count(), 0)


if __name__ == '__main__':
    unittest.main()
