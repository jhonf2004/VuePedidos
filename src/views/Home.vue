<template>
  <div
    class="w-screen h-screen bg-cover bg-center flex items-center justify-center"
    style="background-image: url('/fondo.jpg')"
  >
    <div class="bg-white/90 rounded-3xl p-6 w-11/12 max-w-md text-center">
      <!-- Logos -->
      <div class="flex justify-between items-center mb-6">
        <img src="/festa-logo.jpg" alt="Festa" class="h-16" />
        <img src="/papos-logo.jpg" alt="Papos" class="h-16" />
      </div>

      <!-- Botones -->
      <div class="space-y-4">
        <button class="btn-principal">Carta comida</button>
        <button class="btn-principal">Carta cócteles</button>
        <button class="btn-principal">Promos del día</button>

        <div class="flex space-x-2 justify-center">
          <button class="btn-secundario">Reservas</button>
          <button class="btn-secundario">Delivery</button>
        </div>

        <button class="btn-principal">ENCUESTA</button>
      </div>

      <!-- Redes sociales -->
      <div class="mt-8 text-white">
        <p class="text-sm text-gray-700">Síguenos</p>
        <div class="flex justify-center space-x-4 mt-2">
          <img src="/facebook.svg" alt="Facebook" class="h-8" />
          <img src="/instagram.svg" alt="Instagram" class="h-8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Sin lógica aún, todo es visual
</script>

<style scoped>
.btn-principal {
  @apply bg-[#5e0b00] text-white rounded-full px-4 py-2 text-lg font-bold;
}
.btn-secundario {
  @apply bg-white text-[#5e0b00] rounded-full px-4 py-2 text-lg font-bold shadow;
}
</style>
