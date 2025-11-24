import { jotaiStore } from '@/jotai/jotaiStore'

import {
  graphicsLayerAtom,
  selectedGraphicsAtom,
  sketchVMAtom,
  updateModeAtom,
} from '../map/atoms'

import type MapView from '@arcgis/core/views/MapView'

export function selectTool() {
  let clickHandle: IHandle | null = null
  let pointerMoveHandle: IHandle | null = null
  let highlightHandle: __esri.Handle | null = null
  let layerViewPromise: Promise<__esri.GraphicsLayerView> | null = null

  return {
    id: 'select',
    label: 'Select',
    icon: 'cursor',

    activate(view: MapView) {
      clickHandle?.remove()
      pointerMoveHandle?.remove()
      highlightHandle?.remove()

      const sketch = jotaiStore.get(sketchVMAtom)
      sketch?.cancel()

      const layer = jotaiStore.get(graphicsLayerAtom)
      if (!layer) return

      // Preload LayerView (necessary for highlight API)
      layerViewPromise = view.whenLayerView(layer)

      // Hover highlight
      pointerMoveHandle = view.on('pointer-move', async (event) => {
        const hit = await view.hitTest(event)

        const match = hit.results.find(
          (r): r is __esri.MapViewGraphicHit =>
            'graphic' in r && r.graphic.layer?.id === layer.id,
        )

        // Clear previous highlight
        highlightHandle?.remove()
        highlightHandle = null

        if (match?.graphic) {
          const layerView = await layerViewPromise
          if (layerView) {
            highlightHandle = layerView.highlight(match.graphic)
          }
        }
      })

      // Click selection
      clickHandle = view.on('click', async (event) => {
        const hit = await view.hitTest(event)

        const match = hit.results.find(
          (r): r is __esri.MapViewGraphicHit =>
            'graphic' in r && r.graphic.layer?.id === layer.id,
        )

        if (match?.graphic) {
          jotaiStore.set(selectedGraphicsAtom, [match.graphic])
          jotaiStore.set(updateModeAtom, true)
        } else {
          jotaiStore.set(selectedGraphicsAtom, [])
          jotaiStore.set(updateModeAtom, false)
        }
      })
    },

    deactivate() {
      clickHandle?.remove()
      pointerMoveHandle?.remove()
      highlightHandle?.remove()

      clickHandle = null
      pointerMoveHandle = null
      highlightHandle = null
    },
  }
}
