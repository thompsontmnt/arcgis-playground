import { Flex, IconButton } from '@radix-ui/themes'
import { CircleIcon, MousePointerIcon, ShapesIcon } from 'lucide-react'

import { useToolManager } from '@/context/ToolManagerContext'

import { Panel } from '../ui/Panel'

export default function Toolbar() {
  const { activeTool, setActiveTool } = useToolManager()

  return (
    <Panel>
      <Flex gap="2" justify="center">
        <IconButton
          size="1"
          variant={activeTool === 'select' ? 'surface' : 'ghost'}
          onClick={() => setActiveTool('select')}
          aria-label="Select tool"
          highContrast
        >
          <MousePointerIcon />
        </IconButton>
        <IconButton
          size="1"
          variant={activeTool === 'draw-point' ? 'surface' : 'ghost'}
          onClick={() => setActiveTool('draw-point')}
          aria-label="Draw point tool"
          highContrast
        >
          <CircleIcon />
        </IconButton>
        <IconButton
          size="1"
          variant={activeTool === 'draw-polygon' ? 'surface' : 'ghost'}
          onClick={() => setActiveTool('draw-polygon')}
          aria-label="Draw polygon tool"
          highContrast
        >
          <ShapesIcon />
        </IconButton>
      </Flex>
    </Panel>
  )
}
