import { Outlet, createRootRoute } from '@tanstack/react-router'
import '@/utils/supressEsriWarnings'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})
