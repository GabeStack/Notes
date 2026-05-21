export interface User {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Adicione campos conforme seu model User do Adonis
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  fullName: string;        // ✅ Mudar de 'name' para 'fullName'
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  data: any;
  token: string;
  user: User;
}

export interface AuthError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}