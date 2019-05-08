require('dotenv').config();

module.exports = function() {
    if (!process.env.SECRET){
        throw new Error('No hay llave privada definida.');
    }

    if (!process.env.PORT){
        throw new Error('No hay puerto definido para el servidor.');
    }

    if (!process.env.DB_CON){
        throw new Error('No hay ruta definida para la base de datos.');
    }
}