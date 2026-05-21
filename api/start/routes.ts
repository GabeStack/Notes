import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'


router.get('/health/live', [controllers.HealthChecks, 'live'])
router.get('/health/ready', [controllers.HealthChecks, 'ready'])

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router.post('password-forgot', [controllers.Password, 'forgotPassword']).as('password.forgot')
    router.post('reset-password', [controllers.Password, 'resetPassword']).as('password.reset')

    router
      .group(() => {
        router.get('/', [controllers.Notes, 'index'])
        router.post('/', [controllers.Notes, 'store'])
        router.put('/:id', [controllers.Notes, 'update'])
        router.delete('/:id', [controllers.Notes, 'destroy'])
      })
      .use([middleware.auth(), middleware.refreshToken()])
      .prefix('notes')
      .as('notes')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('account')
      .use([middleware.auth(), middleware.refreshToken()])
  })
  .prefix('/api/v1')
