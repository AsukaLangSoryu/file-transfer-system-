<template>
  <div class="page">
    <header class="page-header">
      <h1>Server Dashboard</h1>
      <p>Manage your secure local network instance and monitor connected devices.</p>
    </header>

    <div class="server-card">
      <div class="server-icon">📊</div>
      <div class="server-info">
        <h3>Main Local Server</h3>
        <div class="server-status">
          <span class="status-dot"></span>
          BROADCASTING & ACTIVE
        </div>
      </div>
      <div class="server-details">
        <div class="detail-item">
          <div class="detail-label">📡 IPV4 ADDRESS</div>
          <div class="detail-value">192.168.1.188</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">🔌 LISTENING PORT</div>
          <div class="detail-value">8899</div>
        </div>
      </div>
      <button class="btn-terminate">⏻ Terminate</button>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-section">
        <h3>👥 Connected Devices <span class="badge">3 Online</span></h3>
        <div class="devices-list">
          <div v-for="device in devices" :key="device.id" class="device-item">
            <div class="device-icon" :style="{ background: device.color }">{{ device.icon }}</div>
            <div class="device-info">
              <div class="device-name">{{ device.name }}</div>
              <div class="device-ip">{{ device.ip }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <h3>📥 System Logs</h3>
        <div class="empty-state">
          <div class="empty-icon">💾</div>
          <p class="empty-title">No recent activity</p>
          <p class="empty-text">Incoming files or system notifications will be logged here.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const devices = ref([
  { id: 1, name: 'Studio iMac Pro', ip: '192.168.1.102', icon: '🖥️', color: '#dbeafe' },
  { id: 2, name: "Alex's iPhone 14", ip: '192.168.1.105', icon: '📱', color: '#fce7f3' },
  { id: 3, name: 'Designer iPad Air', ip: '192.168.1.112', icon: '📱', color: '#e9d5ff' }
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
  margin-bottom: 32px;
}

.server-card {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 24px;
  padding: 32px;
  background: white;
  border-radius: 20px;
  align-items: center;
  margin-bottom: 32px;
}

.server-icon {
  width: 80px;
  height: 80px;
  background: #dbeafe;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.server-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  font-size: 13px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}

.server-details {
  display: flex;
  gap: 32px;
}

.detail-label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.btn-terminate {
  padding: 12px 24px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.dashboard-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  padding: 4px 12px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 12px;
  font-size: 12px;
}

.devices-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.device-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.device-name {
  font-weight: 600;
  color: #1e293b;
}

.device-ip {
  font-size: 13px;
  color: #94a3b8;
}

.empty-state {
  padding: 60px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: #94a3b8;
}
</style>
