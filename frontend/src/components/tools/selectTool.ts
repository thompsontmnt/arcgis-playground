import { jotaiStore } from '@/jotai/jotaiStore'

import {
  graphicsLayerAtom,
  selectedGraphicsAtom,
  sketchVMAtom,
} from '../map/atoms'

import type MapView from '@arcgis/core/views/MapView'

export function selectTool() {
  let clickHandle: IHandle | null = null

  return {
    id: 'select',
    label: 'Select',
    icon: 'cursor',

    activate(view: MapView) {
      clickHandle?.remove()

      const sketch = jotaiStore.get(sketchVMAtom)
      if (sketch) {
        sketch.cancel()
      }

      clickHandle = view.on('click', async (event) => {
        const layer = jotaiStore.get(graphicsLayerAtom)

        if (!layer) {
          console.warn('[selectTool] No graphicsLayer found')
          return
        }

        const hit = await view.hitTest(event)

        const match = hit.results.find(
          (r): r is __esri.MapViewGraphicHit =>
            'graphic' in r && r.graphic.layer?.id === layer.id,
        )

        if (match?.graphic) {
          jotaiStore.set(selectedGraphicsAtom, [match.graphic])
        } else {
          jotaiStore.set(selectedGraphicsAtom, [])
        }
      })
    },

    deactivate() {
      clickHandle?.remove()
      clickHandle = null
    },
  }
}
