// src/features/auth/service.ts
import { api } from '@/api/axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  User 
} from './types';

export const authService = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),

  signup: (credentials: SignupCredentials) => 
    api.post<AuthResponse>('/auth/signup', credentials),

  logout: () => 
    api.post<void>('/auth/logout', {}),
  
  getProfile: () => 
    api.get<User>('/account/profile'),

  // 👇 Novos métodos para recovery
  forgotPassword: ({ email }: { email: string }) => 
    api.post<void>('/password-forgot', { email }),

  resetPassword: ({ token, password }: { token: string; password: string }) => 
    api.post<void>('/reset-password', { token, password }),
};