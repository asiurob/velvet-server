import mongos from 'mongoose';
import validator from 'mongoose-unique-validator';
import { Db } from 'mongodb';

export const User = new mongos.Schema({

    personal_data: {
        name:       { type: String, required: [ true, 'El nombre es necesario' ], max: 50 },
        last_name:  { type: String, required: [ true, 'El apellido es necesario' ], max: 100 },
        user_name:  { type: String, unique: [true, 'El usuario está duplicado'], required:[ true, 'El usuario es necesario' ], max: 25 },
        email:      { type: String, unique: [true, 'El correo está duplicado'], required:[ true, 'El correo es necesario' ], max: 100 },
        gender:     { type: String, max: 1 }
    },

    company_data: {
        role:       { type: mongos.Schema.Types.ObjectId, ref: 'Role' },
        job:        { type: mongos.Schema.Types.ObjectId, ref: 'Job'  },
        permissions: [{
            module: { type: mongos.Schema.Types.ObjectId, ref: 'Module' },
            chmod:  { type: String, min: 1, max: 5, default: 'r' }
        }] 
    },
    engine_data: {
        password:   { type: String },
        last_login: { type: Date },
        added_by:   { type: String },
        added_date: { type: Date, default: Date.now },
        mod_log: [{
            mod_by:   { type: String },
            mod_date: { type: Date, default: Date.now },
        }]
    }
}, { collection: 'users' });

User.plugin( validator, { message: 'El {PATH} está no es válido' } );

const UserModel = mongos.model('User', User );

export default UserModel;

