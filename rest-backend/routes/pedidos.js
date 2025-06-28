
const express = require('express');
const Pedido = require('../models/Pedido');
const router = express.Router();

// POST /api/pedidos - Crear pedido
router.post('/', async (req, res) => {
  try {
    const id = await Pedido.create(req.body);
    res.status(201).json({ id, message: 'Pedido creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.getAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id/estado - Actualizar estado del pedido
router.put('/:id/estado', async (req, res) => {
  try {
    const success = await Pedido.updateEstado(req.params.id, req.body.estado);
    if (success) {
      res.json({ message: 'Estado actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;