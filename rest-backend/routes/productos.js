
const express = require('express');
const Producto = require('../models/Producto');
const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/productos/categoria/:categoria - Obtener por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const productos = await Producto.getByCategoria(req.params.categoria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/productos - Crear producto
router.post('/', async (req, res) => {
  try {
    const id = await Producto.create(req.body);
    res.status(201).json({ id, message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;