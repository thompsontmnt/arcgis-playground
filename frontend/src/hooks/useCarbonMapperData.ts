import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { getCarbonMapperPlumesApiV1CarbonMapperPlumesGet } from '@/api/client'
import { carbonMapperLoadingAtom } from '@/components/map/atoms'
import { createGraphicsFromCarbonMapperPlumes } from '@/components/map/utils/carbonMapperGraphics'

export function useCarbonMapperData() {
  const setLoading = useSetAtom(carbonMapperLoadingAtom)

  return useCallback(async () => {
    setLoading(true)
    try {
      const response = await getCarbonMapperPlumesApiV1CarbonMapperPlumesGet()
      const graphics = createGraphicsFromCarbonMapperPlumes(
        response.data?.items || [],
      )
      return graphics
    } finally {
      setLoading(false)
    }
  }, [setLoading])
}
