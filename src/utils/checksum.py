"""校验和计算模块"""


def calculate_checksum(data: bytes) -> int:
    """计算16位校验和

    Args:
        data: 待计算的字节数据

    Returns:
        16位校验和
    """
    if len(data) % 2 == 1:
        data += b'\x00'

    checksum = 0
    for i in range(0, len(data), 2):
        word = (data[i] << 8) + data[i + 1]
        checksum += word
        checksum = (checksum & 0xFFFF) + (checksum >> 16)

    return ~checksum & 0xFFFF


def verify_checksum(data: bytes, checksum: int) -> bool:
    """验证校验和

    Args:
        data: 待验证的字节数据
        checksum: 预期的校验和

    Returns:
        校验和是否正确
    """
    return calculate_checksum(data) == checksum
