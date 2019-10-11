import jwt from 'jsonwebtoken'
import { SEED } from '../global/environment'
import { Request, Response } from 'express'
import { e401 } from '../global/errors'

export const auth = ( req: Request, res: Response, next: any ) => {
    const token = req.body.token
    jwt.verify( token, SEED, ( err: any, dec: any ) => {
        if( err ) return res.status(401).json( { message: `${ e401 } - Token inválido`, meta: err.message } )

        req.body.user = dec.user[0]._id
        req.body.userdata = dec.user[0]
        next()
    })
}