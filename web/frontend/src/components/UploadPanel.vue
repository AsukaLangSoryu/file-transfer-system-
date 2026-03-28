<template>
  <div class="panel">
    <div class="panel-header">
      <h2>文件上传</h2>
    </div>

    <div class="upload-zone" @click="selectFile" @dragover.prevent @drop.prevent="handleDrop">
      <div class="upload-icon">📁</div>
      <p>点击或拖拽文件到此处</p>
      <input ref="fileInput" type="file" multiple hidden @change="handleFileSelect" />
    </div>

    <div class="transfers-grid">
      <div v-for="transfer in transfers" :key="transfer.id" class="transfer-card">
        <div class="transfer-header">
          <span class="file-icon">{{ getFileIcon(transfer.name) }}</span>
          <span class="file-name">{{ transfer.name }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: transfer.progress + '%' }"></div>
        </div>
        <div class="transfer-info">
          <span>{{ transfer.progress }}%</span>
          <span>{{ transfer.speed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const transfers = ref([
  { id: 1, name: 'document.pdf', progress: 65, speed: '2.3 MB/s' },
  { id: 2, name: 'image.jpg', progress: 30, speed: '1.8 MB/s' },
  { id: 3, name: 'video.mp4', progress: 0, speed: '0 KB/s' }
])

const selectFile = () => fileInput.value?.click()
const handleFileSelect = (e) => console.log(e.target.files)
const handleDrop = (e) => console.log(e.dataTransfer.files)
const getFileIcon = (name) => {
  if (name.match(/\.(jpg|png|gif)$/)) return '🖼️'
  if (name.match(/\.(mp4|avi)$/)) return '🎬'
  if (name.match(/\.(txt|md)$/)) return '📄'
  return '📦'
}
</script>

<style scoped>
.upload-zone {
  padding: 60px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed rgba(226, 232, 240, 0.8);
  border-radius: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 32px;
}

.upload-zone:hover {
  border-color: var(--accent-blue);
  background: rgba(79, 172, 254, 0.08);
  transform: translateY(-2px);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-zone p {
  color: var(--text-secondary);
  font-weight: 500;
}

.transfers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.transfer-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.transfer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -8px rgba(12, 24, 44, 0.08);
}

.transfer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.file-icon {
  font-size: 24px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-bar {
  height: 8px;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
  transition: width 0.3s;
  border-radius: 8px;
}

.transfer-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
