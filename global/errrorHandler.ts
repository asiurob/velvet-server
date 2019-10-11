import { mongoErrors } from "./errors"

export default class ErrorHandler {

    public mongoHandler( err: any ): String {
        let meta = ''
        if ( mongoErrors[ err[ 'code' ] ] ) { 
            meta = mongoErrors[ err[ 'code' ] ] 
        }
        else if ( err.errors && err.errors.name && err.errors.name.message ) {
             meta = err.errors.name.message 
        }
        else { 
            meta ='Error desconocido, contacta con el administrador' 
        }
        return meta
    }
}