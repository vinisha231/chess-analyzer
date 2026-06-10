# Contributing

Thanks for your interest in improving Chess Analyzer!

## Getting started

```bash
git clone https://github.com/vinisha231/chess-analyzer.git
cd chess-analyzer
npm install
npm run dev
```

## Before opening a PR

- `npm run typecheck` must pass
- `npm run build` must succeed
- Keep commits small and focused, with conventional-commit style messages (`feat:`, `fix:`, `docs:`, …)

## Project layout

- `src/components/` — UI components (board chrome, panels, modals)
- `src/hooks/` — game state, Stockfish workers, chess.com API, timers
- `src/utils/` — pure helpers (PGN, FEN, themes, sounds, sharing)
- `src/data/openings/` — opening trainer content
- `public/stockfish.js` — the engine worker served as a static asset
