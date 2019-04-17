import mongos from 'mongoose';
import validator from 'mongoose-unique-validator';

export const Module = new mongos.Schema({
    name:       { type: String, required: [true, 'El nombre del módulo es necesario'], unique: [true, 'El nombre del módulo ya existe'], max: 50, min: 3 },
    path:       { type: String, required: [true, 'La ruta es necesaria'] },
    icon:       { type: String },
    status:     { type: String, default: 'active' },
    added_by:   { type: String },
    added_date: { type: Date, default: Date.now },
    mod_log :[{
        mod_by:   { type: String },
        mod_date: { type: Date, default: Date.now },
        current:  { type: String },
        modified: { type: String }
    }]

}, { collection: 'modules' });

Module.plugin( validator, { message: 'El {PATH} está no es válido' } );

const ModuleModel = mongos.model('Module', Module );

export default ModuleModel;