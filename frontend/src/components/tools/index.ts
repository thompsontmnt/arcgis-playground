import { drawPolygonTool } from './drawPolygonTool'
import { pointTool } from './pointTool'
import { selectTool } from './selectTool'

import type MapView from '@arcgis/core/views/MapView'

export type Tool = {
  id: string
  activate: (view: MapView) => void
  deactivate: () => void
}

export type ToolInitializer = (view: MapView) => Tool
export const defaultTools = {
  'draw-point': pointTool,
  'draw-polygon': drawPolygonTool,
  select: selectTool,
}
