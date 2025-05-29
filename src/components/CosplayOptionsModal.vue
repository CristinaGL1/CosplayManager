<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>¿Qué quieres ver?</h3>
      <div class="options">
        <button @click="$emit('view-dashboard', cosplayId)">Ver Dashboard</button>
        <button @click="$emit('view-details', cosplayId)">Ver Detalles</button>
      </div>
      <button @click="$emit('close')" class="close-button">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cosplayId: {
    type: Number,
    required: true
  }
});

defineEmits(['close', 'view-dashboard', 'view-details']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.options {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.options button, .close-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.options button {
  background-color: #007bff;
  color: white;
}

.close-button {
  background-color: #6c757d;
  color: white;
}
</style>