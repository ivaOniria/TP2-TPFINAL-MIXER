import mongoose from 'mongoose';
import usersModel from '../model/DAO/models/user.js';
import { soundsModel } from '../model/DAO/models/sound.js';
import config from '../config.js';

// Datos del usuario
const userData = {
    _id: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6'),
    nombre: 'General',
    email: 'general@gmail.com',
    password: '$2b$10$HhtFkJ2BIR1nmp5tXO074.7jGjm2Lxxxm5MQKHJMN8t/sNO4zmB9m'
};

// Datos de los sonidos - actualizados con los IDs reales
const soundsData = [
    {
        _id: new mongoose.Types.ObjectId('68603b3bd670d7ed44d273fb'),
        title: 'Drums 1',
        url: 'https://kmhbucdqwupqouvscrsi.supabase.co/storage/v1/object/public/chorimixer/1751137082052_Drums%201.mp3',
        type: 'DRUMS',
        user: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6')
    },
    {
        _id: new mongoose.Types.ObjectId('68603b45d670d7ed44d27400'),
        title: 'Drums 2',
        url: 'https://kmhbucdqwupqouvscrsi.supabase.co/storage/v1/object/public/chorimixer/1751137091700_Drums%202.mp3',
        type: 'DRUMS',
        user: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6')
    },
    {
        _id: new mongoose.Types.ObjectId('68603b53d670d7ed44d27405'),
        title: 'Bass 1',
        url: 'https://kmhbucdqwupqouvscrsi.supabase.co/storage/v1/object/public/chorimixer/1751137105952_Bass%201.mp3',
        type: 'BASS',
        user: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6')
    },
    {
        _id: new mongoose.Types.ObjectId('6860536f8ab8a7f124b25df0'),
        title: 'Pad 1',
        url: 'https://kmhbucdqwupqouvscrsi.supabase.co/storage/v1/object/public/chorimixer/1751143277942_Pad%201.mp3',
        type: 'PADS',
        user: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6')
    },
    {
        _id: new mongoose.Types.ObjectId('6860537f8ab8a7f124b25df5'),
        title: 'Shaker 1',
        url: 'https://kmhbucdqwupqouvscrsi.supabase.co/storage/v1/object/public/chorimixer/1751143293389_Shaker%201.mp3',
        type: 'SHAKERS',
        user: new mongoose.Types.ObjectId('68603a5ed670d7ed44d273f6')
    }
];

async function populateDatabase() {
    try {
        // Conectar a la base de datos
        console.log('Conectando a la base de datos...');
        await mongoose.connect(`${config.STRCNX}/${config.BASE}`);
        console.log('✅ Conectado a la base de datos');

        // Limpiar colecciones existentes
        console.log('\n🧹 Limpiando colecciones existentes...');
        const userDeleteResult = await usersModel.deleteMany({});
        const soundDeleteResult = await soundsModel.deleteMany({});
        
        console.log(`🗑️  Usuarios eliminados: ${userDeleteResult.deletedCount}`);
        console.log(`🗑️  Sonidos eliminados: ${soundDeleteResult.deletedCount}`);
        console.log('✅ Colecciones limpiadas');

        // Crear los sonidos primero
        console.log('\n🏗️  Insertando sonidos...');
        const soundsInserted = await soundsModel.insertMany(soundsData);
        console.log(`✅ ${soundsInserted.length} sonidos insertados`);

        // Crear el usuario con las referencias exactas a los sonidos actuales
        const soundIds = [
            new mongoose.Types.ObjectId('68603b3bd670d7ed44d273fb'), // Drums 1
            new mongoose.Types.ObjectId('68603b45d670d7ed44d27400'), // Drums 2
            new mongoose.Types.ObjectId('68603b53d670d7ed44d27405'), // Bass 1
            new mongoose.Types.ObjectId('6860536f8ab8a7f124b25df0'), // Pad 1
            new mongoose.Types.ObjectId('6860537f8ab8a7f124b25df5')  // Shaker 1
        ];

        const userWithSounds = {
            ...userData,
            sounds: soundIds
        };

        console.log('Insertando usuario General...');
        const userInserted = await usersModel.create(userWithSounds);
        console.log(`✅ Usuario insertado: ${userInserted.nombre}`);

        // Verificar los datos insertados
        console.log('\n--- VERIFICACIÓN FINAL ---');
        const finalUserCount = await usersModel.countDocuments();
        const finalSoundCount = await soundsModel.countDocuments();
        
        console.log(`👤 Usuarios en DB: ${finalUserCount}`);
        console.log(`🎵 Sonidos en DB: ${finalSoundCount}`);

        // Mostrar el usuario con sus sonidos poblados
        const userWithPopulatedSounds = await usersModel.findById(userData._id).populate('sounds');
        console.log('\n👤 Usuario creado:');
        console.log(`   Nombre: ${userWithPopulatedSounds.nombre}`);
        console.log(`   Email: ${userWithPopulatedSounds.email}`);
        console.log(`   Sonidos asociados: ${userWithPopulatedSounds.sounds.length}`);
        
        userWithPopulatedSounds.sounds.forEach((sound, index) => {
            console.log(`   ${index + 1}. ${sound.title} (${sound.type})`);
        });

        console.log('\n🎉 ¡Base de datos poblada exitosamente!');

    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
    } finally {
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar el script
populateDatabase(); 