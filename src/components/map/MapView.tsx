import { useCallback } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components'
import type { ArcgisMapCustomEvent } from '@arcgis/map-components'
import { useMap } from '@/context/MapContext'

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
      zoom={3}
      center={[-98.5795, 39.8283]}
      onarcgisViewReadyChange={handleReady}
    />
  )
}
