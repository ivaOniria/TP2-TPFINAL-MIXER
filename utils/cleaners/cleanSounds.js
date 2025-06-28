import mongoose from 'mongoose';
import usersModel from '../../model/DAO/models/user.js'; // Ajustá la ruta si es distinta

const limpiarSonidos = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/mibase');
    console.log('✅ Conectado a MongoDB');

    const resultado = await usersModel.updateMany({}, { $set: { sounds: [] } });

    console.log(`🧹 Limpieza completada. Documentos modificados: ${resultado.modifiedCount}`);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

limpiarSonidos();
