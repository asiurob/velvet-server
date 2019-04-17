import {  Router, Request, Response } from 'express';
import UserModel from '../models/user.model';
import { error500 } from '../global/errors';
import  bcrypt  from 'bcrypt';



const LoginRouter = Router();

LoginRouter.post('/', ( req: Request, res: Response ) => {

    let user = req.body.user,
        pass = req.body.pass;
    
    if( !user || !pass ) {
        return res.status(403).json({
            message: 'No se envió usuario y/o contraseña'
        });
    }
    const requestedData = 'personal_data.name personal_data.last_name engine_data.password';
    const pop_role = { path: 'company_data.role', select: 'name' };
    const pop_job  = { path: 'company_data.job', select: 'name' };
    UserModel.find( { 'personal_data.user_name' : user }, requestedData )
    .populate( pop_role )
    .populate( pop_job )
    .exec(( err: any, data: any ) => {
        if( err ) {
            return res.status(500).json({
                message: error500,
                error: err
            });
        }
        if( !data[0] ) {
            return res.status(403).json({
                message: 'No se encontró el nombre de usuario',
                error: err
            });
        }
        console.log( pass, data[0].engine_data.password );
        if( !bcrypt.compareSync( pass, data[0].engine_data.password ) ) {
            return res.status(403).json({
                message: 'La contraseña es incorrecta',
                error: err
            });
        }

        res.status(200).json({
            data
        })

    });
});

export default LoginRouter;