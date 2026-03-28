<template>
  <div class="panel">
    <div class="panel-header">
      <h2>文件管理</h2>
    </div>

    <div class="file-grid">
      <div v-for="file in files" :key="file.id" class="file-card" @click="previewFile(file)">
        <div class="file-preview">
          <span class="preview-icon">{{ getFileIcon(file.type) }}</span>
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-meta">{{ file.size }} · {{ file.date }}</div>
        </div>
      </div>
    </div>

    <div v-if="selectedFile" class="preview-modal" @click="selectedFile = null">
      <div class="preview-content" @click.stop>
        <button class="close-btn" @click="selectedFile = null">✕</button>
        <img v-if="selectedFile.type === 'image'" :src="selectedFile.url" />
        <video v-if="selectedFile.type === 'video'" :src="selectedFile.url" controls />
        <pre v-if="selectedFile.type === 'text'">{{ selectedFile.content }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const files = ref([
  { id: 1, name: 'photo.jpg', type: 'image', size: '2.3 MB', date: '2026-03-28' },
  { id: 2, name: 'video.mp4', type: 'video', size: '15.8 MB', date: '2026-03-27' },
  { id: 3, name: 'readme.txt', type: 'text', size: '1.2 KB', date: '2026-03-26' }
])

const getFileIcon = (type) => {
  const icons = { image: '🖼️', video: '🎬', text: '📄' }
  return icons[type] || '📦'
}

const previewFile = (file) => selectedFile.value = file
</script>

<style scoped>
.file-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.file-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.file-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -8px rgba(12, 24, 44, 0.08);
}

.file-preview {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(79, 172, 254, 0.08);
  border-radius: 16px;
  margin-bottom: 12px;
}

.preview-icon {
  font-size: 48px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  font-size: 12px;
  color: var(--text-secondary);
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: var(--accent-pink);
  color: white;
}

.preview-content img,
.preview-content video {
  max-width: 100%;
  border-radius: 12px;
}
</style>
