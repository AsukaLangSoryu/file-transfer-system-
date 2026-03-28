# 配置文件

# 网络参数
HOST = 'localhost'
PORT = 8888

# 协议参数
MSS = 1024              # 最大段大小（字节）
WINDOW_SIZE = 10        # 初始窗口大小
TIMEOUT = 1.0           # 初始超时时间（秒）

# 拥塞控制参数
INITIAL_CWND = 1        # 初始拥塞窗口
INITIAL_SSTHRESH = 64   # 初始慢启动阈值

# RTT估计参数
ALPHA = 0.125           # SRTT平滑因子
BETA = 0.25             # RTTVAR平滑因子

# 重传参数
MAX_RETRIES = 5         # 最大重传次数

# 日志配置
LOG_LEVEL = 'INFO'      # DEBUG, INFO, WARNING, ERROR
LOG_FILE = 'logs/rdt.log'

# 测试参数
LOSS_RATE = 0.0         # 丢包率（0.0-1.0）
DELAY = 0.0             # 延迟（秒）
