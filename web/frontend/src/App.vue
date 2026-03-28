<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <div class="logo-text">
          <span class="logo-name">AirDrop</span><span class="logo-pro">Pro</span>
        </div>
      </div>

      <nav class="main-menu">
        <div class="menu-label">MAIN MENU</div>
        <button v-for="item in menuItems" :key="item.id"
                :class="['menu-item', { active: activeMenu === item.id }]"
                @click="activeMenu = item.id">
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-text">{{ item.label }}</span>
        </button>
      </nav>

      <div class="network-status">
        <div class="status-badge">US</div>
        <div class="status-info">
          <div class="status-title">Local Network</div>
          <div class="status-subtitle">Connected • v2.1.0</div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <ServerPanel v-if="activeMenu === 'server'" />
      <TransferClient v-if="activeMenu === 'transfer'" />
      <FileManager v-if="activeMenu === 'files'" />
      <GroupBroadcast v-if="activeMenu === 'broadcast'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ServerPanel from './components/ServerPanel.vue'
import TransferClient from './components/TransferClient.vue'
import FileManager from './components/FileManager.vue'
import GroupBroadcast from './components/GroupBroadcast.vue'

const activeMenu = ref('server')

const menuItems = [
  { id: 'server', label: 'Server Panel', icon: '🖥️' },
  { id: 'transfer', label: 'Transfer Client', icon: '📤' },
  { id: 'files', label: 'File Manager', icon: '📁' },
  { id: 'broadcast', label: 'Group Broadcast', icon: '📡' }
]
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
}

.sidebar {
  width: 280px;
  background: white;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8ecf1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
}

.logo-name {
  color: #1e293b;
}

.logo-pro {
  color: #3b82f6;
}

.menu-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
  font-size: 15px;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.menu-item.active {
  background: #eff6ff;
  color: #3b82f6;
  border-left: 3px solid #3b82f6;
}

.network-status {
  margin-top: auto;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #f8f9fb;
  border-radius: 10px;
}

.status-badge {
  width: 40px;
  height: 40px;
  background: #e0e7ff;
  color: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.status-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.status-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.main-content {
  flex: 1;
  padding: 48px;
  overflow-y: auto;
}
</style>
