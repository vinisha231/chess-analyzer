# Changelog

## 0.2.0 — 2026-06-10

### Added
- **Play vs Computer** mode with five difficulty levels (Beginner ~800 to Master ~2400+), side selection, and a thinking indicator
- Autoplay game replay with Space toggle and 0.5×/1×/2× speed control
- Shareable position links (FEN encoded in the URL hash)
- Drag-and-drop `.pgn` import anywhere on the page, plus a file-upload button in the PGN panel
- Footer quick actions: share link, copy PGN, download PGN
- chess.com analysis link alongside the existing Lichess one
- Four new board themes: Ice, Lavender, Slate, Sand
- New sounds: castling, promotion, illegal move, game start
- Always-promote-to-queen setting
- Keyboard shortcuts: `Space`, `Home`/`End`, `N` (new game), `C` (copy FEN)
- Reset-to-defaults button in Settings
- Toast variants (success / info / error)
- CI workflow (typecheck + build) and missing favicon

### Changed
- Player names, board tab, and bot level now persist across sessions
- Board resizes responsively on small screens
- Engine hint arrows are hidden during an active bot game
- Improved accessibility: aria labels, tab roles, focus outlines, reduced-motion support

## 0.1.0

Initial release: Stockfish 18 analysis, PvP play, openings trainer, chess.com import, stats, and more.
