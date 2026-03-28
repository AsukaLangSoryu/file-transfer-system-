# 实现说明文档

## 1. 模块划分

### 1.1 核心模块

```
src/
├── protocol/
│   ├── packet.py          # 数据包封装与解析
│   ├── connection.py      # 连接管理
│   ├── sender.py          # 发送端逻辑
│   ├── receiver.py        # 接收端逻辑
│   └── congestion.py      # 拥塞控制
├── utils/
│   ├── checksum.py        # 校验和计算
│   ├── logger.py          # 日志工具
│   └── timer.py           # 定时器
├── client.py              # 客户端主程序
└── server.py              # 服务器主程序
```

## 2. 关键类设计

### 2.1 Packet 类
负责数据包的封装和解析。

**主要方法**:
- `pack()`: 将数据打包成字节流
- `unpack()`: 从字节流解析数据包
- `calculate_checksum()`: 计算校验和
- `verify_checksum()`: 验证校验和

### 2.2 Connection 类
管理连接状态和生命周期。

**状态机**:
- CLOSED
- LISTEN
- SYN_SENT
- SYN_RECEIVED
- ESTABLISHED
- FIN_WAIT_1
- FIN_WAIT_2
- CLOSE_WAIT
- LAST_ACK
- TIME_WAIT

### 2.3 Sender 类
发送端核心逻辑。

**主要功能**:
- 滑动窗口管理
- 超时重传
- 拥塞控制
- 流量控制

### 2.4 Receiver 类
接收端核心逻辑。

**主要功能**:
- 接收窗口管理
- 乱序处理
- 累积确认
- 流量控制通告

### 2.5 CongestionControl 类
拥塞控制算法实现。

**主要功能**:
- 慢启动
- 拥塞避免
- 快速重传
- 快速恢复

## 3. 数据结构

### 3.1 发送缓冲区
```python
send_buffer = {
    'data': bytes,           # 待发送数据
    'seq': int,              # 序列号
    'sent_time': float,      # 发送时间
    'acked': bool            # 是否已确认
}
```

### 3.2 接收缓冲区
```python
recv_buffer = {
    'seq': int,              # 序列号
    'data': bytes,           # 接收数据
    'received': bool         # 是否已接收
}
```

## 4. 线程模型

### 4.1 发送线程
- 从发送缓冲区取数据
- 根据窗口大小发送
- 处理超时重传

### 4.2 接收线程
- 接收UDP数据包
- 解析并验证
- 放入接收缓冲区

### 4.3 ACK处理线程
- 处理收到的ACK
- 更新发送窗口
- 调整拥塞窗口

## 5. 关键算法

### 5.1 RTT估计
```python
alpha = 0.125
beta = 0.25
SRTT = (1 - alpha) * SRTT + alpha * sample_RTT
RTTVAR = (1 - beta) * RTTVAR + beta * abs(SRTT - sample_RTT)
RTO = SRTT + 4 * RTTVAR
```

### 5.2 拥塞窗口调整
```python
# 慢启动
if cwnd < ssthresh:
    cwnd += MSS  # 每个ACK增加1个MSS

# 拥塞避免
else:
    cwnd += MSS * MSS / cwnd  # 每个RTT增加1个MSS
```

## 6. 错误处理

- 校验和错误：丢弃数据包
- 超时：重传数据包
- 连接异常：发送RST重置连接
- 缓冲区满：阻塞发送
