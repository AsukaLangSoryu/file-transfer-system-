<template>
  <div class="page">
    <header class="page-header">
      <h1>Group Broadcast</h1>
      <p>Distribute files simultaneously to multiple devices on the network.</p>
    </header>

    <div class="broadcast-section">
      <div class="section-header">
        <span class="step-number">1</span>
        <h3>Target Devices</h3>
      </div>
      <input type="text" placeholder="Select recipients..." class="recipients-input" />
    </div>

    <div class="broadcast-section">
      <div class="section-header">
        <span class="step-number">2</span>
        <h3>Payload Selection</h3>
      </div>
      <div class="upload-area">
        <div class="upload-icon">☁️</div>
        <h3>Drag & drop files here</h3>
        <p>Or click to browse from your computer. Support bulk upload for documents, images, and videos.</p>
        <button class="btn-primary">Browse Files</button>
      </div>
    </div>

    <button class="btn-execute" disabled>📡 Execute Broadcast</button>
  </div>
</template>

<script setup>
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

.broadcast-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.recipients-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
}

.upload-area {
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

.btn-execute {
  width: 100%;
  padding: 16px;
  background: #e2e8f0;
  color: #94a3b8;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 32px;
}
</style>
