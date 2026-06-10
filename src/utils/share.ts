const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

/** Build a shareable URL that encodes the current position in the hash. */
export function buildShareUrl(fen: string): string {
  const base = `${window.location.origin}${window.location.pathname}`
  if (fen === START_FEN) return base
  return `${base}#fen=${encodeURIComponent(fen)}`
}

/** Read a FEN out of the current URL hash, if one was shared. */
export function readSharedFen(): string | null {
  const hash = window.location.hash
  if (!hash.startsWith('#fen=')) return null
  try {
    return decodeURIComponent(hash.slice(5))
  } catch {
    return null
  }
}

/** Clear the position hash without reloading the page. */
export function clearShareHash(): void {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}
