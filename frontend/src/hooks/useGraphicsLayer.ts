import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { useEffect, useRef, useState } from 'react'

import type Graphic from '@arcgis/core/Graphic'
import type MapView from '@arcgis/core/views/MapView'
import type SceneView from '@arcgis/core/views/SceneView'

export interface UseGraphicsLayerOptions {
  view: MapView | SceneView | null
  id: string
  title: string
  graphics: Array<Graphic>
  visible?: boolean
  elevationInfo?: any
}

export interface UseGraphicsLayerResult {
  layer: GraphicsLayer
  ready: boolean
}

export function useGraphicsLayer({
  view,
  id,
  title,
  graphics,
  visible = true,
  elevationInfo,
}: UseGraphicsLayerOptions): UseGraphicsLayerResult {
  const layerRef = useRef(new GraphicsLayer({ id, title }))
  const layer = layerRef.current
  const [ready, setReady] = useState(false)

  // Mount/unmount lifecycle
  useEffect(() => {
    const map = view?.map
    if (!map) {
      setReady(false)
      return
    }

    // Only add if not already on map
    if (!map.layers.includes(layer)) {
      map.add(layer)
    }

    // Apply elevation info for 3D views
    if (elevationInfo) {
      layer.elevationInfo = elevationInfo
    }

    setReady(true)

    return () => {
      if (map.layers.includes(layer)) {
        map.remove(layer)
      }
      setReady(false)
    }
  }, [view, layer, elevationInfo])

  // Populate graphics
  useEffect(() => {
    layer.removeAll()
    if (graphics.length) layer.addMany(graphics)
  }, [graphics, layer])

  // Control visibility
  useEffect(() => {
    layer.visible = visible
  }, [layer, visible])

  return {
    layer,
    ready,
  }
}
