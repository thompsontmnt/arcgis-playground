import '@arcgis/map-components/components/arcgis-scene'
import '@arcgis/map-components/components/arcgis-placement'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'

import type { ArcgisSceneCustomEvent } from '@arcgis/map-components'
import type { PropsWithChildren } from 'react'

export default function Scene3D({ children }: PropsWithChildren) {
  const setView = useSetAtom(viewAtom)

  const handleReady = useCallback(
    (e: ArcgisSceneCustomEvent<void>) => {
      const sceneEl = e.target as any
      const newView = sceneEl.view

      newView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
      newView.constraints = { minZoom: MINIMUM_MAP_ZOOM }

      setView(newView)
    },
    [setView],
  )

  return (
    <arcgis-scene
      basemap="satellite"
      onarcgisViewReadyChange={handleReady}
      quality-profile="high"
    >
      {children}
    </arcgis-scene>
  )
}
