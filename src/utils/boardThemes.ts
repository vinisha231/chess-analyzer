import type { BoardTheme } from '../types'

export const BOARD_THEMES: Record<BoardTheme, { dark: string; light: string; label: string }> = {
  classic:  { dark: '#3d4a5c', light: '#dde3ec', label: 'Classic' },
  ocean:    { dark: '#4a7c6f', light: '#c9e8df', label: 'Ocean' },
  forest:   { dark: '#4a5c3d', light: '#d8e8cc', label: 'Forest' },
  walnut:   { dark: '#7b5e41', light: '#f0d9b5', label: 'Walnut' },
  rose:     { dark: '#8b5a6b', light: '#f5d0d8', label: 'Rose' },
  midnight: { dark: '#1e2a4a', light: '#8899bb', label: 'Midnight' },
  coral:    { dark: '#c04848', light: '#f5c9b3', label: 'Coral' },
  ice:      { dark: '#5a7d9a', light: '#e8f1f8', label: 'Ice' },
  lavender: { dark: '#7c6b9e', light: '#ece5f7', label: 'Lavender' },
  slate:    { dark: '#52525b', light: '#d4d4d8', label: 'Slate' },
  sand:     { dark: '#a98865', light: '#f6ead8', label: 'Sand' },
}

export function getBoardColors(theme: BoardTheme) {
  return BOARD_THEMES[theme]
}
