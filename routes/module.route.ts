import {  Router, Request, Response } from 'express';
import ModuleModel from '../models/module.model';
import { error500 } from '../global/errors';



const ModuleRouter = Router();

ModuleRouter.get('/:id?', ( req: Request, res: Response ) => {

    let id = req.params.id ? { _id: req.params.id } : {};

    ModuleModel.find( id ).sort('name')
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

ModuleRouter.post('/', ( req: Request, res: Response ) => {

    const model = new ModuleModel({
        name: req.body.name,
        path: req.body.path,
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
            message: `Se insertó correctamente el módulo ${ saved.name }`
        });
    });
});

export default ModuleRouter;