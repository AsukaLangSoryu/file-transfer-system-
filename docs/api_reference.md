# API参考文档

## 1. Packet类

### 构造函数
```python
Packet(seq=0, ack=0, flags=0, window=0, data=b'')
```

### 标志位常量
```python
SYN = 0x01  # 同步
ACK = 0x02  # 确认
FIN = 0x04  # 结束
RST = 0x08  # 重置
```

### 主要方法

#### pack()
```python
def pack() -> bytes:
    """将数据包打包成字节流"""
```

#### unpack()
```python
@staticmethod
def unpack(data: bytes) -> Packet:
    """从字节流解析数据包"""
```

#### calculate_checksum()
```python
def calculate_checksum() -> int:
    """计算校验和"""
```

## 2. Connection类

### 状态常量
```python
CLOSED = 0
LISTEN = 1
SYN_SENT = 2
SYN_RECEIVED = 3
ESTABLISHED = 4
FIN_WAIT_1 = 5
FIN_WAIT_2 = 6
CLOSE_WAIT = 7
LAST_ACK = 8
TIME_WAIT = 9
```

### 主要方法

#### connect()
```python
def connect(host: str, port: int) -> bool:
    """建立连接（客户端）"""
```

#### accept()
```python
def accept() -> bool:
    """接受连接（服务器）"""
```

#### close()
```python
def close():
    """关闭连接"""
```

## 3. Sender类

### 主要方法

#### send()
```python
def send(data: bytes) -> int:
    """发送数据，返回发送的字节数"""
```

#### handle_ack()
```python
def handle_ack(ack_num: int):
    """处理收到的ACK"""
```

## 4. Receiver类

### 主要方法

#### receive()
```python
def receive() -> bytes:
    """接收数据"""
```

#### send_ack()
```python
def send_ack(ack_num: int):
    """发送ACK"""
```

## 5. CongestionControl类

### 主要方法

#### on_ack()
```python
def on_ack():
    """收到ACK时调用"""
```

#### on_timeout()
```python
def on_timeout():
    """超时时调用"""
```

#### get_cwnd()
```python
def get_cwnd() -> int:
    """获取当前拥塞窗口大小"""
```
