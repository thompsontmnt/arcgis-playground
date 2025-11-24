import { Flex, IconButton, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { ChevronDownIcon, ChevronUpIcon, LocateIcon } from 'lucide-react'
import { useState } from 'react'

import {
  listGeometriesGeometryGetOptions,
  listGeometriesGeometryGetQueryKey,
} from '@/api/client/@tanstack/react-query.gen'

import { graphicsByIdAtom, selectedGraphicsAtom } from './atoms'
import { viewAtom } from '../map/atoms'
import { Panel } from '../ui/Panel'
import { WktPolygonSvg } from './utils/wktToPolygonSvg'

export function GraphicsListPanel() {
  const [collapsed, setCollapsed] = useState(false)
  const view = useAtomValue(viewAtom)
  const graphicsById = useAtomValue(graphicsByIdAtom)
  const setSelected = useSetAtom(selectedGraphicsAtom)

  const { data, isLoading } = useQuery({
    ...listGeometriesGeometryGetOptions(),
    queryKey: listGeometriesGeometryGetQueryKey(),
  })

  if (isLoading) return <Spinner />
  if (!data?.length)
    return <Text>No records found. Use the draw tool to create a graphic</Text>

  return (
    <Panel>
      <Flex justify="between" align="center">
        <Text size="4" weight="bold">
          All Graphics
        </Text>
        <IconButton
          size="1"
          variant="ghost"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand list' : 'Collapse list'}
        >
          {collapsed ? (
            <ChevronDownIcon size="16" />
          ) : (
            <ChevronUpIcon size="16" />
          )}
        </IconButton>
      </Flex>

      {!collapsed && (
        <Flex direction="column" gap="2" mt="3">
          {data.map((item) => {
            const graphic = graphicsById[item.id]

            return (
              <Flex
                key={item.id}
                justify="between"
                align="center"
                className="p-2 rounded hover:backdrop-blur-lg cursor-pointer"
                onClick={() => {
                  setSelected([graphic])
                }}
                role="listitem"
              >
                <Flex direction="row" gap="2" align="center">
                  <WktPolygonSvg wkt={item.wkt} />
                  <Text size="1" color="gray">
                    ID: {item.id}
                  </Text>
                  <Text weight="medium">{item.label}</Text>
                </Flex>

                <IconButton
                  size="1"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (view) {
                      view.goTo(graphic)
                    }
                  }}
                  title="Zoom to"
                >
                  <LocateIcon size="16" />
                </IconButton>
              </Flex>
            )
          })}
        </Flex>
      )}
    </Panel>
  )
}
