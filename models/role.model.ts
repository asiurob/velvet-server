import mongos from 'mongoose';
import validator from 'mongoose-unique-validator';


const Role = new mongos.Schema({
    name:       { type: String, required: [true, 'El nombre del rol es necesario'], unique: [true, 'El nombre del rol ya existe'], max: 50, min: 3 },
    status:     { type: String, default: 'active' },
    added_by:   { type: String },
    added_date: { type: Date, default: Date.now },
    mod_log :[{
        mod_by:   { type: String },
        mod_date: { type: Date, default: Date.now },
        current:  { type: String },
        modified: { type: String }
    }]

}, { collection: 'roles' });

Role.plugin( validator, { message: 'El {PATH} está no es válido' } );

const RoleModel = mongos.model('Role', Role );

export default RoleModel;