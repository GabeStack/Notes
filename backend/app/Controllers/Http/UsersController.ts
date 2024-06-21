import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreaterUser from 'App/Validators/CreaterUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {

  public async store({request, response}: HttpContextContract) {
    const userPayload = await request.validate(CreaterUser)
    const coverImage = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg','jpeg', 'png', 'webp'],
    })
    const userByEmail = await  User.findBy('email', userPayload.email)
    const userByName = await  User.findBy('username', userPayload.username)
    console.log(coverImage)
    if(userByEmail) throw new BadRequest('email already in use', 409)
    if(userByName) throw new BadRequest('username already in use', 409)
    if(coverImage) {
      await coverImage.moveToDisk('uploads', {}, 's3')
      const coverImageName = coverImage.fileName
      const users = await User.create({
        username: userPayload.username,
        email: userPayload.email,
        password: userPayload.password,
        avatar: coverImageName, 
      })
      return response.created({users})
  }
  const users = await User.create(userPayload)
  return response.created({users})
  }

  public async update({response, request, bouncer}: HttpContextContract) {
    const {email, password} = await request.validate(UpdateUser)
    const coverImage = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg','jpeg', 'png', 'webp'],
    })
    const id = request.param('id')
    const user = await User.findOrFail(id)
    await bouncer.authorize('updateUser', user)
    user.email = email
    user.password = password
    if (coverImage) {
      const coverImageName = coverImage.fileName
      if (coverImageName) {
        await coverImage.moveToDisk('./uploads/avatars') 
        user.avatar = coverImageName
      }
    }
    await user.save()
    return response.ok({user})
  }
  
  public async destroy ({response, request, bouncer} :HttpContextContract){
    const id = request.param('id')
    const user = await User.findOrFail(id)
    await bouncer.authorize('updateUser', user)
    await user.delete()
    return response.ok("Conta deletada.")
  }
}
