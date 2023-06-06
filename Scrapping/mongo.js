import { MongoClient } from 'mongodb'

// Configura la URL de conexión de MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

// Crea un nuevo cliente de MongoDB
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para conectar a la base de datos
function conectarDB() {
  return new Promise((resolve, reject) => {
    // Conecta con el servidor de MongoDB
    client.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('Conexión exitosa con MongoDB');

      // Selecciona la base de datos
      const db = client.db(dbName);

      // Resuelve la Promise con la referencia a la base de datos
      resolve(db);
    });
  });
}

// Función para listar los documentos de una colección
async function list(coleccion) {
  try {
    // Conecta a la base de datos
    const db = await conectarDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);

    // Realiza la consulta para obtener los documentos
    const documentos = await collection.find().toArray();

    // Cierra la conexión al finalizar
    client.close();

    // Retorna los documentos encontrados
    return documentos;
  } catch (error) {
    console.error('Error al listar los documentos:', error);
    throw error;
  }
}