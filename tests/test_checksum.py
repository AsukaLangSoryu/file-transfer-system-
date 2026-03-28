"""校验和模块单元测试"""
import unittest
from src.utils.checksum import calculate_checksum, verify_checksum


class TestChecksum(unittest.TestCase):
    """测试校验和计算"""

    def test_calculate_checksum(self):
        """测试计算校验和"""
        data = b'Hello World'
        checksum = calculate_checksum(data)
        self.assertIsInstance(checksum, int)
        self.assertTrue(0 <= checksum <= 0xFFFF)

    def test_verify_checksum(self):
        """测试验证校验和"""
        data = b'Test Data'
        checksum = calculate_checksum(data)
        self.assertTrue(verify_checksum(data, checksum))
        self.assertFalse(verify_checksum(data, checksum + 1))


if __name__ == '__main__':
    unittest.main()
