import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import { useAtomValue } from 'jotai'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import {
  graphicsLayerAtom,
  sketchVMAtom,
  viewAtom,
} from '@/components/map/atoms'
import { defaultTools } from '@/components/tools'
import type { ToolInitializer } from '@/components/tools'
import { jotaiStore } from '@/jotai/jotaiStore'

type ToolRegistry = Record<string, ToolInitializer>

type ToolManagerContextType = {
  activeTool: string
  setActiveTool: (tool: string) => void
  registerTool: (name: string, init: ToolInitializer) => void
}

const ToolManagerContext = createContext<ToolManagerContextType | null>(null)

export const ToolManagerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const view = useAtomValue(viewAtom)
  const layer = useAtomValue(graphicsLayerAtom)

  const [activeTool, setActiveTool] = useState('select')

  const registryRef = useRef<ToolRegistry>({})
  const currentToolRef = useRef<{ deactivate: () => void } | null>(null)

  // --- Persistent SketchVM instance ---
  useEffect(() => {
    if (!view || !layer) return

    const sketch = new SketchViewModel({
      view,
      layer,
      defaultUpdateOptions: { tool: 'reshape' },
    })

    jotaiStore.set(sketchVMAtom, sketch)

    return () => {
      sketch.destroy()
      jotaiStore.set(sketchVMAtom, null)
    }
  }, [view, layer])

  // --- Activate tools ---
  useEffect(() => {
    if (!view || !layer) return

    currentToolRef.current?.deactivate()

    const initializer =
      registryRef.current[activeTool] ??
      defaultTools[activeTool as keyof typeof defaultTools]

    const tool = initializer(view)
    tool.activate(view)

    currentToolRef.current = tool

    return () => {
      tool.deactivate()
    }
  }, [activeTool, view, layer])

  const registerTool = (name: string, init: ToolInitializer) => {
    registryRef.current[name] = init
  }

  return (
    <ToolManagerContext.Provider
      value={{ activeTool, setActiveTool, registerTool }}
    >
      {children}
    </ToolManagerContext.Provider>
  )
}

export function useToolManager() {
  const ctx = useContext(ToolManagerContext)
  if (!ctx)
    throw new Error('useToolManager must be used inside ToolManagerProvider')
  return ctx
}
