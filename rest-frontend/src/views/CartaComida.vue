<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-900 to-red-50">
    <!-- Header -->
    <header class="bg-white shadow-xl border-b-4 border-amber-800">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-amber-900 to-red-600 bg-clip-text text-transparent">
            🍽️ Carta Digital
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
    <main class="container mx-auto px-4 py-8">
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
              {{ getEmojiCategoria(producto.categoria_nombre) }}
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

    <!-- Toast de notificación -->
    <div 
      v-if="mostrarToast"
      class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50"
      :class="mostrarToast ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
    >
      ✅ Producto agregado al carrito
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartaComida',
  data() {
    return {
      productos: [],
      productosFiltrados: [],
      categorias: [],
      categoriaActiva: 'todos',
      loading: true,
      error: null,
      mostrarToast: false,
      // Configuración de la API
      apiConfig: {
        baseUrl: import.meta.env.VUE_APP_API_URL || 'http://192.168.1.10:3000',
        timeout: 10000
      }
    }
  },
  async mounted() {
    await this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      try {
        this.loading = true;
        this.error = null;
        
        const url = `${this.apiConfig.baseUrl}/productos/tipo-carta/1`;
        console.log('🔍 Intentando cargar desde:', url);
        
        // URL para NestJS
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
        
        // if (!response.ok) {
        //   // Si es 404, probemos con /api/productos
        //   if (response.status === 404) {
        //     console.log('Probando con /api/productos...');
        //     const altResponse = await fetch(`${this.apiConfig.baseUrl}/api/productos`);
        //     if (altResponse.ok) {
        //       const altData = await altResponse.json();
        //       console.log('✅ Datos obtenidos con /api/productos:', altData);
        //       this.procesarDatos(altData);
        //       return;
        //     }
        //   }
        //   throw new Error(`Error ${response.status}: ${response.statusText}`);
        // }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        console.log('Tipo de datos:', typeof data);
        console.log('Es array:', Array.isArray(data));
        
        this.procesarDatos(data);
        
      } catch (error) {
        console.error('Error al cargar productos:', error);
        
        // Manejo de errores más específico
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
      // Validar que la respuesta sea un array
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
      
      console.log('📋 Primer producto (original):', data[0]);
      
      // Adaptar los datos al formato esperado por el componente
      const productosAdaptados = data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen_url: producto.imagenUrl, // Mapear imagenUrl a imagen_url
        categoria_nombre: producto.categoria?.nombre || 'Sin categoría', // Mapear categoria.nombre a categoria_nombre
        estado: producto.estado
      }));
      
      console.log('📋 Primer producto (adaptado):', productosAdaptados[0]);
      
      this.productos = productosAdaptados;
      this.productosFiltrados = productosAdaptados;
      
      // Extraer categorías únicas
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
        // Si tienes un endpoint para agregar al carrito en NestJS
        // const response = await fetch(`${this.apiConfig.baseUrl}/carrito`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     producto_id: producto.id,
        //     cantidad: 1
        //   })
        // });
        
        // Por ahora solo log local
        console.log('Agregando al carrito:', producto);
        
        // Mostrar toast de confirmación
        this.mostrarToast = true;
        setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
        
        // Emitir evento al componente padre si es necesario
        this.$emit('producto-agregado', producto);
        
      } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
      }
    },

    formatearPrecio(precio) {
      const precioNumerico = parseFloat(precio);
      return isNaN(precioNumerico) ? '0.00' : precioNumerico.toFixed(2);
    },

    getEmojiCategoria(categoria) {
      const emojis = {
        'comida': '🍽️',
        'bebidas': '🥤',
        'postres': '🍰',
        'entradas': '🥗',
        'platos principales': '🍖',
        'sopas': '🍲',
        'ensaladas': '🥙',
        'hamburguesas': '🍔',
        'pizzas': '🍕',
        'mariscos': '🦐',
        'carnes': '🥩',
        'pollo': '🍗',
        'vegetariano': '🥬',
        'desayuno': '🍳',
        'almuerzo': '🍽️',
        'cena': '🌙'
      };
      
      return emojis[categoria?.toLowerCase()] || '🍽️';
    },

    // Método para recargar productos
    async recargarProductos() {
      await this.cargarProductos();
    },

    // Verificar si los datos contienen productos
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
</style>