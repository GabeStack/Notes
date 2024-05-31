import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories/UserFactory'

test.group('Note', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it should create an notes', async ({client,assert}) =>{
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const notePayload = {      
    title: 'test',
    describe: 'sswswswswswswsscsw',
    favorite: false,
    color: 'red'
  }
    const response = await client.post('/notes').bearerToken(apiToken.token).json(notePayload)
    response.assertStatus(201)
    assert.equal(response.body().note.title, notePayload.title)
    assert.equal(response.body().note.describe, notePayload.describe)
    assert.equal(response.body().note.favorite, notePayload.favorite)
    assert.equal(response.body().note.color, notePayload.color)
  })
  test('should return 422 when required note data is not provided', async ({client, assert}) =>{
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const response = await client.post('/notes').bearerToken(apiToken.token).json({})
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
  test('should return 200 and all notes', async ({client, assert}) =>{
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const notePayload = {      
      title: 'test',
      describe: 'sswswswswswswsscsw',
      favorite: false,
      color: 'red'
    }
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const noteResponse1 = await client.post('/notes').bearerToken(apiToken.token).json(notePayload)
    noteResponse1.assertStatus(201)
    const noteResponse2 = await client.post('/notes').bearerToken(apiToken.token).json(notePayload)
    noteResponse2.assertStatus(201)
    const response = await client.get('/notes').bearerToken(apiToken.token)
    response.assertStatus(200)
    const notes = response.body()
    for (const note of notes) {
      assert.equal(note.title, notePayload.title)
      assert.equal(note.describe, notePayload.describe)
      assert.equal(note.favorite, notePayload.favorite)
      assert.equal(note.color, notePayload.color)
  }
  })
  test('it should update an note', async ({client, assert}) => {
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const noteResponse = await client.post('/notes').bearerToken(apiToken.token).json({title: 'test', describe: 'test',favorite: false, color: 'red'})
    noteResponse.assertStatus(201)
    const updateResponse = await client.put(`/notes/${noteResponse.body().note.id}`).bearerToken(apiToken.token).json({title: 'tes', describe: 'te2s',favorite: true, color: 'green'})
    updateResponse.assertStatus(200)
    assert.notEqual(noteResponse.body().note.title, updateResponse.body().note.title)
    assert.notEqual(noteResponse.body().note.describe, updateResponse.body().note.describe)
    assert.notEqual(noteResponse.body().note.favorite, updateResponse.body().note.favorite)
    assert.notEqual(noteResponse.body().note.color, updateResponse.body().note.color)
  })
  test('it should destroy an note', async ({client, assert})=>{
    const plainPassword = 'test'
    const user = await UserFactory.merge({password: plainPassword}).create()
    const signIn = await client.post('/sessions').json({email: user.email, password: plainPassword})
    signIn.assertStatus(201)
    const apiToken = signIn.body().token
    const noteResponse = await client.post('/notes').bearerToken(apiToken.token).json({title: 'test', describe: 'test',favorite: false, color: 'red'})
    noteResponse.assertStatus(201)
    const response = await client.delete(`/notes/${noteResponse.body().note.id}`).bearerToken(apiToken.token)
    response.assertStatus(200)
    assert.isEmpty(response.body())
  })
})
