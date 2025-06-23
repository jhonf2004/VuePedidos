<template>
  <router-link :to="to" class="big-button">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BigButton',
  props: {
    to: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.big-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1976d2;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 10px;
  height: 120px;
  width: 180px;
  margin: 10px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease;
}
.big-button:hover {
  background-color: #1565c0;
}
</style>
