import pckMongo from 'mongodb'

const { MongoClient } = pckMongo

// Configura la URL de conexión de MongoDB
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'CulturaFactos';

const client = new MongoClient(url, {
  useUnifiedTopology: true
});

// Función para conectar a la base de datos
const conectarDB = () => {
  // Crea un nuevo cliente de MongoDB
  return new Promise((resolve, reject) => {
    // Conecta con el servidor de MongoDB
    console.log("asdasd");
    client.connect((err) => {
      console.log("asdasd1");
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
export const list = async(coleccion) => {
  try {
    // Conecta a la base de datos
    const db = await conectarDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);
    const documentos = await collection.find().toArray();

    // Cierra la conexión al finalizar
    client.close();
    return documentos;

  } catch (error) {
    console.error('Error al listar los documentos:', error);
    throw error;
  }
}

// Función para insertar un documento en una colección
export const createOne = async(coleccion, documento) => {
  try {
    // Conecta a la base de datos
    const db = await conectarDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);
    const resultado = await collection.insertOne(documento);

    // Cierra la conexión al finalizar
    client.close();
    return resultado;

  } catch (error) {
    console.error('Error al insertar el documento:', error);
    throw error;
  }
}