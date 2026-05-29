import type { ChessOpening } from '../../types/openings'

export const semiOpenGames: ChessOpening[] = [
  {
    id: 'sicilian-defense',
    eco: 'B20',
    name: 'Sicilian Defense',
    category: 'semi-open',
    difficulty: 'intermediate',
    description: 'The most popular and combative response to 1.e4. Black fights for the center asymmetrically with c5, leading to rich, complex positions with chances for both sides.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White takes the center.' },
      { uci: 'c7c5', san: 'c5',  explanation: 'The Sicilian! Black fights for d4 with the c-pawn instead of e5. The asymmetry leads to unbalanced, exciting play.' },
      { uci: 'g1f3', san: 'Nf3', explanation: 'White develops and prepares d4.' },
      { uci: 'd7d6', san: 'd6',  explanation: 'Black prepares to develop Nc6 and Nf6, controlling e5.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'White opens the center — the critical break in the Sicilian.' },
      { uci: 'c5d4', san: 'cxd4', explanation: 'Black exchanges to gain an open c-file and half-open file for counterplay.' },
      { uci: 'f3d4', san: 'Nxd4', explanation: 'White recaptures and has a big center. Now the open Sicilian begins!' },
    ],
    variations: [
      {
        name: 'Najdorf Variation',
        moves: [
          { uci: 'b8c6', san: 'Nc6', explanation: 'Develop and attack d4.' },
          { uci: 'g8f6', san: 'Nf6', explanation: 'Develop knight, attack e4.' },
          { uci: 'a7a6', san: 'a6',  explanation: 'The Najdorf! Prevents Bb5+ and prepares b5 counterplay. Fischer and Kasparov\'s favorite.' },
        ],
        tip: 'The Najdorf is Black\'s sharpest and most ambitious Sicilian system.',
      },
      {
        name: 'Dragon Variation',
        moves: [
          { uci: 'b8c6', san: 'Nc6', explanation: 'Develop knight.' },
          { uci: 'g8f6', san: 'Nf6', explanation: 'Develop knight.' },
          { uci: 'g7g6', san: 'g6',  explanation: 'The Dragon! Black fianchettoes the bishop for maximum diagonal pressure.' },
        ],
        tip: 'The Yugoslav Attack (Be3, f3, g4, h4) is White\'s sharpest response to the Dragon.',
      },
      {
        name: 'Scheveningen Variation',
        moves: [
          { uci: 'b8c6', san: 'Nc6', explanation: 'Develop knight.' },
          { uci: 'g8f6', san: 'Nf6', explanation: 'Develop knight.' },
          { uci: 'e7e6', san: 'e6',  explanation: 'The Scheveningen — solid, flexible, and popular at the top level.' },
        ],
        tip: 'Black keeps a solid structure but the e6 pawn can become a weakness.',
      },
    ],
    keyIdeas: [
      'Fight for d4 with the c-pawn',
      'Use the open c-file for rook counterplay',
      'Attack on the queenside while White attacks kingside',
      'The half-open c-file is Black\'s key asset',
    ],
    commonMistakes: [
      'Playing too passively — the Sicilian demands active counterplay',
      'Forgetting to fight for d5 square',
      'Castling into a White attack without preparation',
    ],
    famousPlayers: ['Bobby Fischer', 'Garry Kasparov', 'Magnus Carlsen'],
    tags: ['dynamic', 'asymmetric', 'complex', 'counterplay'],
  },

  {
    id: 'french-defense',
    eco: 'C00',
    name: 'French Defense',
    category: 'semi-open',
    difficulty: 'intermediate',
    description: 'A classical and solid defense. Black sets up a resilient pawn structure with e6, aiming to counter-attack White\'s center with c5 or f6.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White occupies the center.' },
      { uci: 'e7e6', san: 'e6',  explanation: 'The French! Black prepares d5 while keeping the pawn structure solid.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'White builds a strong center. Now we have the classical French pawn chain.' },
      { uci: 'd7d5', san: 'd5',  explanation: 'Black challenges White\'s center immediately.' },
      { uci: 'e4e5', san: 'e5',  explanation: 'White advances to the Advance Variation, gaining space but creating a fixed pawn chain.' },
    ],
    variations: [
      {
        name: 'Winawer Variation',
        moves: [
          { uci: 'b1c3', san: 'Nc3', explanation: 'White defends e4 with the knight instead of advancing.' },
          { uci: 'f8b4', san: 'Bb4', explanation: 'The Winawer! Black pins the knight and creates double pawns threats. Very sharp.' },
        ],
        tip: 'After Bb4, White often sacrifices with e5 and Ne2 planning a kingside attack.',
      },
      {
        name: 'Classical Variation',
        moves: [
          { uci: 'b1c3', san: 'Nc3', explanation: 'White defends e4.' },
          { uci: 'g8f6', san: 'Nf6', explanation: 'Black develops and attacks e4.' },
        ],
        tip: 'The Classical leads to rich middlegame positions after Bg5.',
      },
    ],
    keyIdeas: [
      'Counter-attack the center with c5 or f6',
      'The dark-squared bishop on c8 is often the bad piece — activate it via b6!',
      'Use the half-open c-file after c5xd4',
      'Queenside counterplay is Black\'s main theme',
    ],
    commonMistakes: [
      'Trapping the light-squared bishop behind the pawn chain',
      'Forgetting to activate the c8 bishop via b6',
      'Playing too passively on the queenside',
    ],
    famousPlayers: ['Viktor Korchnoi', 'Tigran Petrosian', 'Mikhail Botvinnik'],
    tags: ['solid', 'pawn-chain', 'counter-attack', 'queenside'],
  },

  {
    id: 'caro-kann',
    eco: 'B10',
    name: 'Caro-Kann Defense',
    category: 'semi-open',
    difficulty: 'beginner',
    description: 'The Caro-Kann is one of the most solid defenses against 1.e4. Unlike the French, the c8 bishop stays active. World champions from Capablanca to Karpov have trusted it.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White opens the center.' },
      { uci: 'c7c6', san: 'c6',  explanation: 'The Caro-Kann! Black prepares d5 while keeping the diagonal for the c8 bishop open.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'White builds a full center.' },
      { uci: 'd7d5', san: 'd5',  explanation: 'Black immediately challenges the center. The c6 pawn supports this advance.' },
      { uci: 'b1c3', san: 'Nc3', explanation: 'White defends e4. Now Black must decide how to handle the pressure.' },
    ],
    variations: [
      {
        name: 'Classical Variation',
        moves: [
          { uci: 'd5e4', san: 'dxe4', explanation: 'Black captures to relieve central tension.' },
          { uci: 'c3e4', san: 'Nxe4', explanation: 'White recaptures with the knight.' },
          { uci: 'c8f5', san: 'Bf5', explanation: 'The Classical — Black develops the bishop BEFORE Nd7, the key difference from the French!' },
        ],
        tip: 'Bf5 is the key move. The c8 bishop is never restricted in the Caro-Kann.',
      },
      {
        name: 'Advance Variation',
        moves: [
          { uci: 'e4e5', san: 'e5',  explanation: 'White advances, gaining space and creating a pawn chain.' },
          { uci: 'c8f5', san: 'Bf5', explanation: 'Black develops the bishop while the pawn structure is still open.' },
        ],
        tip: 'After the Advance, Black plays c5 to undermine White\'s chain.',
      },
    ],
    keyIdeas: [
      'The c8 bishop stays active — the main advantage over the French',
      'After exchanges, use the half-open d-file',
      'Play c5 to challenge White\'s center when possible',
      'The pawn structure is very solid and endgame-friendly',
    ],
    commonMistakes: [
      'Playing like the French and restricting your bishop',
      'Being too passive — look for the c5 break',
      'Not knowing the specific move order (Bf5 before Nd7)',
    ],
    famousPlayers: ['Anatoly Karpov', 'Magnus Carlsen', 'Jose Capablanca'],
    tags: ['solid', 'classical', 'endgame', 'beginner-friendly'],
  },

  {
    id: 'scandinavian',
    eco: 'B01',
    name: 'Scandinavian Defense',
    category: 'semi-open',
    difficulty: 'beginner',
    description: 'One of the oldest defenses! Black immediately captures the e4 pawn on move one, forcing the queen to the board early. Simple to learn but surprisingly effective.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White takes the center.' },
      { uci: 'd7d5', san: 'd5',  explanation: 'The Scandinavian! Black immediately challenges the center with the d pawn.' },
      { uci: 'e4d5', san: 'exd5', explanation: 'White captures — almost forced.' },
      { uci: 'd8d5', san: 'Qxd5', explanation: 'Black recaptures with the queen. This queen can be attacked, but Black knows exactly what they\'re doing.' },
      { uci: 'b1c3', san: 'Nc3', explanation: 'White develops with tempo by attacking the queen.' },
      { uci: 'd5a5', san: 'Qa5',  explanation: 'The queen retreats to a5, where it stays active and eyes both c7 and e5.' },
    ],
    keyIdeas: [
      'The early queen on a5 pins White\'s c3 knight if Bb4+ comes',
      'Play Nf6, e6, and Bf5 for solid development',
      'Use the open d-file after the early exchanges',
      'Easy to understand — great for beginners',
    ],
    commonMistakes: [
      'Allowing the queen to be chased multiple times for free',
      'Playing Nf6 before developing the light-squared bishop',
    ],
    famousPlayers: ['Magnus Carlsen', 'Sergei Tiviakov'],
    tags: ['aggressive', 'queen-early', 'beginner-friendly', 'sharp'],
  },

  {
    id: 'alekhines-defense',
    eco: 'B02',
    name: 'Alekhine\'s Defense',
    category: 'semi-open',
    difficulty: 'advanced',
    description: 'Named after World Champion Alexander Alekhine, this provocative defense invites White to chase Black\'s knight all over the board, hoping White\'s pawn center will overextend.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White takes the center.' },
      { uci: 'g8f6', san: 'Nf6', explanation: 'The Alekhine! Black attacks e4 immediately with the knight, daring White to push pawns and create a target.' },
      { uci: 'e4e5', san: 'e5',  explanation: 'White chases the knight — the main line.' },
      { uci: 'f6d5', san: 'Nd5', explanation: 'Knight retreats to d5 — a strong central square.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'White builds the "Big Center" — exactly what Black wants!' },
      { uci: 'd5b6', san: 'Nb6', explanation: 'Knight retreats again, but now White\'s center can become a target.' },
    ],
    keyIdeas: [
      'Hypermodern principle: let White build a big center, then attack it!',
      'The knight bounces around but eventually lands on a good square',
      'Attack White\'s pawns with c5 and f6',
      'Black\'s counterplay is on the queenside and center',
    ],
    commonMistakes: [
      'Losing track of the knight — always have a plan for it',
      'Being too passive when White\'s center is established',
    ],
    famousPlayers: ['Alexander Alekhine', 'Lev Polugaevsky'],
    tags: ['hypermodern', 'provocative', 'counter-attack', 'advanced'],
  },

  {
    id: 'pirc-defense',
    eco: 'B07',
    name: 'Pirc Defense',
    category: 'semi-open',
    difficulty: 'intermediate',
    description: 'A modern defense where Black allows White to take the full center, then attacks it from the flanks. The king\'s fianchetto gives Black a powerful bishop on g7.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'White takes the center.' },
      { uci: 'd7d6', san: 'd6',  explanation: 'Black prepares e5 or Nf6 without immediately challenging the center.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'White builds a big center.' },
      { uci: 'g8f6', san: 'Nf6', explanation: 'Attack e4 while developing.' },
      { uci: 'b1c3', san: 'Nc3', explanation: 'White supports the center.' },
      { uci: 'g7g6', san: 'g6',  explanation: 'The Pirc! Black fianchettoes the king\'s bishop.' },
      { uci: 'f1e2', san: 'Be2', explanation: 'White develops solidly.' },
      { uci: 'f8g7', san: 'Bg7', explanation: 'The dragon bishop is now active — it controls the long diagonal.' },
    ],
    keyIdeas: [
      'Allow White\'s center, then attack it with c5 and e5',
      'The g7 bishop is a long-range weapon on the diagonal',
      'Castle kingside and then counter-attack',
      'Use the half-open c-file or e-file for rook activity',
    ],
    commonMistakes: [
      'Being too passive and allowing White to attack freely',
      'Not countering with c5 or e5 at the right moment',
    ],
    famousPlayers: ['Robert Fischer', 'Vasily Smyslov'],
    tags: ['fianchetto', 'hypermodern', 'modern', 'dragon-bishop'],
  },
]
