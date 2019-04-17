import {  Router, Request, Response } from 'express';
import JobModel from '../models/job.model';
import { error500 } from '../global/errors';



const JobRouter = Router();

JobRouter.get('/:id?', ( req: Request, res: Response ) => {

    let id = req.params.id ? { _id: req.params.id } : {};

    JobModel.find( id ).sort('name')
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

JobRouter.post('/', ( req: Request, res: Response ) => {

    const model = new JobModel({
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
            message: `Se insertó correctamente la función ${ saved.name }`
        });
    });
});

export default JobRouter;