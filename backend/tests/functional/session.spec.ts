import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories/UserFactory'

test.group('Sessions', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it should authenticate an user', async ({client, assert}) => {
    const plainPassword = 'test'
    const {id, email} = await UserFactory.merge({password: plainPassword}).create()
    const response = await client.post('/sessions').json({email, password: plainPassword})

    assert.isDefined(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, id)
  })
  test('it should return an api token when session is created', async ({client, assert}) => {
    const plainPassword = 'test'
    const {id, email} = await UserFactory.merge({password: plainPassword}).create()
    const response = await client.post('/sessions').json({email, password: plainPassword})
    assert.isDefined(response.body().token, 'User undefined')
    assert.equal(response.body().user.id, id)
  })
  test('it should return 400 when credentials are not provided', async ({client, assert}) => {
    const response = await client.post('/sessions').json({})
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 400)
  })
  test('it should return 400 when credentials are invalid', async ({client, assert}) => {
    const {email} = await UserFactory.create()
    const response = await client.post('/sessions').json({
      email,
      password: 'test'
    })
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 400)
  })
  test('it should return 200 when user signs out', async ({client}) => {
    const plainPassword = 'test'
    const { email } = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email, password: plainPassword})
    const token = signIn.body().token
    const response = await client.delete('/sessions').bearerToken(token)
    response.assertStatus(200)
  })
  test('it should revoke token when user signs out', async ({client, assert}) => {
    const plainPassword = 'test'
    const { email } = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const response = await client.delete('/sessions').bearerToken(apiToken.token)
    response.assertStatus(200)
    const token = await Database.query().select('*').from('api_tokens')
    console.log(token)
    assert.isEmpty(token)
  })
})
