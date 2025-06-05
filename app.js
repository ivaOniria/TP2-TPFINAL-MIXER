import Server from "./server.js";
import config from './config.js'
import CnxMongoDB from "./model/DBMongo.js";

await CnxMongoDB.conectar()

new Server(config.PORT).start()