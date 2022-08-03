import { useMemo } from 'react'

export const map = f => x => useMemo(() => f(x), [ x ])
export const map_all = f => (...x) => useMemo(() => f(...x), x)
