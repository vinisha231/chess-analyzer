export function buildPGNHeader(white: string, black: string, result: string, date: string): string {
  return [
    `[Event "Chess Analyzer Game"]`,
    `[Site "Chess Analyzer"]`,
    `[Date "${date}"]`,
    `[White "${white}"]`,
    `[Black "${black}"]`,
    `[Result "${result}"]`,
    '',
  ].join('\n')
}

export function formatPGNMoves(san: string[]): string {
  const parts: string[] = []
  for (let i = 0; i < san.length; i++) {
    if (i % 2 === 0) parts.push(`${Math.floor(i / 2) + 1}.`)
    parts.push(san[i])
  }
  return parts.join(' ')
}

export function downloadPGN(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseFEN(fen: string): boolean {
  const parts = fen.trim().split(' ')
  if (parts.length < 4) return false
  const rows = parts[0].split('/')
  if (rows.length !== 8) return false
  return true
}
