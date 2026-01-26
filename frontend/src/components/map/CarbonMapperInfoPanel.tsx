import { Box, Button, DataList, Text } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { XIcon } from 'lucide-react'

import { selectedCarbonMapperPlumeAtom } from './atoms'
import { Panel } from '../ui/Panel'

export function CarbonMapperInfoPanel() {
  const [plume, setPlume] = useAtom(selectedCarbonMapperPlumeAtom)

  if (!plume) return null

  const formatDate = (timestamp?: string | null) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatEmission = (value: number | null | undefined) => {
    if (!value) return 'N/A'
    return `${value.toFixed(1)} kg/hr`
  }

  return (
    <Panel className="absolute top-2 right-2 w-[320px]">
      <Box>
        <Box
          mb="3"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text size="4" weight="bold">
            Carbon Mapper Plume
          </Text>
          <Button
            size="1"
            variant="ghost"
            onClick={() => setPlume(null)}
            aria-label="Close"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </Box>

        <Box p="2" className="rounded-md bg-gray-2">
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Plume ID</DataList.Label>
              <DataList.Value className="text-xs font-mono">
                {plume.plume_id || plume.id}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Gas Type</DataList.Label>
              <DataList.Value>
                <Text
                  weight="bold"
                  color={plume.gas === 'CH4' ? 'orange' : 'blue'}
                >
                  {plume.gas || 'Unknown'}
                </Text>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Emission Rate</DataList.Label>
              <DataList.Value>
                {formatEmission(plume.emission_auto)}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Platform</DataList.Label>
              <DataList.Value>{plume.platform || 'N/A'}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Instrument</DataList.Label>
              <DataList.Value>{plume.instrument || 'N/A'}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Date</DataList.Label>
              <DataList.Value>
                {formatDate(plume.scene_timestamp)}
              </DataList.Value>
            </DataList.Item>

            {plume.plume_bounds && (
              <DataList.Item>
                <DataList.Label>Bounds</DataList.Label>
                <DataList.Value className="text-xs font-mono">
                  {plume.plume_bounds.map((v) => v.toFixed(4)).join(', ')}
                </DataList.Value>
              </DataList.Item>
            )}
          </DataList.Root>
        </Box>

        {plume.plume_png && (
          <Box mt="0">
            <img
              src={plume.plume_png}
              alt={`Plume ${plume.plume_id}`}
              className="w-full rounded-md"
            />

            <Box mt="3">
              <Box
                style={{
                  width: '100%',
                  height: '10px',
                  background:
                    'linear-gradient(to right, rgb(25, 25, 112), rgb(0, 128, 255), rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 140, 0), rgb(192, 0, 0))',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />

              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '2px',
                  fontSize: '10px',
                }}
              >
                <Text size="1">0</Text>
                <Text size="1">3K</Text>
                <Text size="1" weight="bold">
                  6K+
                </Text>
              </Box>

              {/* Unit Label */}
              <Text size="1" color="gray">
                ppm-m
              </Text>
            </Box>

            <Box mt="1" pt="1" style={{ borderTop: '1px solid var(--gray-6)' }}>
              <Text size="1" color="gray">
                Data from{' '}
                <a
                  href="https://carbonmapper.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-12)' }}
                >
                  Carbon Mapper
                </a>
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Panel>
  )
}
