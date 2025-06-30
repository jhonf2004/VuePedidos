const mysql = require('mysql2/promise');

// Verificar variables de entorno
console.log('Variables de entorno:');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_USER:', process.env.DB_USER || 'root');
console.log('DB_NAME:', process.env.DB_NAME || 'restaurante_db');
console.log('DB_PORT:', process.env.DB_PORT || 3306);

// Usar Pool en lugar de Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '72526665',
  database: process.env.DB_NAME || 'restaurante_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
db.execute('SELECT 1')
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error.message);
  });

module.exports = db;