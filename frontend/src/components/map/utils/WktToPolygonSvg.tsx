import { wktToGeoJSON } from '@terraformer/wkt'

const SIZE = 24

type WktPolygonSvgProps = {
  wkt: string
  size?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

export function WktPolygonSvg({
  wkt,
  size = SIZE,
  fill = 'rgba(0, 150, 255, 0.3)',
  stroke = '#0096ff',
  strokeWidth = 1,
  className,
}: WktPolygonSvgProps) {
  const geo = wktToGeoJSON(wkt)

  if (geo.type !== 'Polygon') return null

  const ring = geo.coordinates[0]
  if (ring.length === 0) return null

  const xs = ring.map(([x]) => x)
  const ys = ring.map(([, y]) => y)

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const width = maxX - minX
  const height = maxY - minY
  const scale = Math.max(width, height) || 1

  const PAD = size * 0.1
  const SCALE = size * 0.8

  const points = ring
    .map(([x, y]) => {
      const nx = ((x - minX) / scale) * SCALE + PAD
      const ny = ((maxY - y) / scale) * SCALE + PAD
      return `${nx},${ny}`
    })
    .join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
