import Extent from '@arcgis/core/geometry/Extent'
import ImageElement from '@arcgis/core/layers/support/ImageElement'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

import type MediaLayer from '@arcgis/core/layers/MediaLayer'

/**
 * Create a simple marker symbol for a plume point
 */
export function createPlumeMarkerSymbol(gas?: string) {
  const color = gas === 'CH4' ? [255, 140, 0] : [65, 105, 225]
  return new SimpleMarkerSymbol({
    color,
    size: 8,
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
  })
}

/**
 * Create an ImageElement for the plume PNG
 */
function createPlumeImageElement(
  pngUrl: string,
  bounds: [number, number, number, number],
) {
  const [minLon, minLat, maxLon, maxLat] = bounds

  const extent = new Extent({
    xmin: minLon,
    ymin: minLat,
    xmax: maxLon,
    ymax: maxLat,
    spatialReference: { wkid: 4326 },
  })

  return new ImageElement({
    image: pngUrl,
    georeference: {
      type: 'extent-and-rotation',
      extent,
      rotation: 0,
    },
  })
}

/**
 * Show plume PNG using MediaLayer
 */
export function showPlumePNG(
  mediaLayer: MediaLayer,
  pngUrl: string,
  bounds: [number, number, number, number],
) {
  const source = mediaLayer.source as any
  source.elements?.removeAll()
  source.elements?.add(createPlumeImageElement(pngUrl, bounds))
}

/**
 * Hide plume PNG by clearing the MediaLayer
 */
export function hidePlumePNG(mediaLayer: MediaLayer) {
  const source = mediaLayer.source as any
  source.elements?.removeAll()
}
