import { useCallback } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components'
import { Box } from '@radix-ui/themes'

import { useMap } from '@/context/MapContext'

import Toolbar from './Toolbar'
import AddressSearch from '../ui/controls/AddressSearch'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'

export default function MapView() {
  const { viewRef, setView } = useMap()

  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      const map = e.target
      const view = map.view

      viewRef.current = view
      setView(view)
    },
    [viewRef, setView],
  )

  return (
    <arcgis-map
      basemap="satellite"
      zoom={4}
      center={[-98.5795, 39.8283]}
      onarcgisViewReadyChange={handleReady}
    >
      <arcgis-placement slot="top-left">
        <AddressSearch />
      </arcgis-placement>

      <Box
        position="absolute"
        bottom="15%"
        left="35%"
        style={{ transform: 'translateX(-50%)' }}
      >
        <Toolbar />
      </Box>
    </arcgis-map>
  )
}
