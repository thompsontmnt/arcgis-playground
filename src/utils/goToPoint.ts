import Graphic from '@arcgis/core/Graphic'

async function waitForViewReady(view: __esri.MapView) {
  if (!view.updating) return

  await new Promise<void>((resolve) => {
    const handle = view.watch('updating', (updating) => {
      if (!updating) {
        handle.remove()
        resolve()
      }
    })
  })
}

export async function goToPoint(view: __esri.MapView, point: __esri.Point) {
  try {
    await view.when()

    await waitForViewReady(view)

    view.graphics.removeAll()

    const marker = new Graphic({
      geometry: point,
      symbol: {
        type: 'simple-marker',
        color: 'white',
        size: 10,
        outline: { color: 'black', width: 1 },
      },
    })

    view.graphics.add(marker)

    await view.goTo(
      {
        center: [point.longitude, point.latitude],
        zoom: 18,
      },
      { duration: 600 },
    )
  } catch (err) {
    console.error('goToPoint error:', err)
  }
}
