import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { defaultTools } from '@/components/tools'
import type { ToolInitializer } from '@/components/tools'

import { useMap } from './MapContext'

import type { ReactNode } from 'react'

type ToolRegistry = Record<string, ToolInitializer>

type ToolManagerContextType = {
  activeTool: string
  setActiveTool: (tool: string) => void
  registerTool: (name: string, init: ToolInitializer) => void
}

const ToolManagerContext = createContext<ToolManagerContextType | null>(null)

export function ToolProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState('select')
  const registryRef = useRef<ToolRegistry>({})
  const { viewRef } = useMap()

  function registerTool(name: string, init: ToolInitializer) {
    registryRef.current[name] = init
  }

  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const tool =
      registryRef.current[activeTool] ??
      defaultTools[activeTool as keyof typeof defaultTools]
    if (!tool) return

    const cleanup = tool(view)
    return () => cleanup?.()
  }, [activeTool, viewRef])
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
