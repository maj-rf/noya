import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/navbar/Header'
import { fetchData } from '@/lib/utils'
import { Loading } from '@/components/loading'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: 'description', content: 'Create your Stella Sora Team Build' },
      { title: 'Stella Sora Team Builder' },
    ],
  }),
  loader: fetchData,
  pendingComponent: () => (
    <div className="h-screen">
      <Loading />
    </div>
  ),
  component: () => (
    <>
      <HeadContent />
      <div className="flex flex-col h-svh">
        <Header />
        <main className="flex-1">
          <Outlet />
          <Toaster richColors />
        </main>
      </div>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
