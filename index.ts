//Dependencias
import Server from "./classes/server"
import bodyParser from 'body-parser'
import cors from 'cors'
import Database from "./classes/database"
import fileUpload from 'express-fileupload'
// Declaración de rutas
import RolRoute from './routes/rol.route'
import UserRoute from "./routes/user.route"


//Declaraciones
const server   = Server.instance
const database = Database.instance

//helpers
server.app.use( bodyParser.urlencoded({ extended: true }) )
server.app.use( bodyParser.json() )
server.app.use( fileUpload() )

//CORS
server.app.use( cors( { origin: true, credentials: true } ) )

//Rutas
server.app.use( '/roles', RolRoute )
server.app.use( '/users', UserRoute )



//Iniciar el servidor
server.start( () => {
    console.log( `Server running at ${ server.port } port` )
})

//Iniciar base de datos
database.connect()
