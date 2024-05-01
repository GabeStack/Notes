import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({faker}) =>{
    return{
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.internet.url()
    }
}).build()