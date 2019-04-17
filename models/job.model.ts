import mongos from 'mongoose';
import validator from 'mongoose-unique-validator';

export const Job = new mongos.Schema({
    name:       { type: String, required: [true, 'El nombre de la posición es necesaria'], unique: [true, 'El nombre de la posición ya existe'], max: 50, min: 3 },
    status:     { type: String, default: 'active' },
    added_by:   { type: String },
    added_date: { type: Date, default: Date.now },
    mod_log :[{
        mod_by:   { type: String },
        mod_date: { type: Date, default: Date.now },
        current:  { type: String },
        modified: { type: String }
    }]

}, { collection: 'jobs' });

Job.plugin( validator, { message: 'El {PATH} está no es válido' } );

const JobModel = mongos.model('Job', Job );

export default JobModel;