import { useAtomValue } from 'jotai'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { viewAtom, viewReadyAtom } from '@/components/map/atoms'
import { defaultTools } from '@/components/tools'
import type { ToolInitializer } from '@/components/tools'

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
  const [activeTool, setActiveTool] = useState('select')
  const registryRef = useRef<ToolRegistry>({})
  const currentToolRef = useRef<{ deactivate: () => void } | null>(null)

  const view = useAtomValue(viewAtom)
  const viewReady = useAtomValue(viewReadyAtom)

  const registerTool = (name: string, init: ToolInitializer) => {
    registryRef.current[name] = init
  }

  useEffect(() => {
    if (!view) return

    // clean up previous tool
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
  }, [activeTool, viewReady])

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
  if (!ctx) throw new Error('useToolManager must be used inside ToolProvider')
  return ctx
}
