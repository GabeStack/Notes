import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception } from '@adonisjs/core/build/standalone'

export default class TokenExpiredException extends Exception {
    public code = 'TOKEN_EXPIRED'
    public status = 410

    constructor(){
        super('Token has expired ')
    }

    public async handle(error: this, ctx: HttpContextContract){
        return ctx.response.status(error.status).send({code: error.code, status: error.status})
    }
}
