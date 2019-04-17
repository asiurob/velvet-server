import {  Router, Request, Response } from 'express';
import UserModel from '../models/user.model';
import { error500 } from '../global/errors';
import  bcrypt  from 'bcrypt';



const UserRouter = Router();

UserRouter.get('/:id?', ( req: Request, res: Response ) => {

    let id = req.params.id ? { _id: req.params.id } : {};

    UserModel.find( id ).sort('name')
    .exec(( err:any, data:any ) => {
        if( err ) {
            return res.status( 500 ).json({
                message: error500
            });
        }

        res.status( 200 ).json({
            data
        });
    });
});

UserRouter.post('/', ( req: Request, res: Response ) => {

    const salt = 10;
    const pass = req.body.pass;
    
    const model = new UserModel({
        personal_data: {
            name:       req.body.name,
            last_name:  req.body.last_name,
            user_name:  req.body.user_name,
            email:      req.body.email,
            gender:     req.body.gender
        },
    
        company_data: {
            role:       req.body.role,
            job:        req.body.job,
            permissions: [] 
        },
        engine_data: {
            password: bcrypt.hashSync( req.body.pass, 10 ),
            added_by: req.body.added,
            mod_log: []
        }
    });

    model.save( ( err: any, saved: any ) => {
        if( err ) {
            return res.status( 500 ).json({
                message: error500,
                error: err.errors
            });
        }

        res.status( 200 ).json({
            message: `Se insertó correctamente el usuario ${ saved.personal_data.name } ${ saved.personal_data.last_name }`
        });
    });
});

export default UserRouter;