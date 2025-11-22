import Graphic from '@arcgis/core/Graphic'

import {
  graphicsLayerAtom,
  viewAtom,
  viewReadyAtom,
} from '@/components/map/atoms'
import { jotaiStore } from '@/jotai/jotaiStore'

import type Point from '@arcgis/core/geometry/Point'
import type MapView from '@arcgis/core/views/MapView'

async function waitForViewReady(view: MapView) {
  if (!view.updating) return

  await new Promise<void>((resolve) => {
    const handle = view.watch('updating', (updating) => {
      if (!updating) {
        handle.remove()
        resolve()
      }
    })
  })
}

export async function goToPoint(point: Point) {
  const view = jotaiStore.get(viewAtom)
  const ready = jotaiStore.get(viewReadyAtom)

  if (!ready || !view) {
    console.warn('[goToPoint] View is not ready yet')
    return
  }

  const layer = jotaiStore.get(graphicsLayerAtom)
  if (!layer) {
    console.warn('[goToPoint] No graphics layer available')
    return
  }

  try {
    await view.when()
    await waitForViewReady(view)

    layer.removeAll()

    const marker = new Graphic({
      geometry: point,
      symbol: {
        type: 'simple-marker',
        color: 'white',
        size: 12,
        outline: { color: '#333', width: 2 },
      },
      attributes: {
        markerType: 'go-to',
        lon: point.longitude,
        lat: point.latitude,
      },
    })

    layer.add(marker)

    await view.goTo(
      {
        center: point,
        zoom: 18,
      },
      { duration: 600 },
    )
  } catch (err) {
    console.error('[goToPoint] error:', err)
  }
}
