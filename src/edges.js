export const edges = Object.assign(
  n => ({ top: n, bottom: n, left: n, right: n }),
  {
    x: n => ({ left: n, right: n }),
    y: n => ({ top: n, bottom: n })
  }
)
