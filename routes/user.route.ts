import { Router, Request, Response } from 'express'
import { UserModel } from '../models/user.model'
import { e400, e500, e403 } from '../global/errors'
import bcrypt from 'bcrypt'
import ErrorHandler from '../global/errrorHandler'
import DeltaHandler from '../global/deltaHander'
import md5 from 'md5'
import fs from 'fs'


const UserRoute = Router()
const eHandler  = new ErrorHandler()
const deltas    = new DeltaHandler()


const keys: any = {
    name:   'el nombre', lastname: 'los apellidos',
    gender: 'el género', phone: 'el teléfono',
    username: 'el usuario', rol: 'el rol'
}

/* CREAR */
UserRoute.post('/', ( req: Request, res: Response ) => {
    let dataErrs: Array<any> = []

    for( let k in keys ) {
        if ( !req.body[ k ] ) {
            dataErrs.push( keys[ k ] );
        }
    }

    if ( dataErrs.length > 0 ) return res.status( 401 ).json( { message: e400, meta: dataErrs.join() } )

    const link = `${ req.body.name } ${ req.body.lastname } ${ req.body.username }`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase()
    const model = new UserModel({
        'name':     req.body.name,   'lastname': req.body.lastname,
        'gender':   req.body.gender, 'phone':    req.body.phone,
        'rol':      req.body.rol,    'username': req.body.username,
        'password': bcrypt.hashSync( 'Velvet1!', 10 ), 'link': link,
        'control.addedBy':   req.body.user
    })

    model.save( ( err: any, saved: any ) => {
        if ( err ) return res.status( 500 ).json( { message: e500, meta: eHandler.mongoHandler( err ) } )

        uploadFile( req.files, saved._id )
        .then( () => res.status(201).json({message: `Creado ${ req.body.name } ${ req.body.lastname }`}) )
        .catch( (err: any) => res.status(201).json({ message: `Se creo el recurso ${ req.body.name } ${ req.body.lastname } pero no fue posible subir la imagen`, meta: err }) )   
    })
})

/* OBTENER */
UserRoute.get('/',  ( req: Request, res: Response ) => {
    const model = UserModel.find()
    model.select('name lastname gender phone username link photo')
    model.populate({ path: 'rol', select: 'name' })
    model.where( 'control.exists', true )
    model.sort( 'name' )

    model.exec( ( err: any, data: any ) => {
        if ( err ) return res.status( 500 ).json( { message: e500, meta: eHandler.mongoHandler( err ) } )
        res.status( 200 ).json({ data })
    })
})

/* ACTUALIZAR */
UserRoute.put('/:id', (req: Request, res: Response) => {
    let dataErrs: Array<any> = []

    for( let k in keys ) {
        if ( !req.body[ k ] ) {
            dataErrs.push( keys[ k ] );
        }
    }

    if ( dataErrs.length > 0 ) return res.status( 401 ).json( { message: e400, meta: dataErrs.join() } )
    const id    = req.params.id
    const model = {
        name     : req.body.name,
        lastname : req.body.lastname,
        gender   : Number( req.body.gender ),
        phone    : Number( req.body.phone ),
        username : req.body.username,
        rol      : req.body.rol
    }
    const required = Object.keys( model ).join(' ')
    let message: any, meta: any

    UserModel.findOne( { _id: id }, 'photo', ( err: any, data: any ) => {
        if ( !err ) {
            const path = `./uploads/users/${ data.photo }`
            uploadFile( req.files, id, path )
            .then( () => message = `Actualizado ${ req.body.name } ${ req.body.lastname }` )
            .catch( (err: any) => {
                message = `Actualizado ${ req.body.name } ${ req.body.lastname } pero no fue posible subir la imagen`
                meta = err
            })
        } 
    })

    deltas.user( id, model, required )
    .then( ( delta: Array<any> ) => {
        if( delta.length > 0 ){
            const toUpdate: any = {}
            delta.forEach( ( d: any, index: number ) => {
                toUpdate[ d.field ]  = d.to
                delta[ index ].label = keys[ delta[ index ].label ] 
            })

            toUpdate.$push = { 'control.modification': { user: req.body.user, fields: delta } }
            toUpdate.link =  `${ req.body.name } ${ req.body.lastname } ${ req.body.username }`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase()
            UserModel.findOneAndUpdate( { _id: id }, toUpdate, ( err: any ) => {
                
                if( err ) return res.status( 500 ).json({ message: e500 })
                res.status( 200 ).json({ message, meta })
            })

        } else {
            return res.status( 200 ).json({ message, meta }) 
        }
    })
    .catch( () => {
        return res.status( 500 ).json({ message: e500 })
    })
})

// BORRADO LÓGICO
UserRoute.delete( '/:id', ( req: Request, res: Response ) => {    
    res.status( 403 ).json( { message: e403 } )
})


const uploadFile = ( file: any, id: string, old = '' ): Promise<any> => {

    return new Promise( (resolve, reject) => {

        if( file ) {
            file = file.image
            if( /^(image)\//i.test( file.mimetype ) ) {
                const fileName = `${ md5( `${ file.name }.${ id }-${ new Date().getMilliseconds() }` ) }.png`
                const path     = `./uploads/users/${ fileName }`
                const obj      = { photo: fileName }
                
                file.mv( path, (err: any) => {
                    if( !err ) {
                        UserModel.findByIdAndUpdate( id, obj, ( err: any ) => {
                            if( err ) reject( 'No se encontró al usuario' )
                            
                            if( old !== '' ) fs.unlinkSync( old )
                            
                            resolve('Archivo subido')
                                
                        })
                    } else {
                        reject( 'No fue posible copiar al servidor' )
                    }
                })
            } else {
                reject( 'Archivo inválido' )
            }
        } else {
            reject( 'No se envió el archivo' )
        }
        

    })
}

export default UserRoute