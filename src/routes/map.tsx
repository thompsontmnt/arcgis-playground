import { createFileRoute } from '@tanstack/react-router'
import { Box } from '@radix-ui/themes'
import AddressSearch from '@/components/ui/controls/AddressSearch'
import MapView from '@/components/map/MapView'

export const Route = createFileRoute('/map')({
  component: () => (
    <Box p="3" height="100vh" width="100vw">
      <AddressSearch />
      <MapView />
    </Box>
  ),
})
