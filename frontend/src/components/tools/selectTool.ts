import { jotaiStore } from '@/jotai/jotaiStore'
import {
  activeToolAtom,
  hasSelectionAtom,
  triggerHintAtom,
} from '@/state/hintAtoms'

import {
  carbonMapperLayerAtom,
  carbonMapperMediaLayerAtom,
  graphicsLayerAtom,
  selectedCarbonMapperGraphicAtom,
  selectedCarbonMapperPlumeAtom,
  selectedGraphicsAtom,
  sketchVMAtom,
  updateModeAtom,
} from '../map/atoms'
import { hidePlumePNG, showPlumePNG } from '../map/utils/plumeSymbols'

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
            'graphic' in r &&
            r.graphic.layer?.id === layer.id &&
            !r.graphic.attributes?.readOnly,
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

        const carbonMapperLayer = jotaiStore.get(carbonMapperLayerAtom)
        const carbonMapperMatch = hit.results.find(
          (r): r is __esri.MapViewGraphicHit =>
            'graphic' in r && r.graphic.layer?.id === carbonMapperLayer?.id,
        )

        if (carbonMapperMatch?.graphic) {
          const { graphic } = carbonMapperMatch
          const { attributes } = graphic
          const mediaLayer = jotaiStore.get(carbonMapperMediaLayerAtom)

          if (mediaLayer && attributes?.plume_png && attributes?.plume_bounds) {
            showPlumePNG(
              mediaLayer,
              attributes.plume_png,
              attributes.plume_bounds,
            )
            view.goTo({ target: graphic.geometry, zoom: 14 })
          }

          jotaiStore.set(selectedCarbonMapperGraphicAtom, graphic)
          jotaiStore.set(selectedCarbonMapperPlumeAtom, attributes)
          jotaiStore.set(selectedGraphicsAtom, [])
          jotaiStore.set(updateModeAtom, false)
          jotaiStore.set(hasSelectionAtom, false)
          return
        }

        const match = hit.results.find(
          (r): r is __esri.MapViewGraphicHit =>
            'graphic' in r &&
            r.graphic.layer?.id === layer.id &&
            !r.graphic.attributes?.readOnly,
        )

        if (match?.graphic) {
          // Hide previous plume PNG if any
          const mediaLayer = jotaiStore.get(carbonMapperMediaLayerAtom)
          if (mediaLayer) {
            hidePlumePNG(mediaLayer)
          }

          jotaiStore.set(selectedCarbonMapperGraphicAtom, null)
          jotaiStore.set(selectedCarbonMapperPlumeAtom, null)
          jotaiStore.set(selectedGraphicsAtom, [match.graphic])
          jotaiStore.set(updateModeAtom, true)
          jotaiStore.set(activeToolAtom, 'select')
          jotaiStore.set(hasSelectionAtom, true)
          jotaiStore.set(
            triggerHintAtom,
            'Press Delete to remove selected shape.',
          )
        } else {
          // Hide previous plume PNG if any
          const mediaLayer = jotaiStore.get(carbonMapperMediaLayerAtom)
          if (mediaLayer) {
            hidePlumePNG(mediaLayer)
          }

          jotaiStore.set(selectedCarbonMapperGraphicAtom, null)
          jotaiStore.set(selectedCarbonMapperPlumeAtom, null)
          jotaiStore.set(selectedGraphicsAtom, [])
          jotaiStore.set(updateModeAtom, false)
          jotaiStore.set(hasSelectionAtom, false)
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
