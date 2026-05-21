// src/components/header/index.tsx
import { Input } from '@/components/ui/input'
import { Search, LogOut } from 'lucide-react'
import { useSearch } from './search-context'
import { useLogout } from '@/features/auth/hooks'

// shadcn/ui components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const Header = () => {
  const { search, setSearch } = useSearch()
  const { mutate: logout, isPending } = useLogout()

  return (
    <header className="px-9 flex items-center bg-white gap-8 py-4 justify-between">
      <div className="flex items-center gap-4">
        <img src="./logo.svg" alt="Logo Corenotes" className="w-9" />
        <p className="text-muted-foreground">Notes</p>
      </div>

      <div className="relative w-full max-w-3xl">
        <Input
          type="search"
          placeholder="Buscar notas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-0 top-0 h-full w-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar saída</AlertDialogTitle>
            <AlertDialogDescription>
              Você realmente deseja sair da sua conta? Todas as sessões ativas serão encerradas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => logout()}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isPending ? 'Saindo...' : 'Sim, sair'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}

export default Header