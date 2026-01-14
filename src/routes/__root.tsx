import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/navbar/Header'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: 'description', content: 'Create your Stella Sora Team Build' },
      { title: 'Stella Sora Team Builder' },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <div className="flex flex-col h-svh">
        <Header />
        <main className="flex-1">
          <Outlet />
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
