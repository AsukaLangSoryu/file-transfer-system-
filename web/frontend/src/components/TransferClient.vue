<template>
  <div class="page">
    <header class="page-header">
      <h1>Transfer Client</h1>
      <p>Drop files below to instantly share them across the local network.</p>
    </header>

    <div class="upload-area">
      <div class="upload-icon">☁️</div>
      <h3>Drag & drop files here</h3>
      <p>Or click to browse from your computer. Support bulk upload for documents, images, and videos.</p>
      <button class="btn-primary">Browse Files</button>
    </div>

    <div class="queue-section">
      <h3>🔄 Active Queue (3 Concurrent)</h3>
      <div class="queue-grid">
        <div v-for="item in queue" :key="item.id" class="queue-item">
          <div class="file-icon" :style="{ background: item.color }">📄</div>
          <div class="file-info">
            <div class="file-name">{{ item.name }}</div>
            <div class="file-status">{{ item.status }} {{ item.speed }}</div>
          </div>
          <div class="file-progress">{{ item.progress }}%</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const queue = ref([
  { id: 1, name: 'Web_UI_...', progress: 82, speed: '18.5 MB/s', status: 'Uploading', color: '#dbeafe' },
  { id: 2, name: 'Promo_Vi...', progress: 34, speed: '24.1 MB/s', status: 'Uploading', color: '#fce7f3' },
  { id: 3, name: 'Assets_Bu...', progress: 12, speed: '8.2 MB/s', status: 'Uploading', color: '#fef3c7' }
])
</script>

<style scoped>
.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.page-header p {
  color: #64748b;
  font-size: 15px;
}

.upload-area {
  margin: 32px 0;
  padding: 80px;
  background: white;
  border: 2px dashed #cbd5e1;
  border-radius: 24px;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-area h3 {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 8px;
}

.upload-area p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-primary {
  padding: 12px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.queue-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.queue-grid {
  display: grid;
  gap: 16px;
}

.queue-item {
  display: grid;
  grid-template-columns: 48px 1fr 60px;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  align-items: center;
}

.file-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.file-name {
  font-weight: 600;
  color: #1e293b;
}

.file-status {
  font-size: 13px;
  color: #64748b;
}

.file-progress {
  font-weight: 600;
  color: #3b82f6;
}

.progress-bar {
  grid-column: 2 / 4;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}
</style>
