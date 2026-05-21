/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  healthChecks: {
    live: typeof routes['health_checks.live']
    ready: typeof routes['health_checks.ready']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  password: {
    forgot: typeof routes['password.forgot']
    reset: typeof routes['password.reset']
  }
  notes: {
    notes: {
      index: typeof routes['notes.notes.index']
      store: typeof routes['notes.notes.store']
      update: typeof routes['notes.notes.update']
      destroy: typeof routes['notes.notes.destroy']
    }
  }
  account: {
    profile: {
      show: typeof routes['account.profile.show']
    }
  }
}
