import {
  Button,
  Flex,
  IconButton,
  ScrollArea,
  Spinner,
  Text,
  TextField,
} from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LocateIcon,
  MapPinnedIcon,
  SearchIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  listGeometriesGeometryGetOptions,
  listGeometriesGeometryGetQueryKey,
} from '@/api/client/@tanstack/react-query.gen'
import { cn } from '@/lib/utils'

import { selectedGraphicsAtom, sketchVMAtom, updateModeAtom } from './atoms'
import { viewAtom } from '../map/atoms'
import { Panel } from '../ui/Panel'
import { updateSketchVMWithGraphic } from './utils/common'
import { computeGraphicsExtent } from './utils/extent'
import { WktPolygonSvg } from './utils/WktToPolygonSvg'

import type Graphic from '@arcgis/core/Graphic'

export function GraphicsListPanel({ graphics }: { graphics: Array<Graphic> }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showLoadingMessage, setShowLoadingMessage] = useState(false)
  const view = useAtomValue(viewAtom)
  const [selected, setSelected] = useAtom(selectedGraphicsAtom)
  const sketchVM = useAtomValue(sketchVMAtom)
  const updateMode = useSetAtom(updateModeAtom)

  const selectedId = selected[0]?.attributes?.id

  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    ...listGeometriesGeometryGetOptions(),
    queryKey: listGeometriesGeometryGetQueryKey(),
  })

  useEffect(() => {
    if (!isLoading) {
      setShowLoadingMessage(false)
      return
    }

    const timer = setTimeout(() => {
      setShowLoadingMessage(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoading])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(
      (g) =>
        g.label?.toLowerCase().includes(search.toLowerCase()) ||
        g.id.toString().includes(search),
    )
  }, [data, search])
  const handleFitAll = () => {
    const extent = computeGraphicsExtent(graphics)
    if (extent && view) view.goTo(extent.expand(1.2))
  }

  if (isLoading)
    return (
      <Panel>
        <Flex p="2" direction="column" gap="2" align="center" justify="center">
          <Spinner />
          {showLoadingMessage && (
            <Text size="2">
              <a
                href="https://arcgis-playground-api.onrender.com/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spinning up the API, check it out here.
              </a>
            </Text>
          )}
        </Flex>
      </Panel>
    )
  if (!data?.length)
    return (
      <Panel>
        <Flex p="2" direction="column" gap="2" align="center" justify="center">
          <Text size="2">No graphics yet</Text>
          <Text size="1" color="gray">
            Use the draw tool to create a graphic
          </Text>
          <MapPinnedIcon size={64} strokeWidth={1} />
        </Flex>
      </Panel>
    )

  return (
    <Panel>
      <Flex justify="between" align="center">
        <Flex gap="2" align="center">
          <Text size="4" weight="bold">
            All Graphics
          </Text>
        </Flex>

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
        <ScrollArea style={{ maxHeight: 600, width: '100%' }}>
          <Flex p="2" my="2" justify="between" align="center">
            {!showSearch ? (
              <IconButton
                size="1"
                variant="ghost"
                onClick={() => setShowSearch(true)}
                title="Show search"
              >
                <SearchIcon size="16" />
              </IconButton>
            ) : (
              <TextField.Root
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => {
                  if (!search) setShowSearch(false)
                }}
                autoFocus
                onKeyDown={(e) => e.stopPropagation()}
              >
                <TextField.Slot>
                  <SearchIcon size={16} />
                </TextField.Slot>
              </TextField.Root>
            )}
            <Button size="1" onClick={handleFitAll} highContrast>
              Fit All
            </Button>
          </Flex>
          <Flex direction="column" gap="2" mt="3">
            {filtered.map((item) => {
              const graphic = graphics.find((g) => g.attributes.id === item.id)
              const isSelected = selectedId === item.id
              return (
                <Flex
                  key={item.id}
                  justify="between"
                  align="center"
                  className={cn` transition-colors
                p-2 rounded cursor-pointer hover:bg-gray-600
                ${isSelected ? 'bg-gray-600' : undefined}
              `}
                  onClick={() => {
                    if (graphic) {
                      setSelected([graphic])
                      updateSketchVMWithGraphic(sketchVM, graphic)
                      updateMode(true)
                    }
                  }}
                  role="listitem"
                >
                  <Flex direction="row" gap="2" align="center">
                    <WktPolygonSvg wkt={item.wkt} />
                    <Text size="1" color="gray">
                      ID: {item.id}
                    </Text>
                    <Text>{item.label}</Text>
                  </Flex>
                  <IconButton
                    size="1"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (view && graphic) {
                        view.goTo(graphic)
                      }
                    }}
                    title="Zoom to"
                    highContrast
                  >
                    <LocateIcon size="16" />
                  </IconButton>
                </Flex>
              )
            })}
          </Flex>
        </ScrollArea>
      )}
    </Panel>
  )
}
