# 使用示例

## 1. 基本使用

### 启动服务器
```bash
cd src
python server.py --port 8888
```

### 启动客户端传输文件
```bash
cd src
python client.py --host localhost --port 8888 --file test.txt
```

## 2. 高级选项

### 服务器选项
```bash
python server.py \
    --port 8888 \
    --window 10 \
    --log-level DEBUG
```

### 客户端选项
```bash
python client.py \
    --host localhost \
    --port 8888 \
    --file data.bin \
    --window 10 \
    --timeout 2.0
```

## 3. 测试模式

### 模拟丢包
```bash
python client.py \
    --host localhost \
    --port 8888 \
    --file test.txt \
    --loss-rate 0.1
```

### 模拟延迟
```bash
python client.py \
    --host localhost \
    --port 8888 \
    --file test.txt \
    --delay 0.05
```

## 4. 日志查看

日志文件位于 `logs/` 目录：
```bash
tail -f logs/rdt.log
```
