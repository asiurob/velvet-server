import mongo from 'mongoose'

const schema = new mongo.Schema({

    name:     { type: String, required: [ true, 'El nombre es necesario' ] },
    lastname: { type: String, required: [ true, 'El apellido es necesario' ] },
    gender:   { type: Number, required: [ true, 'El género es necesario' ] },
    phone:    { type: Number, required: [ true, 'El teléfono es necesario' ] },
    rol:      { type: mongo.Schema.Types.ObjectId, ref: 'Rol' },
    photo:    { type: String, default: 'default.png' },

    username: { type: String, required: [ true, 'El usuario es importante' ], unique: [ true, 'El usuario ya existe' ] },
    password: { type: String, required: [ true, 'Se necesita una contraseña' ] },
    link:     { type: String, required: [ true, 'Se necesita el link de uso' ] },

    control: {
        status:       { type: Boolean, default: true },
        exists:       { type: Boolean, default: true },
        addedBy:      { type: mongo.Schema.Types.ObjectId, ref: 'User' },
        addedDate:    { type: Date, default: Date.now },
        modification: [
            {
                _id: false,
                user:   { type: mongo.Schema.Types.ObjectId, ref: 'User' },
                date:   { type: Date, default: Date.now },
                fields: []
            }
        ] 
    }
}, { collection: 'users' })

export const UserModel = mongo.model( 'User', schema )