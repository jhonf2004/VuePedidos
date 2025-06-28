const db = require('../config/database');

class Producto {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre
      FROM 
        productos p
      JOIN 
        categorias c ON p.categoria_id = c.id
      WHERE 
        p.estado = 1
    `);
    return rows;
  }

  static async getByCategoria(nombreCategoria) {
    const [rows] = await db.execute(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre
      FROM 
        productos p
      JOIN 
        categorias c ON p.categoria_id = c.id
      WHERE 
        c.nombre = ? AND p.estado = 1
    `, [nombreCategoria]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre
      FROM 
        productos p
      JOIN 
        categorias c ON p.categoria_id = c.id
      WHERE 
        p.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(producto) {
    const { nombre, descripcion, precio, imagen_url, categoria_id } = producto;
    const [result] = await db.execute(
      `
      INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nombre, descripcion, precio, imagen_url, categoria_id]
    );
    return result.insertId;
  }

  static async update(id, producto) {
    const { nombre, descripcion, precio, imagen_url, categoria_id, estado } = producto;
    const [result] = await db.execute(
      `
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, categoria_id = ?, estado = ?
      WHERE id = ?
      `,
      [nombre, descripcion, precio, imagen_url, categoria_id, estado, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'UPDATE productos SET estado = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Producto;
