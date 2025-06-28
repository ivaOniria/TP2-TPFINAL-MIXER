import mongoose from 'mongoose';
import usersModel from '../../model/DAO/models/user.js';  // Ajustá ruta si hace falta
import soundsModel from '../../model/DAO/models/sound.js'; // Ajustá ruta

const limpiarSonidosHuérfanos = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/mibase');
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los IDs válidos de usuarios
    const usuarios = await usersModel.find({}, { _id: 1 }).lean();
    const usuariosIds = usuarios.map(u => u._id.toString());

    // Buscar sonidos cuyo user no esté en usuariosIds
    const sonidosHuerfanos = await soundsModel.find().lean();
    const sonidosAEliminar = sonidosHuerfanos.filter(s => !usuariosIds.includes(s.user.toString()));

    // Eliminar sonidos huérfanos
    const idsAEliminar = sonidosAEliminar.map(s => s._id);
    if (idsAEliminar.length > 0) {
      const res = await soundsModel.deleteMany({ _id: { $in: idsAEliminar } });
      console.log(`🗑️ Se eliminaron ${res.deletedCount} sonidos huérfanos`);
    } else {
      console.log('✅ No se encontraron sonidos huérfanos para eliminar');
    }

  } catch (error) {
    console.error('❌ Error durante limpieza de sonidos huérfanos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

limpiarSonidosHuérfanos();
