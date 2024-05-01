import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories/UserFactory'

test.group('Users', (group) => { 

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it should create an user',async ({client, assert}) =>{
    const userPayload = { email: 'test@test.com', username: 'test', password: 'test', avatar: 'https://avatar.avatar'}
    const response = await client.post('/users').json(userPayload)
    const {password,avatar, ...expected } = userPayload
    response.assertStatus(201)
    response.assertBodyContains({users: expected})
    assert.notExists(response.body().users.password, 'Password defined')
  })

  test('it should return 409 when username is already in use', async ({client, assert}) =>{
    const {username} = await UserFactory.create()
    const response = await client.post('/users').json({
      email: 'test@test.com',
      username: username,
      password: 'test'
    })
    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })
  test('it should return 409 when email is already in use', async ({client, assert}) =>{
    const {email} = await UserFactory.create()
    const response = await client.post('/users').json({
      email: email,
      username: 'test',
      password: 'test'
    })
    response.assertStatus(409)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })

  test('it should return 422 when required data is not provided', async ({client, assert}) => {
    const response = await client.post('/users').json({})
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 when providing an invalid email', async  ({client, assert}) => {
    const response = await client.post('/users').json({email: 'test@', password: 'test', username: 'test'})
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 when providing an invalid password', async  ({client, assert}) => {
    const response = await client.post('/users').json({email: 'test@test.com', password: 'tes', username: 'test'})
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should update an user', async ({client}) => {
    const plainPassword = 'test'
    const avatar = 'https://github.com/Cyacer.png'
    const { id, email } = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const response = await client.put(`/users/${id}`).bearerToken(apiToken.token).json({password: plainPassword, email, avatar})
    response.assertStatus(200)
    response.assertBodyContains({user:{email, avatar, id}})
    })

  test('it should update the password of the user', async ({client, assert}) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const password = 'test123';
    
    const response = await client.put(`/users/${user.id}`).bearerToken(apiToken.token).json({password, email: user.email, avatar: user.avatar})
    response.assertStatus(200)
    response.assertBodyContains({user:{id: user.id}})
    await user.refresh()
    assert.isTrue( await Hash.verify(user.password, password))

  })
  test('it should return 422 when required data is not provided', async ({client, assert}) => {
    const plainPassword = 'test'
    const {id, email} = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const response = await client.put(`/users/${id}`).bearerToken(apiToken.token).json({})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
  test('it should return 422 when providing an invalid email', async ({client, assert}) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const password = 'test123';
    const response = await client.put(`/users/${user.id}`).bearerToken(apiToken.token).json({password,avatar: user.avatar,email: 'test@'})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
  test('it should return 422 when providing an invalid password', async ({client, assert}) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const response = await client.put(`/users/${user.id}`).bearerToken(apiToken.token).json({password: 'tes',avatar: user.avatar,email: user.email})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
  test('it should return 422 when providing an invalid avatar', async ({client, assert}) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const password = 'test123';
    const response = await client.put(`/users/${user.id}`).bearerToken(apiToken.token).json({password,avatar: 'test',email: user.email})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
})
