import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Sidebar } from '../components/sidebar'
import { TopBar } from '../components/topbar'
import { Boundary } from '../components/boundary'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'stream.place' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/streamplace-logo.svg' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const isChannel = path.startsWith('/channel/')
  const chromeMobileClass = isChannel ? 'hidden lg:flex' : 'flex'

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100">
      <Boundary id="sidebar" title="Sidebar crashed" compact>
        <Sidebar className={chromeMobileClass} />
      </Boundary>
      <div className="flex min-w-0 flex-1 flex-col">
        <Boundary id="topbar" title="Nav crashed" compact>
          <TopBar className={chromeMobileClass} />
        </Boundary>
        <main className="min-h-0 flex-1 overflow-hidden">
          <Boundary id="main">
            <Outlet />
          </Boundary>
        </main>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-900 text-zinc-100 antialiased">
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-left' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
