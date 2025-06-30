<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-900 to-red-50">
    <!-- Header -->
    <header class="bg-white shadow-xl border-b-4 border-amber-800">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-amber-900 to-red-600 bg-clip-text text-transparent">
            🍸 Carta Digital Cocteles
          </h1>
          
          <!-- Filtros -->
          <div class="flex flex-wrap gap-3">
            <button 
              @click="filtrarPorCategoria('todos')"
              :class="categoriaActiva === 'todos' ? 'bg-amber-800/90 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-100'"
              class="px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Todos
            </button>
            <button 
              v-for="categoria in categorias" 
              :key="categoria"
              @click="filtrarPorCategoria(categoria)"
              :class="categoriaActiva === categoria ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-100'"
              class="px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 capitalize"
            >
              {{ categoria }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container mx-auto px-4 py-8" :class="{ 'mr-0 md:mr-96': mostrarCarrito }">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white/50 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
          <h3 class="font-bold text-lg">❌ Error al cargar productos</h3>
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Grid de Productos -->
      <div v-else class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        <div 
          v-for="producto in productosFiltrados" 
          :key="producto.id"
          class="bg-white/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
        >
          <!-- Imagen del producto -->
          <div class="relative h-40 md:h-48 bg-gradient-to-br from-orange-200 to-red-200 overflow-hidden">
            <img 
              v-if="producto.imagen_url" 
              :src="producto.imagen_url" 
              :alt="producto.nombre"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
              {{ getEmojiCategoria(producto.categoria) }}
            </div>
            
            <!-- Badge de categoría -->
            <div class="absolute top-2 left-2 md:top-3 md:left-3">
              <span class="bg-amber-900/70 text-white px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium capitalize">
                {{ producto.categoria_nombre }}
              </span>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="p-2 md:p-4">
            <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
              {{ producto.nombre }}
            </h3>
            
            <p class="text-gray-600 mb-4 text-xs md:text-sm leading-relaxed">
              {{ producto.descripcion }}
            </p>

            <div class="flex items-center justify-between">
              <!-- Precio -->
              <div class="flex items-center">
                <span class="text-lg md:text-2xl font-bold text-amber-800">
                  S/. {{ formatearPrecio(producto.precio) }}
                </span>
              </div>

              <!-- Botón de agregar -->
              <button 
                @click="agregarAlCarrito(producto)"
                class="bg-gradient-to-r from-amber-900 to-red-500 text-white px-4 py-2 md:px-6 rounded-full font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay productos -->
      <div v-if="!loading && !error && productosFiltrados.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🍽️</div>
        <h3 class="text-2xl font-bold text-gray-600 mb-2">No hay productos disponibles</h3>
        <p class="text-gray-500">{{ categoriaActiva === 'todos' ? 'No se encontraron productos' : `No hay productos en la categoría "${categoriaActiva}"` }}</p>
      </div>
    </main>

    <!-- Overlay para móviles cuando el carrito está abierto -->
    <div 
      v-if="mostrarCarrito && esMobile" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="mostrarCarrito = false"
    ></div>

    <!-- Botón carrito flotante -->
    <button 
      @click="mostrarCarrito = !mostrarCarrito"
      class="fixed bottom-6 bg-amber-900 text-white rounded-full p-4 shadow-lg hover:bg-orange-700 transition-all duration-300 z-50 flex items-center justify-center"
      :class="mostrarCarrito ? 'right-6 md:right-[25rem]' : 'right-6'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8L6 7H4m7 6h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <span v-if="totalItemsCarrito > 0" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {{ totalItemsCarrito }}
      </span>
    </button>

    <!-- Panel Carrito -->
    <div 
      class="fixed top-0 h-full bg-white shadow-xl overflow-y-auto z-50 transition-all duration-300 ease-in-out"
      :class="{
        'right-0': mostrarCarrito,
        'right-[-100%]': !mostrarCarrito,
        'w-full': esMobile,
        'w-96': !esMobile
      }"
    >
      <!-- Header del carrito -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8L6 7H4m7 6h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Tu Carrito
          </h2>
          <button 
            @click="mostrarCarrito = false"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido del carrito -->
      <div class="p-4">
        <!-- Carrito vacío -->
        <div v-if="carrito.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
          <p class="text-gray-500 text-sm">Agrega algunos productos para comenzar</p>
        </div>

        <!-- Items del carrito -->
        <div v-else class="space-y-4">
          <div 
            v-for="item in carrito" 
            :key="item.id" 
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 mb-1">{{ item.nombre }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ item.descripcion }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">S/. {{ formatearPrecio(item.precio) }} c/u</span>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="disminuirCantidad(item)"
                      class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-8 text-center font-semibold">{{ item.cantidad }}</span>
                    <button 
                      @click="aumentarCantidad(item)"
                      class="w-8 h-8 bg-amber-900 hover:bg-amber-800 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-right ml-4">
                <p class="font-bold text-amber-800">S/. {{ formatearPrecio(item.precio * item.cantidad) }}</p>
                <button 
                  @click="eliminarDelCarrito(item)"
                  class="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer del carrito (total y checkout) -->
      <div v-if="carrito.length > 0" class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="space-y-4">
          <!-- Resumen del total -->
          <div class="bg-amber-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-700">Subtotal ({{ totalItemsCarrito }} items):</span>
              <span class="font-semibold">S/. {{ formatearPrecio(totalCarrito) }}</span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold text-amber-800">
              <span>Total:</span>
              <span>S/. {{ formatearPrecio(totalCarrito) }}</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-2">
            <button 
              @click="checkout"
              class="w-full bg-gradient-to-r from-amber-900 to-red-500 hover:from-amber-800 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Finalizar Pedido
            </button>
            <button 
              @click="vaciarCarrito"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario de Pedido -->
    <div 
      v-if="mostrarFormularioPedido" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
      @click.self="cerrarFormularioPedido"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <!-- Header del formulario -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Completar Pedido
            </h2>
            <button 
              @click="cerrarFormularioPedido"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del formulario -->
        <div class="p-6 space-y-6">
          <!-- Resumen del pedido -->
          <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 class="font-semibold text-amber-800 mb-2">Resumen del Pedido</h3>
            <div class="text-sm text-amber-700">
              <p>{{ totalItemsCarrito }} productos</p>
              <p class="font-bold text-lg">Total: S/. {{ formatearPrecio(totalCarrito) }}</p>
            </div>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="procesarPedido" class="space-y-4">
            <!-- Nombre del cliente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formularioPedido.nombre_cliente"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ingresa tu nombre completo"
              >
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formularioPedido.telefono"
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ej: +51 999 888 777"
              >
            </div>

            <!-- Tipo de pedido -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pedido <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formularioPedido.tipo"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                @change="onTipoChange"
              >
                <option value="">Selecciona el tipo</option>
                <option value="mesa">🍽️ Para consumir en mesa</option>
                <option value="delivery">🚚 Delivery</option>
              </select>
            </div>

            <!-- Mesa (solo si es tipo mesa) -->
            <div v-if="formularioPedido.tipo === 'mesa'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Número de Mesa
              </label>
              <input 
                v-model="formularioPedido.mesa"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ej: Mesa 5 (opcional)"
              >
            </div>

            <!-- Dirección (solo si es delivery) -->
            <div v-if="formularioPedido.tipo === 'delivery'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Entrega <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="formularioPedido.direccion"
                :required="formularioPedido.tipo === 'delivery'"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ingresa tu dirección completa para el delivery"
              ></textarea>
            </div>

            <!-- Notas adicionales -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales (Opcional)
              </label>
              <textarea 
                v-model="formularioPedido.notas"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Comentarios especiales sobre tu pedido..."
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex space-x-3 pt-4">
              <button 
                type="button"
                @click="cerrarFormularioPedido"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="enviandoPedido"
                class="flex-1 bg-gradient-to-r from-amber-900 to-red-500 hover:from-amber-800 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span v-if="!enviandoPedido">Confirmar Pedido</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div 
      v-if="mostrarToast"
      class="fixed bottom-20 right-6 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 flex items-center"
      :class="[
        mostrarToast ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        toastTipo === 'success' ? 'bg-green-500' : toastTipo === 'error' ? 'bg-red-500' : 'bg-blue-500'
      ]"
    >
      <svg v-if="toastTipo === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else-if="toastTipo === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      {{ toastMensaje }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartaCocteles',
  data() {
    return {
      productos: [],
      productosFiltrados: [],
      categorias: [],
      categoriaActiva: 'todos',
      loading: true,
      error: null,
      mostrarToast: false,
      toastMensaje: '',
      toastTipo: 'success', // success, error, info
      carrito: [],
      sessionUID: null,
      mostrarCarrito: false,
      mostrarFormularioPedido: false,
      enviandoPedido: false,
      // Datos del formulario de pedido
      formularioPedido: {
        nombre_cliente: '',
        telefono: '',
        direccion: '',
        mesa: '',
        tipo: '', // 'mesa' o 'delivery'
        notas: ''
      },
      // Configuración de la API
      apiConfig: {
        baseUrl: import.meta.env.VUE_APP_API_URL || 'http://192.168.1.10:3000',
        timeout: 10000
      }
    }
  },
  computed: {
    totalItemsCarrito() {
      return this.carrito.reduce((total, item) => total + item.cantidad, 0);
    },
    totalCarrito() {
      return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },
    esMobile() {
      return window.innerWidth < 768;
    }
  },
  async mounted() {
    await this.cargarProductos();
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      // Forzar re-render del computed esMobile
      this.$forceUpdate();
    },

    async cargarProductos() {
      try {
        this.loading = true;
        this.error = null;
        
        const url = `${this.apiConfig.baseUrl}/productos/tipo-carta/2`;
        console.log('🔍 Intentando cargar desde:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: this.apiConfig.timeout
        });
        
        console.log('📡 Status de respuesta:', response.status);
        console.log('📡 Response OK:', response.ok);
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        this.procesarDatos(data);
        
      } catch (error) {
        console.error('Error al cargar productos:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.error = `No se pudo conectar con el servidor en ${this.apiConfig.baseUrl}. Verifica que el backend esté ejecutándose.`;
        } else if (error.message.includes('404')) {
          this.error = `Endpoint /productos no encontrado en ${this.apiConfig.baseUrl}. ¿Existe el controller?`;
        } else if (error.message.includes('500')) {
          this.error = 'Error interno del servidor. Verifica los logs del backend.';
        } else {
          this.error = error.message || 'Error desconocido al cargar productos';
        }
      } finally {
        this.loading = false;
      }
    },

    procesarDatos(data) {
      if (!Array.isArray(data)) {
        console.log('⚠️ Los datos no son un array:', data);
        throw new Error('La respuesta del servidor no es un array válido');
      }
      
      if (data.length === 0) {
        console.log('⚠️ El array está vacío');
        this.productos = [];
        this.productosFiltrados = [];
        this.categorias = [];
        return;
      }
      
      const productosAdaptados = data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen_url: producto.imagenUrl,
        categoria_nombre: producto.categoria?.nombre || 'Sin categoría',
        estado: producto.estado
      }));
      
      this.productos = productosAdaptados;
      this.productosFiltrados = productosAdaptados;
      this.categorias = [...new Set(productosAdaptados.map(p => p.categoria_nombre))];
      
      console.log('✅ Productos cargados:', productosAdaptados.length);
      console.log('🏷️ Categorías encontradas:', this.categorias);
    },

    filtrarPorCategoria(categoria) {
      this.categoriaActiva = categoria;
      
      if (categoria === 'todos') {
        this.productosFiltrados = this.productos;
      } else {
        this.productosFiltrados = this.productos.filter(p => p.categoria_nombre === categoria);
      }
    },

    async agregarAlCarrito(producto) {
      try {
        const existente = this.carrito.find(p => p.id === producto.id);
        if (existente) {
          existente.cantidad += 1;
        } else {
          this.carrito.push({ ...producto, cantidad: 1 });
        }

        this.mostrarToast = true;
        this.toastMensaje = 'Producto agregado al carrito';
        this.toastTipo = 'success';
        setTimeout(() => { this.mostrarToast = false; }, 2000);
      } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
      }
    },

    aumentarCantidad(item) {
      item.cantidad += 1;
    },

    disminuirCantidad(item) {
      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        this.eliminarDelCarrito(item);
      }
    },

    eliminarDelCarrito(item) {
      const index = this.carrito.findIndex(p => p.id === item.id);
      if (index > -1) {
        this.carrito.splice(index, 1);
      }
    },

    vaciarCarrito() {
      this.carrito = [];
    },

    checkout() {
      if (this.carrito.length === 0) {
        this.mostrarToastPersonalizado('Tu carrito está vacío', 'error');
        return;
      }
      
      // Abrir el formulario de pedido en lugar de hacer alert
      this.abrirFormularioPedido();
    },

    // Métodos para el formulario de pedido
    abrirFormularioPedido() {
      if (this.carrito.length === 0) return;
      this.mostrarFormularioPedido = true;
      // Generar UID de sesión si no existe
      if (!this.sessionUID) {
        this.sessionUID = this.generarUID();
      }
    },

    cerrarFormularioPedido() {
      this.mostrarFormularioPedido = false;
      this.limpiarFormulario();
    },

    limpiarFormulario() {
      this.formularioPedido = {
        nombre_cliente: '',
        telefono: '',
        direccion: '',
        mesa: '',
        tipo: '',
        notas: ''
      };
    },

    onTipoChange() {
      // Limpiar campos específicos cuando cambia el tipo
      if (this.formularioPedido.tipo === 'mesa') {
        this.formularioPedido.direccion = '';
      } else if (this.formularioPedido.tipo === 'delivery') {
        this.formularioPedido.mesa = '';
      }
    },

    generarUID() {
      return 'uid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    async procesarPedido() {
      if (this.enviandoPedido) return;
      
      try {
        this.enviandoPedido = true;
        
        // Preparar datos del pedido
        const datosCarrito = {
          uid_session: this.sessionUID || this.generarUID(),
          items: this.carrito.map(item => ({
            itemId: item.id.toString(),   // ✅ debe ser string
            itemType: 'producto',         // ✅ por ejemplo, si es fijo
            name: item.nombre,            // ✅ nombre del producto
            price: parseFloat(item.precio),
            quantity: parseFloat(item.cantidad),
            image: item.imagen_url || null
          })),
        };
        console.log('📦 datosCarrito:', datosCarrito);

        // Crear carrito primero
        const carritoResponse = await fetch(`${this.apiConfig.baseUrl}/carts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosCarrito)
        });

        if (!carritoResponse.ok) {
          throw new Error('Error al crear el carrito');
        }

        const carritoData = await carritoResponse.json();
        console.log('Carrito creado:', carritoData);

        const cartId = carritoData.data.id;
        console.log('✅ cartId:', cartId, typeof cartId);
        // Preparar datos del pedido
        const datosPedido = {
          nombreCliente: this.formularioPedido.nombre_cliente,
          telefono: this.formularioPedido.telefono,
          direccion: this.formularioPedido.direccion || null,
          mesa: this.formularioPedido.mesa || null,
          tipo: this.formularioPedido.tipo,
          estado: 'pendiente',
          notas: this.formularioPedido.notas || null,
          cartId: cartId // Vincular con el carrito creado
        };
        console.log('✅ cartId:', carritoData.data.id, typeof carritoData.data.id);
        console.log('✅ datosPedido:', datosPedido);
        // Crear pedido DESDE CARRITO
        const pedidoResponse = await fetch(`${this.apiConfig.baseUrl}/pedidos/from-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosPedido)
        });

        const pedidoData = await pedidoResponse.json();
        console.log('Pedido creado:', pedidoData);

        // Mostrar mensaje de éxito
        this.toastMensaje = '¡Pedido realizado con éxito!';
        this.toastTipo = 'success';
        this.mostrarToast = true;
        setTimeout(() => { this.mostrarToast = false; }, 3000);

        // Limpiar carrito y cerrar formularios
        this.vaciarCarrito();
        this.cerrarFormularioPedido();
        this.mostrarCarrito = false;

        // Opcional: Mostrar número de pedido
        setTimeout(() => {
          alert(`¡Gracias por tu pedido! \nNúmero de pedido: ${pedidoData.id}\nEstado: ${pedidoData.estado}\n\nTe notificaremos cuando esté listo.`);
        }, 500);

      } catch (error) {
        console.error('Error al procesar pedido:', error);
        this.toastMensaje = 'Error al procesar el pedido.';
        this.toastTipo = 'error';
        this.mostrarToast = true;
        setTimeout(() => { this.mostrarToast = false; }, 3000);
      } finally {
        this.enviandoPedido = false;
      }
    },

    mostrarToastPersonalizado(mensaje, tipo = 'info') {
      this.toastMensaje = mensaje;
      this.toastTipo = tipo;
      this.mostrarToast = true;
      setTimeout(() => { this.mostrarToast = false; }, 3000);
    },

    formatearPrecio(precio) {
      const precioNumerico = parseFloat(precio);
      return isNaN(precioNumerico) ? '0.00' : precioNumerico.toFixed(2);
    },

    getEmojiCategoria(tipo_carta) {
      const emojis = {
        'comida': '🍽️',
      };
      
      return emojis[tipo_carta?.toLowerCase()] || '🍽️';
    },

    async recargarProductos() {
      await this.cargarProductos();
    },

    tieneProductos(data) {
      if (Array.isArray(data)) {
        return data.some(item => item.nombre || item.precio);
      }
      return false;
    }
  }
}
</script>

<style scoped>
/* Animación personalizada para las tarjetas */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d97706;
}

/* Estilos adicionales para mejor UX */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transiciones suaves para el panel del carrito */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Asegurar que el overlay no interfiera con el scroll */
.overflow-hidden {
  overflow: hidden;
}
</style>