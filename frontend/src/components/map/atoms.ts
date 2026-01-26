import { atom } from 'jotai'

import type { CarbonMapperPlume } from '@/api/client'

import type Graphic from '@arcgis/core/Graphic'
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import type MediaLayer from '@arcgis/core/layers/MediaLayer'
import type MapView from '@arcgis/core/views/MapView'
import type SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'

export const selectedGraphicsAtom = atom<Array<Graphic>>([])
export const graphicsLayerAtom = atom<GraphicsLayer | null>(null)
export const carbonMapperLayerAtom = atom<GraphicsLayer | null>(null)
export const carbonMapperMediaLayerAtom = atom<MediaLayer | null>(null)
export const viewAtom = atom<MapView | null>(null)
export const viewReadyAtom = atom((get) => get(viewAtom) !== null)
export const sketchVMAtom = atom<SketchViewModel | null>(null)
export const draftGraphicAtom = atom<Graphic | null>(null)
export const createModeAtom = atom<boolean>(false)
export const updateModeAtom = atom<boolean>(false)
export const viewModeAtom = atom<'2d' | '3d'>('2d')
export const carbonMapperVisibleAtom = atom<boolean>(false)
export const carbonMapperLoadingAtom = atom<boolean>(false)
export const selectedCarbonMapperPlumeAtom = atom<CarbonMapperPlume | null>(
  null,
)
export const selectedCarbonMapperGraphicAtom = atom<Graphic | null>(null)
