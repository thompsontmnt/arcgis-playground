export const selectTool = (view: __esri.MapView) => {
  console.log('SELECT TOOL ACTIVE')

  // Click handler
  const clickHandle = view.on('click', async (event) => {
    const hit = await view.hitTest(event)

    const isGraphicHit = (r: any): r is __esri.MapViewGraphicHit =>
      r.type === 'graphic' && !!r.graphic
    const g = hit.results.find(isGraphicHit)?.graphic

    if (!g) {
      console.log('No graphic selected')
      return
    }

    // Highlighting
    view.graphics.removeMany(
      view.graphics.filter((gr) => gr.attributes?.__selected),
    )

    g.attributes = { ...(g.attributes ?? {}), __selected: true }

    g.symbol = {
      type: 'simple-fill',
      color: [0, 0, 0, 0],
      outline: { color: 'cyan', width: 3 },
    } as any

    console.log('Selected graphic:', g)
  })

  return () => {
    console.log('SELECT TOOL CLEANUP')
    clickHandle.remove()
  }
}
