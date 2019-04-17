//Dependencias
import mongo from 'mongoose';
import { DBPORT, DB, DBHOST } from "../global/environment";

export default class Database {

    private static _instance: Database;
    private db: string;
    private dbPort: Number;
    private dbHost: string;
    private uri: string;

    //Inicializar variables y métodos
    //Implementación de patrón Singleton
    private constructor () {
        this.db = DB;
        this.dbPort = DBPORT;
        this.dbHost = DBHOST;
        this.uri = `${ this.dbHost }:${ this.dbPort }/${ this.db }`;
    }

    //Regresar la instancia corriendo patrón Singleton
    public static get instance() {
        return this._instance || ( this._instance = new Database() );
    }

    public connect () {
        mongo.connect( this.uri, ( err: any ) => {
            if( err ) { 
                console.log( err.message ); 
            } else { 
                console.log( `Database connected to ${ this.db }` );
            }
        });
    }
}