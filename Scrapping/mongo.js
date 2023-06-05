import { MongoClient } from 'mongodb'

// Configura la URL de conexión de MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

// Crea un nuevo cliente de MongoDB
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Conecta con el servidor de MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error al conectar con MongoDB:', err);
    return;
  }

  console.log('Conexión exitosa con MongoDB');

  // Selecciona la base de datos
  const db = client.db(dbName);

  // Aquí puedes realizar operaciones con la base de datos

  // Cierra la conexión al finalizar
  client.close();
});