import { Box } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

import MapView from '@/components/map/MapView'
import { ToolManagerProvider } from '@/context/ToolManagerContext'

export const Route = createFileRoute('/map')({
  component: () => (
    <Box p="3" height="100vh" width="100vw">
      <ToolManagerProvider>
        <MapView />
      </ToolManagerProvider>
    </Box>
  ),
})
