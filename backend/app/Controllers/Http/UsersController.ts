import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreaterUser from 'App/Validators/CreaterUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {

  public async store({request, response}: HttpContextContract) {
    const userPayload = await request.validate(CreaterUser)
    const userByEmail = await  User.findBy('email', userPayload.email)
    const userByName = await  User.findBy('username', userPayload.username)
    if(userByEmail) throw new BadRequest('email already in use', 409)
    if(userByName) throw new BadRequest('username already in use', 409)
    const users = await User.create(userPayload)
    return response.created({users})
  }

  public async update({response, request, bouncer}: HttpContextContract) {
    const {email, avatar, password} = await request.validate(UpdateUser)
    const id = request.param('id')
    const user = await User.findOrFail(id)
    await bouncer.authorize('updateUser', user)
    user.email = email
    user.password = password
    if (avatar) user.avatar = avatar
    await user.save()
    return response.ok({user})
  }
}
