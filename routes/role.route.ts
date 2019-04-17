import {  Router, Request, Response } from 'express';
import RoleModel from '../models/role.model';
import { error500 } from '../global/errors';



const RoleRouter = Router();

RoleRouter.get('/:id?', ( req: Request, res: Response ) => {

    let id = req.params.id ? { _id: req.params.id } : {};

    RoleModel.find( id ).sort('name')
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

RoleRouter.post('/', ( req: Request, res: Response ) => {

    const model = new RoleModel({
        name: req.body.name,
        added_by: req.body.added
    });

    model.save( ( err: any, saved: any ) => {
        if( err ) {
            return res.status( 500 ).json({
                message: error500,
                error: err.errors
            });
        }

        res.status( 200 ).json({
            message: `Se insertó correctamente el rol ${ saved.name }`
        });
    });
});

export default RoleRouter;