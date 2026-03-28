"""数据包模块单元测试"""
import unittest
from src.protocol.packet import Packet


class TestPacket(unittest.TestCase):
    """测试Packet类"""

    def test_pack_unpack(self):
        """测试打包和解包"""
        packet = Packet(
            src_port=8000,
            dst_port=9000,
            seq_num=100,
            ack_num=200,
            flags=Packet.FLAG_SYN | Packet.FLAG_ACK,
            window=1024,
            data=b'Hello'
        )

        packed = packet.pack()
        unpacked = Packet.unpack(packed)

        self.assertEqual(unpacked.src_port, 8000)
        self.assertEqual(unpacked.dst_port, 9000)
        self.assertEqual(unpacked.seq_num, 100)
        self.assertEqual(unpacked.ack_num, 200)
        self.assertEqual(unpacked.flags, Packet.FLAG_SYN | Packet.FLAG_ACK)
        self.assertEqual(unpacked.window, 1024)
        self.assertEqual(unpacked.data, b'Hello')

    def test_flags(self):
        """测试标志位"""
        packet = Packet(flags=Packet.FLAG_SYN)
        self.assertTrue(packet.is_syn())
        self.assertFalse(packet.is_ack())

        packet.flags = Packet.FLAG_ACK | Packet.FLAG_FIN
        self.assertTrue(packet.is_ack())
        self.assertTrue(packet.is_fin())
        self.assertFalse(packet.is_syn())


if __name__ == '__main__':
    unittest.main()
