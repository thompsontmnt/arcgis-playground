import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'

export const drawPolygonTool = (view: __esri.MapView) => {
  console.log('DRAW POLYGON TOOL ACTIVE')

  const graphicsLayer = new GraphicsLayer()
  const sketch = new SketchViewModel({
    view,
    layer: graphicsLayer,
    defaultUpdateOptions: {
      tool: 'reshape',
      toggleToolOnClick: false,
    },
    polygonSymbol: {
      type: 'simple-fill',
      color: [255, 255, 255, 0.2],
      outline: {
        color: '#ff6600',
        width: 2,
      },
    },
  })

  sketch.create('polygon')

  // Just log completed polygons
  const completeHandle = sketch.on('create', (e) => {
    if (e.state === 'complete') {
      console.log('Polygon created:', e.graphic)
    }
  })

  return () => {
    console.log('DRAW POLYGON TOOL CLEANUP')

    completeHandle.remove()
    sketch.destroy()
  }
}
