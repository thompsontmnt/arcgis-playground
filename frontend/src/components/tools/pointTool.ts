import Graphic from '@arcgis/core/Graphic'

import type MapView from '@arcgis/core/views/MapView'

export const pointTool = (view: MapView) => {
  const handler = view.on('click', (e) => {
    const g = new Graphic({
      geometry: e.mapPoint,
      symbol: {
        type: 'simple-marker',
        color: 'red',
        size: 10,
      },
    })
    view.graphics.add(g)
  })

  return () => {
    handler.remove()
  }
}
