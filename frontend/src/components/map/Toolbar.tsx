import { Flex, IconButton, Separator } from '@radix-ui/themes'
import { useAtom, useSetAtom } from 'jotai'
import {
  CrosshairIcon,
  EarthIcon,
  MousePointerIcon,
  PencilLineIcon,
} from 'lucide-react'

import { useToolManager } from '@/context/ToolManagerContext'
import { triggerHintAtom } from '@/state/hintAtoms'

import { viewAtom, viewModeAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from './constants'
import { Panel } from '../ui/Panel'

export default function Toolbar() {
  const { activeTool, setActiveTool } = useToolManager()
  const [view] = useAtom(viewAtom)
  const [mode, setMode] = useAtom(viewModeAtom)
  const triggerHint = useSetAtom(triggerHintAtom)

  return (
    <Panel className="w-[fit-content] p-2">
      <Flex gap="4" justify="center" px="2" align="center">
        <IconButton
          size="1"
          variant={activeTool === 'select' ? 'solid' : 'ghost'}
          onClick={() => setActiveTool('select')}
          aria-label="Select tool"
          title="Select tool"
          highContrast
        >
          <MousePointerIcon className="w-4 h-4" />
        </IconButton>
        <IconButton
          size="1"
          variant={activeTool === 'draw-polygon' ? 'solid' : 'ghost'}
          onClick={() => setActiveTool('draw-polygon')}
          aria-label="Draw polygon tool"
          title="Draw polygon"
          highContrast
        >
          <PencilLineIcon className="w-4 h-4" />
        </IconButton>
        <IconButton
          size="1"
          variant={mode === '3d' ? 'solid' : 'ghost'}
          onClick={() => setMode(mode === '2d' ? '3d' : '2d')}
          aria-label="Toggle 3D mode"
          title={mode === '2d' ? 'Switch to 3D' : 'Switch to 2D'}
          highContrast
        >
          <EarthIcon className="w-4 h-4" />
        </IconButton>

        <Separator orientation="vertical" />

        <IconButton
          size="1"
          variant="ghost"
          onClick={() => {
            if (view) {
              view.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
              triggerHint('Map reset to default view.')
            }
          }}
          aria-label="Re-center map"
          title="Re-center map"
          highContrast
        >
          <CrosshairIcon className="w-4 h-4" />
        </IconButton>
      </Flex>
    </Panel>
  )
}
