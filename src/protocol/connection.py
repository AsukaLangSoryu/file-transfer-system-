"""连接管理模块"""
import socket
import random
import time
from enum import Enum
from typing import Optional, Tuple
from src.protocol.packet import Packet
from src.utils.timer import Timer
from src.utils.logger import setup_logger


class ConnectionState(Enum):
    """连接状态"""
    CLOSED = 0
    LISTEN = 1
    SYN_SENT = 2
    SYN_RECEIVED = 3
    ESTABLISHED = 4
    FIN_WAIT_1 = 5
    FIN_WAIT_2 = 6
    CLOSE_WAIT = 7
    CLOSING = 8
    LAST_ACK = 9
    TIME_WAIT = 10


class Connection:
    """连接管理类"""

    def __init__(self, sock: socket.socket, local_addr: Tuple[str, int],
                 remote_addr: Optional[Tuple[str, int]] = None, timeout: float = 3.0):
        """初始化连接

        Args:
            sock: UDP套接字
            local_addr: 本地地址
            remote_addr: 远程地址
            timeout: 超时时间（秒）
        """
        self.sock = sock
        self.local_addr = local_addr
        self.remote_addr = remote_addr
        self.state = ConnectionState.CLOSED
        self.timeout = timeout

        # 序列号
        self.seq_num = random.randint(0, 0xFFFFFFFF)
        self.ack_num = 0

        # 定时器
        self.timer = Timer(timeout)

        # 日志
        self.logger = setup_logger(f"Connection-{local_addr[1]}")

    def connect(self, remote_addr: Tuple[str, int]) -> bool:
        """建立连接（三次握手）

        Args:
            remote_addr: 远程地址

        Returns:
            连接是否成功
        """
        self.remote_addr = remote_addr
        self.state = ConnectionState.SYN_SENT

        # 发送SYN
        syn_packet = Packet(
            src_port=self.local_addr[1],
            dst_port=remote_addr[1],
            seq_num=self.seq_num,
            flags=Packet.FLAG_SYN
        )
        self.sock.sendto(syn_packet.pack(), remote_addr)
        self.logger.info(f"发送SYN: seq={self.seq_num}")

        # 等待SYN-ACK
        self.timer.start()
        while not self.timer.is_timeout():
            try:
                self.sock.settimeout(0.1)
                data, addr = self.sock.recvfrom(4096)
                packet = Packet.unpack(data)

                if packet.is_syn() and packet.is_ack() and packet.ack_num == self.seq_num + 1:
                    self.ack_num = packet.seq_num + 1
                    self.seq_num += 1
                    self.logger.info(f"收到SYN-ACK: seq={packet.seq_num}, ack={packet.ack_num}")

                    # 发送ACK
                    ack_packet = Packet(
                        src_port=self.local_addr[1],
                        dst_port=remote_addr[1],
                        seq_num=self.seq_num,
                        ack_num=self.ack_num,
                        flags=Packet.FLAG_ACK
                    )
                    self.sock.sendto(ack_packet.pack(), remote_addr)
                    self.logger.info(f"发送ACK: seq={self.seq_num}, ack={self.ack_num}")

                    self.state = ConnectionState.ESTABLISHED
                    self.timer.stop()
                    return True
            except socket.timeout:
                continue
            except Exception as e:
                self.logger.error(f"连接错误: {e}")
                break

        self.logger.error("连接超时")
        self.state = ConnectionState.CLOSED
        return False

    def listen(self) -> bool:
        """监听连接（服务器端）

        Returns:
            是否成功进入监听状态
        """
        self.state = ConnectionState.LISTEN
        self.logger.info("进入监听状态")
        return True

    def accept(self) -> bool:
        """接受连接（三次握手服务器端）

        Returns:
            连接是否成功
        """
        if self.state != ConnectionState.LISTEN:
            return False

        # 等待SYN
        self.timer.start()
        while not self.timer.is_timeout():
            try:
                self.sock.settimeout(0.1)
                data, addr = self.sock.recvfrom(4096)
                packet = Packet.unpack(data)

                if packet.is_syn() and not packet.is_ack():
                    self.remote_addr = addr
                    self.ack_num = packet.seq_num + 1
                    self.state = ConnectionState.SYN_RECEIVED
                    self.logger.info(f"收到SYN: seq={packet.seq_num} from {addr}")

                    # 发送SYN-ACK
                    syn_ack_packet = Packet(
                        src_port=self.local_addr[1],
                        dst_port=addr[1],
                        seq_num=self.seq_num,
                        ack_num=self.ack_num,
                        flags=Packet.FLAG_SYN | Packet.FLAG_ACK
                    )
                    self.sock.sendto(syn_ack_packet.pack(), addr)
                    self.logger.info(f"发送SYN-ACK: seq={self.seq_num}, ack={self.ack_num}")

                    # 等待ACK
                    ack_timer = Timer(self.timeout)
                    ack_timer.start()
                    while not ack_timer.is_timeout():
                        try:
                            data, _ = self.sock.recvfrom(4096)
                            ack_packet = Packet.unpack(data)

                            if ack_packet.is_ack() and ack_packet.ack_num == self.seq_num + 1:
                                self.seq_num += 1
                                self.state = ConnectionState.ESTABLISHED
                                self.logger.info(f"收到ACK，连接建立")
                                return True
                        except socket.timeout:
                            continue
                        except Exception:
                            break
            except socket.timeout:
                continue
            except Exception as e:
                self.logger.error(f"接受连接错误: {e}")
                break

        self.state = ConnectionState.CLOSED
        return False

    def close(self) -> bool:
        """关闭连接（四次挥手）

        Returns:
            关闭是否成功
        """
        if self.state != ConnectionState.ESTABLISHED:
            self.state = ConnectionState.CLOSED
            return False

        # 发送FIN
        fin_packet = Packet(
            src_port=self.local_addr[1],
            dst_port=self.remote_addr[1],
            seq_num=self.seq_num,
            flags=Packet.FLAG_FIN
        )
        self.sock.sendto(fin_packet.pack(), self.remote_addr)
        self.state = ConnectionState.FIN_WAIT_1
        self.logger.info(f"发送FIN: seq={self.seq_num}")

        # 等待ACK和FIN
        self.timer.start()
        while not self.timer.is_timeout():
            try:
                self.sock.settimeout(0.1)
                data, _ = self.sock.recvfrom(4096)
                packet = Packet.unpack(data)

                if self.state == ConnectionState.FIN_WAIT_1:
                    if packet.is_ack() and packet.ack_num == self.seq_num + 1:
                        self.seq_num += 1
                        self.state = ConnectionState.FIN_WAIT_2
                        self.logger.info("收到ACK，进入FIN_WAIT_2")

                if self.state == ConnectionState.FIN_WAIT_2:
                    if packet.is_fin():
                        self.ack_num = packet.seq_num + 1
                        self.logger.info(f"收到FIN: seq={packet.seq_num}")

                        # 发送ACK
                        ack_packet = Packet(
                            src_port=self.local_addr[1],
                            dst_port=self.remote_addr[1],
                            seq_num=self.seq_num,
                            ack_num=self.ack_num,
                            flags=Packet.FLAG_ACK
                        )
                        self.sock.sendto(ack_packet.pack(), self.remote_addr)
                        self.logger.info(f"发送ACK: ack={self.ack_num}")

                        self.state = ConnectionState.TIME_WAIT
                        time.sleep(0.5)
                        self.state = ConnectionState.CLOSED
                        return True
            except socket.timeout:
                continue
            except Exception as e:
                self.logger.error(f"关闭连接错误: {e}")
                break

        self.state = ConnectionState.CLOSED
        return False

    def handle_close_wait(self, packet: Packet) -> bool:
        """处理被动关闭（接收到FIN）

        Args:
            packet: 收到的FIN包

        Returns:
            是否成功处理
        """
        if packet.is_fin():
            self.ack_num = packet.seq_num + 1
            self.state = ConnectionState.CLOSE_WAIT
            self.logger.info(f"收到FIN，进入CLOSE_WAIT")

            # 发送ACK
            ack_packet = Packet(
                src_port=self.local_addr[1],
                dst_port=self.remote_addr[1],
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                flags=Packet.FLAG_ACK
            )
            self.sock.sendto(ack_packet.pack(), self.remote_addr)
            self.logger.info(f"发送ACK: ack={self.ack_num}")

            # 发送FIN
            fin_packet = Packet(
                src_port=self.local_addr[1],
                dst_port=self.remote_addr[1],
                seq_num=self.seq_num,
                flags=Packet.FLAG_FIN
            )
            self.sock.sendto(fin_packet.pack(), self.remote_addr)
            self.state = ConnectionState.LAST_ACK
            self.logger.info(f"发送FIN: seq={self.seq_num}")

            # 等待最后的ACK
            self.timer.start()
            while not self.timer.is_timeout():
                try:
                    self.sock.settimeout(0.1)
                    data, _ = self.sock.recvfrom(4096)
                    ack = Packet.unpack(data)
                    if ack.is_ack() and ack.ack_num == self.seq_num + 1:
                        self.logger.info("收到最后ACK，连接关闭")
                        self.state = ConnectionState.CLOSED
                        return True
                except socket.timeout:
                    continue
                except Exception:
                    break

            self.state = ConnectionState.CLOSED
            return True
        return False

    def is_established(self) -> bool:
        """连接是否已建立"""
        return self.state == ConnectionState.ESTABLISHED

    def is_closed(self) -> bool:
        """连接是否已关闭"""
        return self.state == ConnectionState.CLOSED

    def get_state(self) -> ConnectionState:
        """获取当前连接状态"""
        return self.state

    def send_packet(self, packet: Packet):
        """发送数据包"""
        packet.src_port = self.local_addr[1]
        packet.dst_port = self.remote_addr[1]
        self.sock.sendto(packet.pack(), self.remote_addr)

    def recv_packet(self, timeout: float = None) -> Optional[Packet]:
        """接收数据包"""
        try:
            self.sock.settimeout(timeout or self.timeout)
            data, _ = self.sock.recvfrom(4096)
            return Packet.unpack(data)
        except socket.timeout:
            return None
        except Exception:
            return None

    def send_ack(self, ack_num: int):
        """发送ACK包"""
        ack_packet = Packet(
            src_port=self.local_addr[1],
            dst_port=self.remote_addr[1],
            seq_num=self.seq_num,
            ack_num=ack_num,
            flags=Packet.FLAG_ACK
        )
        self.sock.sendto(ack_packet.pack(), self.remote_addr)

