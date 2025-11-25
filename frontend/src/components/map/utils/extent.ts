import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'

import type Graphic from '@arcgis/core/Graphic'

export function computeGraphicsExtent(graphics: Array<Graphic>) {
  if (!graphics.length) return null

  const geoms = graphics.map((g) => g.geometry).filter((geom) => geom != null)
  if (!geoms.length) return null

  const unioned = geometryEngine.union(geoms)
  return unioned.extent ?? null
}
