import MediaLayer from '@arcgis/core/layers/MediaLayer'
import { useEffect, useRef, useState } from 'react'

import type MapView from '@arcgis/core/views/MapView'
import type SceneView from '@arcgis/core/views/SceneView'

export interface UseMediaLayerOptions {
  view: MapView | SceneView | null
  id: string
  title: string
  source: Array<any>
  visible?: boolean
  opacity?: number
  blendMode?: any
}

export interface UseMediaLayerResult {
  layer: MediaLayer
  ready: boolean
}

export function useMediaLayer({
  view,
  id,
  title,
  source,
  visible = true,
  opacity = 1,
  blendMode,
}: UseMediaLayerOptions): UseMediaLayerResult {
  const layerRef = useRef(
    new MediaLayer({
      id,
      title,
      source: Array.isArray(source) ? source : [],
      opacity,
    }),
  )
  const layer = layerRef.current
  const [ready, setReady] = useState(false)

  // Mount/unmount lifecycle
  useEffect(() => {
    const map = view?.map
    if (!map) {
      setReady(false)
      return
    }

    if (!map.layers.includes(layer)) {
      map.add(layer)
    }

    if (blendMode) {
      ;(layer as any).blendMode = blendMode
    }

    layer.visible = visible
    setReady(true)

    return () => {
      if (map.layers.includes(layer)) {
        map.remove(layer)
      }
      setReady(false)
    }
  }, [view, layer, visible, blendMode])

  // Control opacity
  useEffect(() => {
    layer.opacity = opacity
  }, [layer, opacity])

  // Control visibility separately
  useEffect(() => {
    layer.visible = visible
  }, [layer, visible])

  return {
    layer,
    ready,
  }
}
