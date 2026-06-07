import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SettingsNav } from '../components/settings-nav'

export const Route = createFileRoute('/settings')({ component: SettingsLayout })

function SettingsLayout() {
  return (
    <div className="h-full overflow-y-auto"><div className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <div className="mt-4">
        <SettingsNav />
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div></div>
  )
}
