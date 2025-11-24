import { Box, Button, Text, TextField } from '@radix-ui/themes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  listGeometriesGeometryGetQueryKey,
  updateGeometryGeometryGeomIdPutMutation,
} from '@/api/client/@tanstack/react-query.gen'

import {
  draftGraphicAtom,
  selectedGraphicsAtom,
  sketchVMAtom,
  updateModeAtom,
} from './atoms'
import { arcgisToWkt } from './utils/wkt-utils'

import type Graphic from '@arcgis/core/Graphic'

export function UpdateGraphicForm({
  graphic,
}: {
  graphic: Graphic | undefined
}) {
  if (!graphic) return null
  const [label, setLabel] = useState(graphic.attributes.label ?? '')
  const setDraft = useSetAtom(draftGraphicAtom)
  const setUpdateMode = useSetAtom(updateModeAtom)
  const setSelectedGraphics = useSetAtom(selectedGraphicsAtom)
  const sketchVM = useAtom(sketchVMAtom)[0]

  useEffect(() => {
    setLabel(graphic.attributes.label ?? '')
  }, [graphic.attributes.label])

  const queryClient = useQueryClient()

  const updateGeometry = useMutation({
    ...updateGeometryGeometryGeomIdPutMutation(),
    onSuccess: () => {
      toast.success('Geometry updated!')

      queryClient.invalidateQueries({
        queryKey: listGeometriesGeometryGetQueryKey(),
      })

      setDraft(null)
      setUpdateMode(false)
    },
    onError: () => toast.error('Failed to update geometry'),
  })

  const handleSave = () => {
    if (!graphic.geometry) {
      toast.error('Missing geometry')
      return
    }

    const wkt = arcgisToWkt(graphic.geometry)

    updateGeometry.mutate({
      body: { wkt, label },
      path: { geom_id: graphic.attributes.id },
    })
    setSelectedGraphics([])
  }

  const originalGeometry = graphic.geometry ? graphic.geometry.clone() : null

  const reset = () => {
    setLabel(graphic.attributes.label ?? '')
    if (originalGeometry) {
      graphic.geometry = originalGeometry
    }
    setDraft(null)
    setUpdateMode(false)
    setSelectedGraphics([])
    if (sketchVM) {
      sketchVM.cancel()
    }
  }

  return (
    <Box>
      <Text size="4" weight="bold">
        Edit Graphic
      </Text>

      <TextField.Root
        value={label}
        placeholder="Label"
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        mt="3"
      />

      <Box mt="3">
        <Button
          onClick={handleSave}
          disabled={!label || updateGeometry.isPending}
        >
          {updateGeometry.isPending ? 'Saving…' : 'Save'}
        </Button>

        <Button variant="outline" ml="2" onClick={reset}>
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
