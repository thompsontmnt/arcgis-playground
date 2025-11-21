import { createContext, useCallback, useContext, useRef } from 'react'

import type { ReactNode } from 'react'

type MapContextType = {
  viewRef: React.RefObject<__esri.MapView | null>
  setView: (v: __esri.MapView) => void
  whenReady: () => Promise<__esri.MapView>
}

const MapContext = createContext<MapContextType | null>(null)

export function MapProvider({ children }: { children: ReactNode }) {
  const viewRef = useRef<__esri.MapView | null>(null)

  let resolveReady: (view: __esri.MapView) => void
  const readyPromise = new Promise<__esri.MapView>((res) => {
    resolveReady = res
  })

  const setView = useCallback((view: __esri.MapView) => {
    viewRef.current = view
    resolveReady!(view)
  }, [])

  const whenReady = useCallback(() => {
    return readyPromise
  }, [])

  return (
    <MapContext.Provider value={{ viewRef, setView, whenReady }}>
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap must be inside MapProvider')
  return ctx
}
