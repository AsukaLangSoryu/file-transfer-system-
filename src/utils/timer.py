"""定时器模块"""
import time
from typing import Callable, Optional


class Timer:
    """重传定时器"""

    def __init__(self, timeout: float, callback: Optional[Callable] = None):
        """初始化定时器

        Args:
            timeout: 超时时间（秒）
            callback: 超时回调函数
        """
        self.timeout = timeout
        self.callback = callback
        self.start_time: Optional[float] = None

    def start(self):
        """启动定时器"""
        self.start_time = time.time()

    def stop(self):
        """停止定时器"""
        self.start_time = None

    def is_timeout(self) -> bool:
        """检查是否超时"""
        if self.start_time is None:
            return False
        return time.time() - self.start_time >= self.timeout

    def reset(self):
        """重置定时器"""
        if self.start_time is not None:
            self.start_time = time.time()
