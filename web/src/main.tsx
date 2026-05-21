import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { queryClient } from "./api/queryClient";
import { Login } from "./pages/Login.tsx";
import { Signup } from "./pages/Signup.tsx";
import { RootRoute } from "./pages/RootRoutes.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { ProtectedRoute } from "@/components/auth/protectedRoute"; // 👈 ajuste o caminho
import { ForgotPassword } from "./pages/ForgotPassword.tsx";
import { ResetPassword } from "./pages/ResetPassword.tsx";

// 👇 Crie um componente para rotas protegidas (opcional, mas organizado)
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  // 👇 Rotas PÚBLICAS (não precisam de auth)
  { path: "/", Component: RootRoute },           // Home pública
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },

  // 👇 Rotas PROTEGIDAS (precisam de auth)
  {
    path: "/app", // ou "/dashboard", "/painel", etc.
    Component: () => (
      <ProtectedLayout>
        <RootRoute />
      </ProtectedLayout>
    ),
  },

  // 👇 Exemplo: outras rotas protegidas
  {
    path: "/profile",
    Component: () => (
      <ProtectedLayout>
        {/* <Profile /> */}
        <div>Perfil (protegido)</div>
      </ProtectedLayout>
    ),
  },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  
  // Rota coringa
  { path: "*", Component: () => <RootRoute /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);