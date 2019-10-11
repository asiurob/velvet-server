import mongo from 'mongoose'

const schema = new mongo.Schema({
    name: { type: String, required: [ true, 'No se envió el nombre' ], unique: [ true, 'Este rol ya existe' ]},
    link: { type: String, unique: [ true, 'Este rol ya existe' ]},
    control: {
        status:       { type: Boolean, default: true },
        exists:       { type: Boolean, default: true },
        addedBy:      { type: mongo.Schema.Types.ObjectId, ref: 'User' },
        addedDate:    { type: Date, default: Date.now },
        modification: [
            {
                user:   { type: mongo.Schema.Types.ObjectId, ref: 'User' },
                date:   { type: Date, default: Date.now },
                fields: []
            }
        ] 
    }
}, { collection: 'roles' })

export const RolModel = mongo.model( 'Rol', schema )