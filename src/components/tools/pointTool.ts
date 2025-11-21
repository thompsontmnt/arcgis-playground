import Graphic from '@arcgis/core/Graphic'

export const pointTool = (view: __esri.MapView) => {
  console.log('POINT TOOL ACTIVE')

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
    console.log('POINT TOOL CLEANUP')
    handler.remove()
  }
}
