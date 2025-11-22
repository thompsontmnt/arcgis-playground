import { Box, Flex } from '@radix-ui/themes'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import { goToPoint } from '@/utils/goToPoint'

import { Panel } from '../Panel'

export default function AddressSearch() {
  const {
    query,
    onQueryChange,
    suggestions,
    loading,
    selectSuggestion,
    submit,
  } = useAddressSearch(async (result) => {
    if (!result.location) return

    try {
      await goToPoint(result.location) // now uses global view atom
    } catch (err) {
      console.error('GO TO ERROR:', err)
    }
  })

  const hasSuggestions = useMemo(
    () => suggestions.length > 0,
    [suggestions.length],
  )

  return (
    <Panel>
      <Flex gap="2" align="center">
        <Input
          value={query}
          placeholder="Search address…"
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        <Button disabled={loading} onClick={submit}>
          {loading ? 'Loading...' : 'Go'}
        </Button>
      </Flex>

      {hasSuggestions && (
        <Box
          mt="2"
          maxHeight="180px"
          overflow="auto"
          className="border rounded shadow-md animate-in fade-in slide-in-from-top-1"
        >
          {suggestions.map((s, i) => (
            <Box
              key={i}
              px="3"
              py="2"
              className="cursor-pointer hover:bg-gray-600"
              onClick={() => selectSuggestion(s)}
            >
              {s.text}
            </Box>
          ))}
        </Box>
      )}
    </Panel>
  )
}
