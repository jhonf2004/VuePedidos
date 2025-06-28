const db = require('../config/database');

class Pedido {
  static async create(pedido) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Crear pedido
      const { nombre_cliente, telefono, direccion, mesa, tipo } = pedido;
      const [result] = await connection.execute(
        'INSERT INTO pedidos (nombre_cliente, telefono, direccion, mesa, tipo) VALUES (?, ?, ?, ?, ?)',
        [nombre_cliente, telefono, direccion, mesa, tipo]
      );
      
      const pedidoId = result.insertId;
      
      // Agregar productos al pedido
      if (pedido.productos && pedido.productos.length > 0) {
        for (const item of pedido.productos) {
          await connection.execute(
            'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
          );
        }
      }
      
      await connection.commit();
      return pedidoId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const [rows] = await db.execute(`
      SELECT p.*, 
             GROUP_CONCAT(CONCAT(pr.nombre, ' (', dp.cantidad, ')') SEPARATOR ', ') as productos
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
      GROUP BY p.id
      ORDER BY p.fecha_pedido DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [pedido] = await db.execute('SELECT * FROM pedidos WHERE id = ?', [id]);
    const [productos] = await db.execute(`
      SELECT dp.*, pr.nombre, pr.precio 
      FROM detalle_pedido dp
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE dp.pedido_id = ?
    `, [id]);
    
    return {
      ...pedido[0],
      productos
    };
  }

  static async updateEstado(id, estado) {
    const [result] = await db.execute('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Pedido;
