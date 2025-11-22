import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import { Box } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components'

import { graphicsLayerAtom, sketchVMAtom, viewAtom } from './atoms'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import Toolbar from './Toolbar'
import AddressSearch from '../ui/controls/AddressSearch'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'

export default function MapView() {
  const setViewAtom = useSetAtom(viewAtom)

  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)
  const setSketchVM = useSetAtom(sketchVMAtom)

  const handleReady = useCallback((e: ArcgisMapCustomEvent<void>) => {
    const map = e.target
    const view = map.view

    setViewAtom(view)

    const layer = new GraphicsLayer({ id: 'global-graphics' })
    view.map?.add(layer)
    setGraphicsLayer(layer)

    const sketch = new SketchViewModel({
      view,
      layer,
      defaultUpdateOptions: { tool: 'reshape', toggleToolOnClick: false },
    })
    setSketchVM(sketch)
  }, [])

  return (
    <arcgis-map
      basemap="satellite"
      zoom={4}
      center={[-98.5795, 39.8283]}
      onarcgisViewReadyChange={handleReady}
    >
      <arcgis-placement slot="top-left">
        <AddressSearch />
      </arcgis-placement>
      <arcgis-placement slot="top-right">
        <GraphicInfoPanel />
      </arcgis-placement>

      <Box
        position="absolute"
        bottom="5"
        left="50%"
        style={{ transform: 'translateX(-50%)' }}
      >
        <Toolbar />
      </Box>
    </arcgis-map>
  )
}
