<template>
  <div class="panel">
    <div class="panel-header">
      <h2>群发文件</h2>
    </div>

    <div class="group-container">
      <div class="users-section">
        <h3>选择用户</h3>
        <div class="user-list">
          <label v-for="user in users" :key="user.id" class="user-checkbox">
            <input type="checkbox" v-model="selectedUsers" :value="user.id" />
            <span class="user-avatar">{{ user.name[0] }}</span>
            <span class="user-name">{{ user.name }}</span>
          </label>
        </div>
      </div>

      <div class="file-section">
        <h3>选择文件</h3>
        <button class="cyber-btn" @click="selectFile">选择文件</button>
        <input ref="fileInput" type="file" hidden @change="handleFileSelect" />
        <div v-if="selectedFile" class="selected-file">
          <span>{{ selectedFile.name }}</span>
        </div>
      </div>

      <button class="send-btn" :disabled="!canSend" @click="sendToGroup">
        发送给 {{ selectedUsers.length }} 个用户
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const fileInput = ref(null)
const selectedUsers = ref([])
const selectedFile = ref(null)
const users = ref([
  { id: 1, name: 'User A' },
  { id: 2, name: 'User B' },
  { id: 3, name: 'User C' }
])

const canSend = computed(() => selectedUsers.value.length > 0 && selectedFile.value)
const selectFile = () => fileInput.value?.click()
const handleFileSelect = (e) => selectedFile.value = e.target.files[0]
const sendToGroup = () => console.log('Sending to group')
</script>

<style scoped>
.group-container {
  display: grid;
  gap: 32px;
}

.users-section h3,
.file-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.user-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-checkbox:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 24, 44, 0.04);
}

.user-checkbox input {
  accent-color: var(--accent-blue);
}

.selected-file {
  margin-top: 16px;
  padding: 16px;
  background: rgba(79, 172, 254, 0.08);
  border: 1px solid var(--accent-blue);
  border-radius: 12px;
  font-weight: 500;
}

.send-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(79, 172, 254, 0.2);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
