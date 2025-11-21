import { drawPolygonTool } from './drawPolygonTool'
import { pointTool } from './pointTool'
import { selectTool } from './selectTool'

export type ToolInitializer = (view: __esri.MapView) => (() => void) | void

export const defaultTools = {
  'draw-point': pointTool,
  'draw-polygon': drawPolygonTool,
  select: selectTool,
}
