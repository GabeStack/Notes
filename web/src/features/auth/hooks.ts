import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './service';
import { authKeys } from './keys';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router';

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const authData = response.data.data; 
      
      if (authData?.token && authData?.user) {
        login(authData.token, authData.user);
      }
      
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error: any) => {
      console.error('❌ Login ERROR:', error.response?.data);
    },
  });
}

export function useSignup() {
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (response) => {
      const authData = response.data.data || response.data;
      
      if (authData?.token && authData?.user) {
        login(authData.token, authData.user);
      }
    },
    onError: (error: any) => {
      console.error('❌ Signup ERROR:', error.response?.data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      navigate('/', { replace: true });
      
      setTimeout(() => {
        queryClient.removeQueries();
        queryClient.invalidateQueries();
      }, 0);
    },
    onError: (error: any) => {
      console.error('❌ Logout error:', error);
      logout();
      navigate('/', { replace: true });
      setTimeout(() => {
        queryClient.removeQueries();
        queryClient.invalidateQueries();
      }, 0);
    },
  });
}

export function useProfile() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile().then(res => res.data),
    enabled: !!token,
    retry: false,
  });
}

// 👇 NOVOS HOOKS ADICIONADOS

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      console.log('✅ Link de recuperação enviado!');
    },
    onError: (error: any) => {
      console.error('❌ Forgot password ERROR:', error.response?.data);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      console.log('✅ Senha redefinida com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Reset password ERROR:', error.response?.data);
    },
  });
}