import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/navbar/Header'
import type { fetchData } from '@/utils/fetchData'
import { Loading } from '@/components/loading'

export const Route = createRootRouteWithContext<{
  fetchData: typeof fetchData
}>()({
  head: () => ({
    meta: [
      { name: 'description', content: 'Create your Stella Sora Team Build' },
      { title: 'Stella Sora Team Builder' },
    ],
  }),
  staleTime: Infinity,
  loader: ({ context }) => context.fetchData(),
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
