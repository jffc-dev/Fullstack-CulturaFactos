import pckMongo from 'mongodb'

const { MongoClient } = pckMongo

// Configura la URL de conexión de MongoDB
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'CulturaFactos';

const client = new MongoClient(url);

// Función para conectar a la base de datos
const connectDB = () => {
  // Crea un nuevo cliente de MongoDB
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
export const list = async(coleccion) => {
  try {
    // Conecta a la base de datos
    const db = await connectDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);
    const documentos = await collection.find().toArray();

    return documentos;

  } catch (error) {
    console.error('Error listing documents:', error);
    throw error;
  }
}

// Función for filter documents by query
export const get = async(coleccion, query) => {
  try {
    // Conecta a la base de datos
    const db = await connectDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);
    const documentos = await collection.find(query).toArray();

    return documentos;

  } catch (error) {
    console.error('Error filtering documents:', error);
    throw error;
  }
}

// Función para insertar un documento en una colección
export const createOne = async(coleccion, documento) => {
  try {
    // Conecta a la base de datos
    const db = await connectDB();

    // Obtiene la referencia a la colección
    const collection = db.collection(coleccion);
    const resultado = await collection.insertOne(documento);

    return resultado;

  } catch (error) {
    console.error('Error al insertar el documento:', error);
    throw error;
  }
}

// Function to insert a document into a collection
export const createMultiple = async (collection, documents) => {
  try {
    // Connect to the database
    const db = await connectDB();
    // Get the reference to the collection
    const query = db.collection(collection);
    const result = await query.insertMany(documents);

    return result;

  } catch (error) {
    console.error('Error inserting the document:', error);
    throw error;
  }
}

export const closeConnectionMongo = async() => {
  try {
    await client.close();
  } catch (error) {
    console.error('Error filtering documents:', error);
    throw error;
  }
}