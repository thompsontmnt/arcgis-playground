import { Box } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components'

import { listGeometriesGeometryGetOptions } from '@/api/client/@tanstack/react-query.gen'
import { useDeleteSelectedGeometry } from '@/hooks/useDeleteGeometry'
import { useGraphicsLayer } from '@/hooks/useGraphicsLayer'

import { graphicsLayerAtom, viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import Toolbar from './Toolbar'
import { convertFeatureToGraphic } from './utils/convertFeatureToGraphic'
import { simpleFillSymbol } from './utils/symbols'
import AddressSearch from '../ui/controls/AddressSearch'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'

export default function MapView() {
  const [view, setView] = useAtom(viewAtom)
  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)

  const { data: geometries } = useQuery(listGeometriesGeometryGetOptions())
  const deleteModal = useDeleteSelectedGeometry()

  const graphics = useMemo(() => {
    if (!Array.isArray(geometries)) return []
    return geometries.map((geometry) =>
      convertFeatureToGraphic({
        id: geometry.id.toString(),
        geometry: geometry.wkt,
        attributes: { ...geometry },
        symbol: simpleFillSymbol,
      }),
    )
  }, [geometries])

  const { layer } = useGraphicsLayer({
    view,
    id: 'global-graphics',
    title: 'Global Graphics',
    graphics,
  })

  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      if (view) return

      const map = e.target
      const nextView = map.view

      nextView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })

      setView(nextView)
      setGraphicsLayer(layer)
      map.view.constraints = {
        minZoom: MINIMUM_MAP_ZOOM,
      }
    },
    [layer, setView],
  )

  return (
    <>
      <arcgis-map basemap="satellite" onarcgisViewReadyChange={handleReady}>
        <arcgis-placement slot="top-left">
          <AddressSearch />
        </arcgis-placement>

        <arcgis-placement slot="top-right">
          <GraphicInfoPanel />
        </arcgis-placement>

        <Box
          position="absolute"
          bottom="5"
          className="left-1/2 -translate-x-1/2"
        >
          <Toolbar />
        </Box>
      </arcgis-map>
      {deleteModal}
    </>
  )
}
