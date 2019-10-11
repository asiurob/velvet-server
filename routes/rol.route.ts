import { Router, Request, Response } from 'express'
import { RolModel } from '../models/rol.model'
import { auth } from '../middlewares/auth.mdw'
import { e400, e500, e403 } from '../global/errors'
import ErrorHandler from '../global/errrorHandler'

const RolRoute = Router()
const ehandler = new ErrorHandler()

// CREAR
RolRoute.post( '/', ( req: Request, res: Response ) => {
    const body = req.body
    if ( !body.name ) return res.status( 401 ).json( { message: e400, meta: 'el nombre del rol' } )

    const name = body.name
    const link = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase()

    const model = new RolModel({ name, link, 'control.addedBy': body.user })
    model.save( ( err: any ) => {
        
        if ( err ) return res.status( 500 ).json( { message: e500, meta: ehandler.mongoHandler( err ) } )
            
        res.status( 201 ).json({ message: `Creado ${ name }` })
    })
})

// ACTUALIZAR
RolRoute.put('/:id', ( req: Request, res: Response ) => {

    const id   = req.params.id
    const name = req.body.name

    if ( !name ) return res.status( 401 ).json( { message: e400, meta: 'el nombre del rol' } )
    const link = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase()
    
    RolModel.findByIdAndUpdate( id, { name, link }, ( err: any, updated: any ) => {
        if ( err ) return res.status( 500 ).json( { message: e500, meta: ehandler.mongoHandler( err ) } )

        res.status( 204 ).json({})
    })
})

// OBTENER
RolRoute.get('/',  ( req: Request, res: Response ) => {

    const model = RolModel.find()

    model.select('name _id link')
    model.where( 'control.exists', true )
    model.sort( 'name' )

    model.exec( ( err: any, data: any ) => {
        if ( err ) return res.status( 500 ).json( { message: e500, meta: ehandler.mongoHandler( err ) } )
        res.status( 200 ).json({ data })
    })
})

// BORRADO LÓGICO
RolRoute.delete( '/:id', ( req: Request, res: Response ) => {    
    res.status( 403 ).json( { message: e403 } )
})


export default RolRoute