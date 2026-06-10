import type { ChessOpening } from '../../types/openings'

export const openGames: ChessOpening[] = [
  {
    id: 'italian-game',
    eco: 'C50',
    name: 'Italian Game',
    category: 'open',
    difficulty: 'beginner',
    description: 'One of the oldest openings in chess, the Italian Game aims for quick development and control of the center. White brings out both knights and a bishop before castling, setting up a solid foundation.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Claim the center immediately. This is the most popular opening move and gives White space and fast development.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'Black mirrors White and stakes an equal claim to the center.' },
      { uci: 'g1f3', san: 'Nf3', explanation: 'Develop the knight while attacking the e5 pawn. This forces Black to defend.' },
      { uci: 'b8c6', san: 'Nc6', explanation: 'Black defends e5 with the knight — the most natural developing move.' },
      { uci: 'f1c4', san: 'Bc4', explanation: 'The Italian move! The bishop eyes the f7 square, the weakest point in Black\'s position. Now White threatens Scholar\'s Mate.' },
    ],
    variations: [
      {
        name: 'Giuoco Piano',
        moves: [
          { uci: 'f8c5', san: 'Bc5', explanation: 'Black mirrors White\'s bishop — symmetrical and solid, leading to the Giuoco Piano ("quiet game").' },
        ],
        tip: 'Follow up with c3 and d4 to fight for the center.',
      },
      {
        name: 'Two Knights Defense',
        moves: [
          { uci: 'g8f6', san: 'Nf6', explanation: 'Black develops aggressively, attacking the e4 pawn immediately. More combative than 5...Bc5.' },
        ],
        tip: 'After Ng5, Black must be careful about the Fried Liver Attack.',
      },
    ],
    keyIdeas: [
      'Develop knights before bishops',
      'Control the center with pawns on e4',
      'Target the weak f7 square',
      'Castle early for king safety',
    ],
    commonMistakes: [
      'Playing Ng5 too early without sufficient preparation',
      'Neglecting to castle after the opening',
      'Moving the same piece twice in the opening',
    ],
    famousPlayers: ['Bobby Fischer', 'Fabiano Caruana'],
    tags: ['classical', 'center', 'f7-attack'],
  },

  {
    id: 'ruy-lopez',
    eco: 'C60',
    name: 'Ruy Lopez (Spanish)',
    category: 'open',
    difficulty: 'intermediate',
    description: 'Named after 16th-century Spanish priest Ruy López de Segura, this opening is the most deeply analyzed in chess history. White immediately puts pressure on the knight defending e5, planning to win the center.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Open the position — White's most popular first move at all levels.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'The symmetric response, contesting the center.' },
      { uci: 'g1f3', san: 'Nf3', explanation: 'Attack the e5 pawn and develop the knight.' },
      { uci: 'b8c6', san: 'Nc6', explanation: 'Defend the e5 pawn naturally.' },
      { uci: 'f1b5', san: 'Bb5', explanation: 'The Ruy Lopez! This bishop pin on c6 indirectly pressures the e5 pawn. If c6 moves, Black loses e5.' },
    ],
    variations: [
      {
        name: 'Morphy Defense',
        moves: [
          { uci: 'a7a6', san: 'a6', explanation: 'Black challenges the bishop immediately. If Bxc6, Black recaptures with the pawn and gets the bishop pair.' },
        ],
        tip: 'After Ba4 Nf6, the main lines of the Ruy Lopez begin.',
      },
      {
        name: 'Berlin Defense',
        moves: [
          { uci: 'g8f6', san: 'Nf6', explanation: 'The Berlin — extremely solid and popular at the top level. Black aims for an endgame advantage.' },
        ],
        tip: 'The Berlin endgame is considered slightly better for Black despite the doubled pawn.',
      },
    ],
    keyIdeas: [
      'Put long-term pressure on c6 and e5',
      'Prepare d4 to fully occupy the center',
      'Maintain the tension rather than releasing it early',
      'Castle kingside and connect rooks',
    ],
    commonMistakes: [
      'Playing Bxc6 too early — giving Black the bishop pair',
      'Forgetting that Bb5 doesn\'t immediately win a pawn',
      'Neglecting queenside play in the middlegame',
    ],
    famousPlayers: ['Magnus Carlsen', 'Garry Kasparov', 'Anatoly Karpov'],
    tags: ['classical', 'pressure', 'long-term'],
  },

  {
    id: 'scotch-game',
    eco: 'C44',
    name: 'Scotch Game',
    category: 'open',
    difficulty: 'beginner',
    description: 'The Scotch Game was famously revived by Garry Kasparov in the 1990s. White immediately opens the position with d4 instead of the slow maneuvering of the Spanish.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Fight for the center.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'Black mirrors.' },
      { uci: 'g1f3', san: 'Nf3', explanation: 'Develop and attack e5.' },
      { uci: 'b8c6', san: 'Nc6', explanation: 'Defend the pawn.' },
      { uci: 'd2d4', san: 'd4',  explanation: 'The Scotch move! White immediately challenges the center and gains space.' },
      { uci: 'e5d4', san: 'exd4', explanation: 'Black captures — forced, otherwise White gets a strong center for free.' },
      { uci: 'f3d4', san: 'Nxd4', explanation: 'White recaptures and has a powerful knight on d4 in the center.' },
    ],
    keyIdeas: [
      'Open the center quickly with d4',
      'Get the knight to the strong d4 square',
      'Use the open e-file after the center is cleared',
      'Attack before Black completes development',
    ],
    commonMistakes: [
      'Playing Nxd4 too passively — look for active piece play',
      'Allowing Black to develop all pieces before attacking',
    ],
    famousPlayers: ['Garry Kasparov', 'Magnus Carlsen'],
    tags: ['dynamic', 'center', 'open'],
  },

  {
    id: 'kings-gambit',
    eco: 'C30',
    name: 'King\'s Gambit',
    category: 'open',
    difficulty: 'intermediate',
    description: 'A romantic 19th-century opening! White sacrifices the f2 pawn for rapid development and an attack. Still playable today for its shock value and tactical richness.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Control the center.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'Black responds symmetrically.' },
      { uci: 'f2f4', san: 'f4',  explanation: 'The King\'s Gambit! White sacrifices the f pawn to open the f-file and lure Black\'s e5 pawn away from the center.' },
    ],
    variations: [
      {
        name: 'King\'s Gambit Accepted',
        moves: [
          { uci: 'e5f4', san: 'exf4', explanation: 'Black accepts the pawn! Now they must defend it while White builds a rapid attack.' },
        ],
        tip: 'After g4 to hold the pawn, play Nf3 and then Bc4 for a fierce attack on f7.',
      },
      {
        name: 'King\'s Gambit Declined',
        moves: [
          { uci: 'f8c5', san: 'Bc5', explanation: 'Black declines and counter-attacks with the bishop. The game stays closed.' },
        ],
        tip: 'After Bc5, play Nf3 and d4 to fight for the center.',
      },
    ],
    keyIdeas: [
      'Sacrifice the f-pawn for rapid development',
      'Open the f-file for the rook',
      'Attack the f7 square aggressively',
      'Speed matters — don\'t allow Black to consolidate',
    ],
    commonMistakes: [
      'Playing too slowly after the gambit',
      'Forgetting that your king is exposed on f1',
    ],
    famousPlayers: ['Paul Morphy', 'Adolf Anderssen', 'Bobby Fischer'],
    tags: ['gambit', 'attack', 'romantic', 'sacrifice'],
  },

  {
    id: 'petrovs-defense',
    eco: 'C42',
    name: 'Petrov\'s Defense',
    category: 'open',
    difficulty: 'intermediate',
    description: 'Also known as the Russian Game, Petrov\'s Defense is extremely solid. Black immediately counter-attacks the e4 pawn instead of defending e5.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Start with the king pawn.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'Black responds symmetrically.' },
      { uci: 'g1f3', san: 'Nf3', explanation: 'Attack e5.' },
      { uci: 'g8f6', san: 'Nf6', explanation: 'The Petrov! Black counter-attacks e4 instead of defending e5.' },
      { uci: 'f3e5', san: 'Nxe5', explanation: 'White captures — Nxe5 is the main line, leading to an endgame.' },
      { uci: 'd7d6', san: 'd6',  explanation: 'Black kicks the knight and recovers e5 on the next move.' },
      { uci: 'e5f3', san: 'Nf3', explanation: 'White retreats — Nxf7 would be a mistake after d5! wins back material.' },
    ],
    keyIdeas: [
      'Counter-attack e4 immediately instead of defending',
      'The resulting positions are very symmetrical and solid',
      'Black equalizes easily — good for drawing as Black',
      'Beware of Nxf7 tricks early on',
    ],
    commonMistakes: [
      'Playing Nxe4 too eagerly before ensuring safety',
      'Forgetting that White can win back the pawn favorably',
    ],
    famousPlayers: ['Vladimir Kramnik', 'Magnus Carlsen', 'Viswanathan Anand'],
    tags: ['solid', 'symmetrical', 'drawing', 'counter-attack'],
  },

  {
    id: 'vienna-game',
    eco: 'C25',
    name: 'Vienna Game',
    category: 'open',
    difficulty: 'beginner',
    description: 'The Vienna Game develops the queen\'s knight early instead of the king\'s knight. White plans f4 and a strong central attack.',
    moves: [
      { uci: 'e2e4', san: 'e4',  explanation: 'Open the center.' },
      { uci: 'e7e5', san: 'e5',  explanation: 'Black responds.' },
      { uci: 'b1c3', san: 'Nc3', explanation: 'The Vienna! White develops the queen-side knight and prepares f4.' },
    ],
    keyIdeas: [
      'Prepare f4 to build a strong pawn center',
      'The Nc3 on c3 supports a future d4 push',
      'Vienna Gambit (f4) gives attacking chances',
      'Flexible — can transpose to other openings',
    ],
    commonMistakes: [
      'Playing f4 without enough preparation',
    ],
    famousPlayers: ['Mikhail Tal', 'Paul Morphy'],
    tags: ['flexible', 'attack', 'f4'],
  },
]
