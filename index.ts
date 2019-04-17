//Dependencias
import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from 'body-parser';
import cors from 'cors';
import Database from "./classes/database";

//Importar rutas
import RoleRouter from "./routes/role.route";
import JobRouter from "./routes/job.route";
import ModuleRouter from "./routes/module.route";
import UserRouter from "./routes/user.route";
import LoginRouter from "./routes/login.route";


//Declaraciones
const server   = Server.instance;
const database = Database.instance;

//BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

//CORS
server.app.use( cors( { origin: true, credentials: true } ) );

//Rutas
server.app.use( '/roles', RoleRouter );
server.app.use( '/jobs', JobRouter );
server.app.use( '/modules', ModuleRouter );
server.app.use( '/users', UserRouter );
server.app.use( '/login', LoginRouter );
//Iniciar el servidor
server.app.use( '/', router );
server.start( () => {
    console.log( `Server running at ${ server.port } port` );
});

//Iniciar base de datos
database.connect();
