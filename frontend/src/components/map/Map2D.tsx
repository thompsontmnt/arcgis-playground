import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

import { viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'
import type { PropsWithChildren } from 'react'

export default function Map2D({ children }: PropsWithChildren) {
  const [, setView] = useAtom(viewAtom)

  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      const mapEl = e.target
      const newView = mapEl.view

      newView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
      newView.constraints = { minZoom: MINIMUM_MAP_ZOOM }

      setView(newView)
    },
    [setView],
  )

  return (
    <arcgis-map basemap="satellite" onarcgisViewReadyChange={handleReady}>
      {children}
    </arcgis-map>
  )
}
