import { Box } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

import MapView from '@/components/map/MapView'
import { MapProvider } from '@/context/MapContext'
import { ToolProvider } from '@/context/ToolManagerContext'

export const Route = createFileRoute('/map')({
  component: () => (
    <Box p="3" height="100vh" width="100vw">
      <MapProvider>
        <ToolProvider>
          <MapView />
        </ToolProvider>
      </MapProvider>
    </Box>
  ),
})
