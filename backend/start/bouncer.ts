import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export const { actions } = Bouncer.define('updateUser', (user: User, updateUser: User) =>{
    return user.id === updateUser.id
})

export const { policies } = Bouncer.registerPolicies({})
