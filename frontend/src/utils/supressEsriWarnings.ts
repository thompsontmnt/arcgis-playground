const originalWarn = console.warn

console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''

  // Suppress ALL Esri warnings (SDK does has not caught up with deprecations)
  if (msg.startsWith('[esri.')) {
    return
  }

  originalWarn(...args)
}
