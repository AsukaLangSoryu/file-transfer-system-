<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h1>File Vault</h1>
        <p>Access and manage all successfully transferred assets.</p>
      </div>
      <div class="header-actions">
        <input type="text" placeholder="Search by name..." class="search-input" />
        <select class="filter-select">
          <option>All Types</option>
        </select>
      </div>
    </header>

    <div class="files-grid">
      <div v-for="file in files" :key="file.id" class="file-card">
        <div class="file-icon" :style="{ background: file.color }">{{ file.icon }}</div>
        <div class="file-name">{{ file.name }}</div>
        <div class="file-meta">
          <span>{{ file.size }}</span>
          <span>{{ file.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([
  { id: 1, name: 'Q4_Pitch_Deck...', size: '14.2 MB', date: 'Today, 10:23', icon: '📄', color: '#dbeafe' },
  { id: 2, name: 'Gradient_Bg_01...', size: '3.1 MB', date: 'Today, 09:15', icon: '🖼️', color: '#fce7f3' },
  { id: 3, name: 'App_Demo_Fin...', size: '245.0 MB', date: 'Yesterday', icon: '🎬', color: '#e9d5ff' },
  { id: 4, name: 'Icons_Pack.zip', size: '2.4 MB', date: 'Yesterday', icon: '📦', color: '#fef3c7' }
])
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
}

.page-header p {
  color: #64748b;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 240px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.file-card {
  padding: 24px;
  background: white;
  border-radius: 16px;
  text-align: center;
}

.file-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.file-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.file-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
}
</style>
