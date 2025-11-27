import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import { ThemeProvider } from '@/lib/theme-provider'

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
      <ThemeProvider>
        <div className="flex flex-col h-svh">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
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
