import { jotaiStore } from '@/jotai/jotaiStore'

import { graphicsLayerAtom, sketchVMAtom } from '../map/atoms'

export function drawPolygonTool() {
  let createHandle: IHandle | null = null

  return {
    id: 'draw-polygon',
    label: 'Draw Polygon',
    icon: 'pen-square',

    activate() {
      const sketch = jotaiStore.get(sketchVMAtom)
      const layer = jotaiStore.get(graphicsLayerAtom)

      if (!sketch || !layer) {
        console.warn('[drawPolygonTool] Missing sketchVM or graphicsLayer')
        return
      }

      createHandle?.remove()

      sketch.create('polygon')

      createHandle = sketch.on('create', (e) => {
        if (e.state === 'complete') {
        }
      })
    },

    deactivate() {
      createHandle?.remove()
      createHandle = null

      const sketch = jotaiStore.get(sketchVMAtom)
      sketch?.cancel()
    },
  }
}
