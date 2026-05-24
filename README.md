# Chess Analyzer

A full-featured chess game analyzer built with React, TypeScript, and Stockfish 18.

## Features

- **Interactive chess board** with drag-and-drop and click-to-move
- **Stockfish 18 engine** running in a Web Worker for real-time analysis
- **Best move arrows** overlaid on the board
- **Evaluation bar** showing centipawn score with mate-in-N display
- **Multi-line analysis** (up to 5 engine lines simultaneously)
- **Move history** in algebraic notation with click-to-navigate
- **Legal move highlighting** with capture differentiation
- **Last move highlight** with yellow square indicators
- **Pawn promotion dialog** with piece selector
- **Game modes**: Player vs Player and Analysis Mode
- **Board themes**: Classic, Ocean, Forest, Walnut, Rose
- **Material balance bar** with advantage counter
- **Position info**: castling rights, en passant, 50-move rule
- **Game phase detection**: Opening / Middlegame / Endgame
- **Opening name recognition** (25+ named openings)
- **PGN export/import** with download and clipboard copy
- **FEN import** for loading any position
- **Game timer** with configurable time controls
- **Game stats**: accuracy percentages and move classification breakdown
- **Captured pieces** display with unicode symbols
- **Player name editor**
- **Keyboard shortcuts**: arrow keys for navigation, F to flip
- **Settings panel**: all features are toggleable
- **Copy FEN** to clipboard

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- chess.js for move validation and game logic
- react-chessboard v5 for the board UI
- Stockfish 18 (WASM) via Web Worker

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## How Analysis Works

The app initializes a Stockfish 18 Web Worker on startup. After every move, it sends the current position via the UCI protocol and receives centipawn evaluations and best move lines. The engine runs at configurable depth (8–24 half-moves) with up to 5 simultaneous analysis lines.
