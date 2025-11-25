import type Graphic from '@arcgis/core/Graphic'
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import type SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'

export function updateSketchVMWithGraphic(
  sketchVM: SketchViewModel | null,
  graphic: Graphic,
) {
  if (!sketchVM) return
  const layer = sketchVM.layer as Partial<GraphicsLayer>
  if (!layer.graphics || !layer.add) return
  if (!layer.graphics.includes(graphic)) {
    layer.add(graphic)
  }
  sketchVM.update(graphic)
}
