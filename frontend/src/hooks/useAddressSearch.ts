import * as locator from '@arcgis/core/rest/locator'
import { useCallback, useEffect, useRef, useState } from 'react'

const GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'

interface Suggestion {
  text: string
  magicKey: string
}

export function useAddressSearch(
  onResult: (result: __esri.AddressCandidate) => Promise<void>,
) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([])
  const [loading, setLoading] = useState(false)
  const [suppressSuggestions, setSuppressSuggestions] = useState(false)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const onQueryChange = (val: string) => {
    setQuery(val)
    setSuppressSuggestions(false)
  }

  //
  // AUTOCOMPLETE SUGGESTIONS
  //
  useEffect(() => {
    if (suppressSuggestions) {
      setSuggestions([])
      return
    }
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      // cancel prior fetch
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      const savedQuery = query

      try {
        const results = await locator.suggestLocations(GEOCODER_URL, {
          text: savedQuery,
          maxSuggestions: 5,
          signal: abortRef.current.signal,
        } as any)

        // avoid race conditions
        if (savedQuery !== query) return

        setSuggestions(
          results
            .filter((s: any) => typeof s.text === 'string' && !!s.text)
            .map((s: any) => ({
              text: s.text,
              magicKey: s.magicKey,
            })),
        )
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('suggest error:', err)
        }
      }
    }, 200)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [query, suppressSuggestions])

  //
  // USER SELECTS A SUGGESTION
  //
  const selectSuggestion = useCallback(
    async (sug: Suggestion) => {
      abortRef.current?.abort() // ← important fix

      setQuery(sug.text)
      setSuppressSuggestions(true)
      setSuggestions([])
      setLoading(true)

      try {
        const results = await locator.addressToLocations(GEOCODER_URL, {
          magicKey: sug.magicKey,
          maxLocations: 1,
          address: undefined,
        })

        if (results.length) {
          await onResult(results[0])
        }
      } catch (err) {
        console.error('selectSuggestion error:', err)
      } finally {
        setLoading(false)
      }
    },
    [onResult],
  )

  //
  // USER PRESSES ENTER OR CLICKS GO
  //
  const submit = useCallback(async () => {
    if (!query.trim()) return

    abortRef.current?.abort() // ← avoid background suggestion finishing

    setLoading(true)
    setSuggestions([])
    setSuppressSuggestions(true) // ← hides suggestions until typing again

    try {
      const results = await locator.addressToLocations(GEOCODER_URL, {
        address: { SingleLine: query },
        maxLocations: 1,
      })

      if (results.length) {
        await onResult(results[0])
      }
    } finally {
      setLoading(false)
    }
  }, [query, onResult])

  return {
    query,
    onQueryChange,
    suggestions,
    loading,
    selectSuggestion,
    submit,
  }
}
