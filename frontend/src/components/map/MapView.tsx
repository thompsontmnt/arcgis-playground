import { Box, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

import { listGeometriesGeometryGetOptions } from '@/api/client/@tanstack/react-query.gen'
import { useCarbonMapperData } from '@/hooks/useCarbonMapperData'
import { useDeleteSelectedGeometry } from '@/hooks/useDeleteGeometry'
import { useGraphicsLayer } from '@/hooks/useGraphicsLayer'
import { useMediaLayer } from '@/hooks/useMediaLayer'

import {
  carbonMapperLayerAtom,
  carbonMapperMediaLayerAtom,
  createModeAtom,
  draftGraphicAtom,
  graphicsLayerAtom,
  selectedCarbonMapperPlumeAtom,
  selectedGraphicsAtom,
  updateModeAtom,
  viewAtom,
  viewModeAtom,
} from './atoms'
import { CarbonMapperInfoPanel } from './CarbonMapperInfoPanel'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import { GraphicsListPanel } from './GraphicListPanel'
import { HintOverlay } from './HintOverlay'
import MapViewContainer from './MapViewContainer'
import Toolbar from './Toolbar'
import { simpleFillSymbol } from './utils/symbols'
import AddressSearch from '../ui/AddressSearch'
import { createGraphicFromWkt } from './utils/createGraphicFromWkt'

export default function MapView() {
  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)
  const setCarbonMapperLayer = useSetAtom(carbonMapperLayerAtom)
  const setCarbonMapperMediaLayer = useSetAtom(carbonMapperMediaLayerAtom)
  const [view] = useAtom(viewAtom)
  const [mode] = useAtom(viewModeAtom)
  const deleteModal = useDeleteSelectedGeometry()
  const { data: geometries } = useQuery(listGeometriesGeometryGetOptions())
  const loadCarbonMapperData = useCarbonMapperData()

  // Atoms to determine which panel to show
  const isCreating = useAtomValue(createModeAtom)
  const isUpdating = useAtomValue(updateModeAtom)
  const draftGraphic = useAtomValue(draftGraphicAtom)
  const selectedGraphics = useAtomValue(selectedGraphicsAtom)
  const selectedCarbonMapperPlume = useAtomValue(selectedCarbonMapperPlumeAtom)

  // Show GraphicInfoPanel if there's any graphic interaction, otherwise CarbonMapperInfoPanel
  const showGraphicInfoPanel =
    isCreating || isUpdating || draftGraphic || selectedGraphics.length > 0
  const showCarbonMapperInfoPanel =
    !showGraphicInfoPanel && selectedCarbonMapperPlume

  // Graphics conversion
  const graphics = useMemo(() => {
    if (!Array.isArray(geometries)) return []
    return geometries.map((g) =>
      createGraphicFromWkt({
        id: g.id.toString(),
        geometry: g.wkt,
        attributes: { ...g },
        symbol: simpleFillSymbol,
      }),
    )
  }, [geometries])

  const { layer } = useGraphicsLayer({
    view,
    id: 'global-graphics',
    title: 'Global Graphics',
    graphics,
    elevationInfo: mode === '3d' ? { mode: 'on-the-ground' } : undefined,
  })

  // Load Carbon Mapper plumes once and render layer
  const [carbonMapperGraphics, setCarbonMapperGraphics] = useState<Array<any>>(
    [],
  )
  useEffect(() => {
    let mounted = true
    loadCarbonMapperData()
      .then((g) => {
        if (mounted) setCarbonMapperGraphics(g)
      })
      .catch((err) => console.error('Failed to load Carbon Mapper data:', err))
    return () => {
      mounted = false
    }
  }, [loadCarbonMapperData])

  const { layer: carbonMapperLayer } = useGraphicsLayer({
    view,
    id: 'carbon-mapper-plumes',
    title: 'Carbon Mapper Plumes',
    graphics: carbonMapperGraphics,
    visible: true,
  })

  const { layer: carbonMapperMediaLayer } = useMediaLayer({
    view,
    id: 'carbon-mapper-media',
    title: 'Carbon Mapper PNG Overlays',
    source: [],
    opacity: 0.8,
  })

  // Provide layers via Jotai (single effect)
  useEffect(() => {
    setGraphicsLayer(layer)
    setCarbonMapperLayer(carbonMapperLayer)
    setCarbonMapperMediaLayer(carbonMapperMediaLayer)
  }, [
    layer,
    carbonMapperLayer,
    carbonMapperMediaLayer,
    setGraphicsLayer,
    setCarbonMapperLayer,
    setCarbonMapperMediaLayer,
  ])

  return (
    <>
      <MapViewContainer>
        <arcgis-placement slot="top-left">
          <Flex direction="column" gap="2">
            <AddressSearch />
            <GraphicsListPanel graphics={graphics} />
          </Flex>
        </arcgis-placement>

        <arcgis-placement slot="top-right">
          {showGraphicInfoPanel && <GraphicInfoPanel />}
          {showCarbonMapperInfoPanel && <CarbonMapperInfoPanel />}
        </arcgis-placement>

        <Box
          position="absolute"
          bottom="5"
          className="left-1/2 -translate-x-1/2"
        >
          <Toolbar />
        </Box>
      </MapViewContainer>

      <HintOverlay />
      {deleteModal}
    </>
  )
}
