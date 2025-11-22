import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Flex, Separator, Text } from '@radix-ui/themes'
import { useAtomValue } from 'jotai'

import { selectedGraphicsAtom } from './atoms'
import { Panel } from '../ui/Panel'

export function GraphicInfoPanel() {
  const graphics = useAtomValue(selectedGraphicsAtom)

  const isEmpty = graphics.length === 0

  return (
    <div>
      {isEmpty && <VisuallyHidden>Empty</VisuallyHidden>}

      {!isEmpty && (
        <Panel>
          <Text size="4">Selected Graphic</Text>

          {graphics.map((graphic, i) => (
            <Flex key={i} direction="column" gap="2">
              <Text>Type: {graphic.geometry?.type}</Text>
              <Text>{JSON.stringify(graphic.attributes, null, 2)}</Text>
              <Separator size="2" />
            </Flex>
          ))}
        </Panel>
      )}
    </div>
  )
}
