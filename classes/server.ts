//Dependencias
import express from 'express'
import { PORT } from '../global/environment'
import http from 'http'


//Clase principal
export default class Server {

    private static _instance: Server
    public app: express.Application
    public port: number
    private http: http.Server

    //Inicializar variables y métodos
    //Implementación de patrón Singleton
    private constructor() {

        this.app  = express()
        this.port = PORT
        this.http = new http.Server( this.app )
    }

    //Regresar la instancia corriendo patrón Singleton
    public static get instance() {
        return this._instance || ( this._instance = new Server() )
    }

    //Método para iniciar el servidor
    start( callback: any ) {
        this.http.listen( this.port, callback )
    }

}