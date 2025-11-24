import Graphic from '@arcgis/core/Graphic'

import { wktToArcGIS } from './wkt-utils'

import type { Geometry } from '@arcgis/core/geometry'

type WktString = string

export interface Feature {
  id?: string
  geometry: WktString | Geometry
  attributes?: Record<string | number | symbol, unknown>
  symbol?: Graphic['symbol']
}

export function convertFeatureToGraphic({
  id,
  geometry,
  attributes,
  symbol,
}: Feature): Graphic {
  return new Graphic({
    attributes: {
      externalId: id,
      ...attributes,
    },
    geometry: typeof geometry === 'string' ? wktToArcGIS(geometry) : geometry,
    symbol,
  })
}
