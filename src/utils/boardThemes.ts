import type { BoardTheme } from '../types'

export const BOARD_THEMES: Record<BoardTheme, { dark: string; light: string; label: string }> = {
  classic: { dark: '#3d4a5c', light: '#dde3ec', label: 'Classic' },
  ocean:   { dark: '#4a7c6f', light: '#c9e8df', label: 'Ocean' },
  forest:  { dark: '#4a5c3d', light: '#d8e8cc', label: 'Forest' },
  walnut:  { dark: '#7b5e41', light: '#f0d9b5', label: 'Walnut' },
  rose:    { dark: '#8b5a6b', light: '#f5d0d8', label: 'Rose' },
}

export function getBoardColors(theme: BoardTheme) {
  return BOARD_THEMES[theme]
}
