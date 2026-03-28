"""定时器模块单元测试"""
import unittest
import time
from src.utils.timer import Timer


class TestTimer(unittest.TestCase):
    """测试Timer类"""

    def test_timeout(self):
        """测试超时检测"""
        timer = Timer(0.1)
        timer.start()
        self.assertFalse(timer.is_timeout())
        time.sleep(0.15)
        self.assertTrue(timer.is_timeout())

    def test_reset(self):
        """测试重置定时器"""
        timer = Timer(0.1)
        timer.start()
        time.sleep(0.05)
        timer.reset()
        self.assertFalse(timer.is_timeout())


if __name__ == '__main__':
    unittest.main()
