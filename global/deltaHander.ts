import { UserModel } from '../models/user.model';
export default class DeltaHandler {
    
    public user( id: String, data: any, required: String ): Promise<any> {
        const arr = required.split(' ')
        return new Promise((resolve: any, reject: any) => {
            const model = UserModel.find()
            
            model.select( required )
            model.where({ _id: id })
            model.exec( ( err: any, info: any ) => {
                if ( err || !info ) reject(null) 
                resolve( this.loop( arr, info, data ) )
            })
        })
    }

    private loop( indexes: Array<String>, info:any, data: any ): Array<any> {
        let delta: Array<any> = []
        info = info[0]
        indexes.forEach( ( index: any) => {
            if ( info[ index ] && data[ index ] ) {
                if ( info[ index ] != data[ index ] ) {
                    const del: any = {}
                    del.label =  index
                    del.from  = info[ index ],
                    del.to    = data[ index ]
                    delta.push( del )
                }
            }
        })
        return delta
    }
}