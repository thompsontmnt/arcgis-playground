import { Box, Button, DataList, Text } from '@radix-ui/themes'
import { useState } from 'react'

import type Graphic from '@arcgis/core/Graphic'

interface SelectedGraphicPanelProps {
  graphics: Array<Graphic>
}

function formatLabel(key: string) {
  return key.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function SelectedGraphicPanel({ graphics }: SelectedGraphicPanelProps) {
  if (graphics.length === 0) return null

  const [expandedWkt, setExpandedWkt] = useState<{ [key: number]: boolean }>({})

  const toggleWkt = (i: number) =>
    setExpandedWkt((prev) => ({ ...prev, [i]: !prev[i] }))

  return (
    <Box>
      <Text size="4" weight="bold">
        Selected Graphic
      </Text>

      {graphics.map((graphic, i) => {
        const { geometry, attributes } = graphic

        const wkt = attributes?.wkt

        return (
          <Box key={i} p="2" className="rounded-md bg-gray-2">
            <DataList.Root mt="3">
              <DataList.Item>
                <DataList.Label>Geometry Type</DataList.Label>
                <DataList.Value>{geometry?.type}</DataList.Value>
              </DataList.Item>

              {Object.entries(attributes || {})
                .filter(([key]) => key !== 'wkt' && key !== 'externalId')
                .map(([key, value]) => (
                  <DataList.Item key={key}>
                    <DataList.Label>{formatLabel(key)}</DataList.Label>
                    <DataList.Value className="break-words">
                      {String(value)}
                    </DataList.Value>
                  </DataList.Item>
                ))}
            </DataList.Root>

            <Box mt="3">
              <Button
                variant="ghost"
                size="1"
                onClick={() => toggleWkt(i)}
                style={{ padding: 0 }}
              >
                {expandedWkt[i] ? 'Hide WKT' : 'Show WKT'}
              </Button>

              {expandedWkt[i] && (
                <Box
                  mt="2"
                  p="2"
                  className="bg-gray-3 rounded-sm text-[11px] leading-tight break-words whitespace-pre-wrap"
                >
                  {wkt}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
