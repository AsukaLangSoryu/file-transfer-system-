"""连接管理模块单元测试"""
import unittest
import socket
import threading
import time
from src.protocol.connection import Connection, ConnectionState
from src.protocol.packet import Packet


class TestConnection(unittest.TestCase):
    """连接管理测试类"""

    def setUp(self):
        """测试前准备"""
        self.client_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.server_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

        self.client_sock.bind(('127.0.0.1', 0))
        self.server_sock.bind(('127.0.0.1', 0))

        self.client_addr = self.client_sock.getsockname()
        self.server_addr = self.server_sock.getsockname()

    def tearDown(self):
        """测试后清理"""
        self.client_sock.close()
        self.server_sock.close()

    def test_connection_states(self):
        """测试连接状态枚举"""
        self.assertEqual(ConnectionState.CLOSED.value, 0)
        self.assertEqual(ConnectionState.LISTEN.value, 1)
        self.assertEqual(ConnectionState.ESTABLISHED.value, 4)
        self.assertEqual(ConnectionState.TIME_WAIT.value, 10)

    def test_connection_init(self):
        """测试连接初始化"""
        conn = Connection(self.client_sock, self.client_addr)
        self.assertEqual(conn.state, ConnectionState.CLOSED)
        self.assertEqual(conn.local_addr, self.client_addr)
        self.assertIsNone(conn.remote_addr)

    def test_three_way_handshake(self):
        """测试三次握手"""
        client_conn = Connection(self.client_sock, self.client_addr, timeout=2.0)
        server_conn = Connection(self.server_sock, self.server_addr, timeout=2.0)

        # 服务器监听
        def server_accept():
            server_conn.listen()
            server_conn.accept()

        server_thread = threading.Thread(target=server_accept)
        server_thread.start()

        time.sleep(0.1)

        # 客户端连接
        result = client_conn.connect(self.server_addr)

        server_thread.join(timeout=3)

        self.assertTrue(result)
        self.assertEqual(client_conn.state, ConnectionState.ESTABLISHED)
        self.assertEqual(server_conn.state, ConnectionState.ESTABLISHED)

    def test_four_way_handshake(self):
        """测试四次挥手"""
        client_conn = Connection(self.client_sock, self.client_addr, timeout=2.0)
        server_conn = Connection(self.server_sock, self.server_addr, timeout=2.0)

        # 建立连接
        def server_accept():
            server_conn.listen()
            server_conn.accept()

        server_thread = threading.Thread(target=server_accept)
        server_thread.start()
        time.sleep(0.1)
        client_conn.connect(self.server_addr)
        server_thread.join(timeout=3)

        # 关闭连接
        def server_close():
            time.sleep(0.2)
            packet = Packet(
                src_port=self.client_addr[1],
                dst_port=self.server_addr[1],
                seq_num=client_conn.seq_num,
                flags=Packet.FLAG_FIN
            )
            server_conn.handle_close_wait(packet)

        close_thread = threading.Thread(target=server_close)
        close_thread.start()

        result = client_conn.close()
        close_thread.join(timeout=3)

        self.assertTrue(result)
        self.assertEqual(client_conn.state, ConnectionState.CLOSED)

    def test_connection_timeout(self):
        """测试连接超时"""
        conn = Connection(self.client_sock, self.client_addr, timeout=0.5)
        result = conn.connect(('127.0.0.1', 9999))
        self.assertFalse(result)
        self.assertEqual(conn.state, ConnectionState.CLOSED)

    def test_is_established(self):
        """测试连接状态检查"""
        conn = Connection(self.client_sock, self.client_addr)
        self.assertFalse(conn.is_established())
        self.assertTrue(conn.is_closed())

        conn.state = ConnectionState.ESTABLISHED
        self.assertTrue(conn.is_established())
        self.assertFalse(conn.is_closed())

    def test_get_state(self):
        """测试获取连接状态"""
        conn = Connection(self.client_sock, self.client_addr)
        self.assertEqual(conn.get_state(), ConnectionState.CLOSED)

        conn.state = ConnectionState.LISTEN
        self.assertEqual(conn.get_state(), ConnectionState.LISTEN)


if __name__ == '__main__':
    unittest.main()

