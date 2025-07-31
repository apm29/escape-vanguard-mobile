<script setup lang="ts">
useRouter().replace('/alerts')
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner" />
        <p>正在加载...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
