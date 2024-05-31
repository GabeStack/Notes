import Route from '@ioc:Adonis/Core/Route'

Route.get('/notes', 'NotesController.index').middleware('auth')

Route.post('/users', 'UsersController.store')
Route.post('/sessions', 'SessionsController.store')
Route.post('/notes', 'NotesController.store').middleware('auth')

Route.post('forgot-password', "PasswordsController.forgotPassword")
Route.post('reset-password', 'PasswordsController.resetPassword')
Route.delete('/sessions', 'SessionsController.destroy')

Route.put('/users/:id', 'UsersController.update').middleware('auth')
Route.put('/notes/:id', 'NotesController.update').middleware('auth')
Route.delete('/notes/:id', 'NotesController.destroy').middleware('auth')