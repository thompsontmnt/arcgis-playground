import { useAtomValue } from 'jotai'

import {
  createModeAtom,
  draftGraphicAtom,
  selectedGraphicsAtom,
  updateModeAtom,
} from './atoms'
import { CreateGraphicForm } from './CreateGraphicForm'
import { SelectedGraphicPanel } from './SelectedGraphicPanel'
import { UpdateGraphicForm } from './UpdateGraphicForm'
import { Panel } from '../ui/Panel'

export function GraphicInfoPanel() {
  const isCreating = useAtomValue(createModeAtom)
  const isUpdating = useAtomValue(updateModeAtom)
  const draftGraphic = useAtomValue(draftGraphicAtom)
  const selected = useAtomValue(selectedGraphicsAtom)

  if (!(isCreating || isUpdating || draftGraphic || selected.length > 0)) {
    return null
  }

  let content = null
  if (isCreating && draftGraphic) {
    content = <CreateGraphicForm graphic={draftGraphic} />
  } else if (isUpdating && selected.length === 1) {
    const graphic = selected[0]
    if (!graphic.attributes?.id) {
      content = <CreateGraphicForm graphic={graphic} />
    } else {
      content = (
        <>
          <SelectedGraphicPanel graphics={[graphic]} />
          <UpdateGraphicForm graphic={graphic} />
        </>
      )
    }
  } else if (!isCreating && !isUpdating && selected.length > 0) {
    content = <SelectedGraphicPanel graphics={selected} />
  }

  return <Panel className="absolute top-2 right-2 w-[300px]">{content}</Panel>
}
