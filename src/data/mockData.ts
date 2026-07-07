/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tournament, Team, Player, Match, TeamStanding, TournamentCategory } from '../types';

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't-libre-2026',
    name: 'Copa Élite "Plaza Leiva" - Categoría Libre',
    category: 'Libre',
    startDate: '2026-05-10',
    endDate: '2026-08-30',
    format: 'Liga',
    status: 'Activo',
    description: 'El torneo principal de la Plaza Deportiva Leiva, donde compiten los mejores 8 equipos de la región por la copa dorada.',
  },
  {
    id: 't-femenino-2026',
    name: 'Copa de Campeonas Femenina Leiva',
    category: 'Femenino',
    startDate: '2026-06-01',
    endDate: '2026-09-15',
    format: 'Liga',
    status: 'Activo',
    description: 'Torneo femenino de fútbol 7. Un campeonato lleno de intensidad, talento y pasión deportiva.',
  },
  {
    id: 't-master-2026',
    name: 'Superliga de Leyendas - Master 40',
    category: 'Master',
    startDate: '2026-08-01',
    endDate: '2026-11-20',
    format: 'Grupos',
    status: 'Próximo',
    description: 'Torneo para mayores de 40 años. La experiencia y la magia intactas vuelven a la cancha de la Plaza Leiva.',
  },
  {
    id: 't-sub20-2026',
    name: 'Torneo de Promesas Juveniles Sub-20',
    category: 'Sub-20',
    startDate: '2026-04-15',
    endDate: '2026-07-20',
    format: 'Eliminación Directa',
    status: 'Activo',
    description: 'La cuna de los futuros cracks. Torneo de eliminación directa de alto rendimiento.',
  }
];

export const INITIAL_TEAMS: Team[] = [
  // CATEGORIA LIBRE
  {
    id: 'team-leiva-fc',
    name: 'Leiva FC',
    logo: '⚽',
    category: 'Libre',
    founded: '2020-03-12',
    captain: 'Carlos Mendoza',
    description: 'El equipo de la casa, caracterizado por su garra, posesión de balón y gran apoyo de la hinchada local.',
    color: '#4CAF50', // Verde marca
  },
  {
    id: 'team-vecindad',
    name: 'La Vecindad F.C.',
    logo: '🎩',
    category: 'Libre',
    founded: '2018-09-05',
    captain: 'Ramón Valdés',
    description: 'Equipo tradicional de juego directo, excelente defensa y letal en el contragolpe.',
    color: '#1A1A1A', // Negro/Gris carbón
  },
  {
    id: 'team-deportivo-leiva',
    name: 'Deportivo Sur',
    logo: '🛡️',
    category: 'Libre',
    founded: '2021-11-20',
    captain: 'Andrés Tobar',
    description: 'Fútbol lírico y de toque. Destacan por su mediocampo creativo.',
    color: '#3B82F6', // Azul
  },
  {
    id: 'team-cerveceros',
    name: 'Cerveceros F.C.',
    logo: '🍺',
    category: 'Libre',
    founded: '2019-05-15',
    captain: 'Esteban Paredes',
    description: 'Pasión dentro y fuera de la cancha. Un equipo muy unido y peligroso en tiros libres.',
    color: '#F59E0B', // Dorado
  },
  {
    id: 'team-naranjas',
    name: 'Naranja Mecánica',
    logo: '🍊',
    category: 'Libre',
    founded: '2022-01-10',
    captain: 'Johan Cruyff Jr',
    description: 'Inspirados en el fútbol total. Presión alta y rotación constante de posiciones.',
    color: '#EF4444', // Naranja/Rojo
  },
  {
    id: 'team-cristal',
    name: 'Sporting Cristal Leiva',
    logo: '💎',
    category: 'Libre',
    founded: '2017-08-14',
    captain: 'Luis Advíncula',
    description: 'Estilo de juego sólido, orden táctico impecable y letales en la pelota parada.',
    color: '#06B6D4', // Celeste
  },

  // CATEGORIA FEMENINO
  {
    id: 'team-leonas',
    name: 'Leonas de Leiva',
    logo: '🦁',
    category: 'Femenino',
    founded: '2022-04-12',
    captain: 'María Belén Arroyo',
    description: 'Las actuales campeonas. Juego explosivo por las bandas y transiciones ultra veloces.',
    color: '#EC4899', // Rosa
  },
  {
    id: 'team-amazonas',
    name: 'Amazonas F.C.',
    logo: '🏹',
    category: 'Femenino',
    founded: '2023-01-20',
    captain: 'Diana Prince',
    description: 'Fuerza, disciplina y excelente planteamiento táctico.',
    color: '#10B981', // Verde esmeralda
  },
  {
    id: 'team-galaxy',
    name: 'Galaxy Fem',
    logo: '🌌',
    category: 'Femenino',
    founded: '2021-07-15',
    captain: 'Valeria Novoa',
    description: 'Juego colectivo fluido, técnica exquisita e incansables en la marca.',
    color: '#8B5CF6', // Violeta
  },
  {
    id: 'team-valkirias',
    name: 'Valkirias Leiva',
    logo: '🛡️',
    category: 'Femenino',
    founded: '2022-09-09',
    captain: 'Karla Altamirano',
    description: 'Equipo guerrero que no da un balón por perdido. Su fuerte es el juego aéreo.',
    color: '#EF4444', // Rojo
  }
];

export const INITIAL_PLAYERS: Player[] = [
  // Leiva FC Players
  { id: 'p1', name: 'Mateo Guerrero', teamId: 'team-leiva-fc', teamName: 'Leiva FC', category: 'Libre', number: 10, position: 'Delantero', goals: 12, matchesPlayed: 8 },
  { id: 'p2', name: 'Carlos Mendoza', teamId: 'team-leiva-fc', teamName: 'Leiva FC', category: 'Libre', number: 8, position: 'Mediocampista', goals: 4, matchesPlayed: 8 },
  { id: 'p3', name: 'Santiago Paz', teamId: 'team-leiva-fc', teamName: 'Leiva FC', category: 'Libre', number: 9, position: 'Delantero', goals: 8, matchesPlayed: 7 },
  { id: 'p4', name: 'Esteban Rivas', teamId: 'team-leiva-fc', teamName: 'Leiva FC', category: 'Libre', number: 1, position: 'Portero', goals: 0, matchesPlayed: 8 },
  { id: 'p5', name: 'Javier Calle', teamId: 'team-leiva-fc', teamName: 'Leiva FC', category: 'Libre', number: 4, position: 'Defensa', goals: 1, matchesPlayed: 8 },

  // La Vecindad F.C.
  { id: 'p6', name: 'Ramón Valdés', teamId: 'team-vecindad', teamName: 'La Vecindad F.C.', category: 'Libre', number: 7, position: 'Delantero', goals: 11, matchesPlayed: 8 },
  { id: 'p7', name: 'Alberto Medina', teamId: 'team-vecindad', teamName: 'La Vecindad F.C.', category: 'Libre', number: 11, position: 'Delantero', goals: 7, matchesPlayed: 8 },
  { id: 'p8', name: 'Gonzalo Vera', teamId: 'team-vecindad', teamName: 'La Vecindad F.C.', category: 'Libre', number: 5, position: 'Defensa', goals: 2, matchesPlayed: 8 },

  // Deportivo Sur
  { id: 'p9', name: 'Andrés Tobar', teamId: 'team-deportivo-leiva', teamName: 'Deportivo Sur', category: 'Libre', number: 10, position: 'Mediocampista', goals: 6, matchesPlayed: 8 },
  { id: 'p10', name: 'Felipe Caicedo Jr', teamId: 'team-deportivo-leiva', teamName: 'Deportivo Sur', category: 'Libre', number: 9, position: 'Delantero', goals: 9, matchesPlayed: 8 },

  // Cerveceros
  { id: 'p11', name: 'Esteban Paredes', teamId: 'team-cerveceros', teamName: 'Cerveceros F.C.', category: 'Libre', number: 20, position: 'Delantero', goals: 10, matchesPlayed: 8 },
  { id: 'p12', name: 'Kevin Quishpe', teamId: 'team-cerveceros', teamName: 'Cerveceros F.C.', category: 'Libre', number: 7, position: 'Mediocampista', goals: 5, matchesPlayed: 8 },

  // Naranjas
  { id: 'p13', name: 'Diego Maradona Jr', teamId: 'team-naranjas', teamName: 'Naranja Mecánica', category: 'Libre', number: 10, position: 'Mediocampista', goals: 7, matchesPlayed: 8 },

  // Leonas (Femenino)
  { id: 'p14', name: 'Diana Morán', teamId: 'team-leonas', teamName: 'Leonas de Leiva', category: 'Femenino', number: 10, position: 'Delantero', goals: 14, matchesPlayed: 6 },
  { id: 'p15', name: 'María Belén Arroyo', teamId: 'team-leonas', teamName: 'Leonas de Leiva', category: 'Femenino', number: 8, position: 'Mediocampista', goals: 5, matchesPlayed: 6 },

  // Amazonas
  { id: 'p16', name: 'Gabriela Romero', teamId: 'team-amazonas', teamName: 'Amazonas F.C.', category: 'Femenino', number: 9, position: 'Delantero', goals: 11, matchesPlayed: 6 },
  { id: 'p17', name: 'Camila Benítez', teamId: 'team-amazonas', teamName: 'Amazonas F.C.', category: 'Femenino', number: 7, position: 'Mediocampista', goals: 6, matchesPlayed: 6 },

  // Galaxy Fem
  { id: 'p18', name: 'Valeria Novoa', teamId: 'team-galaxy', teamName: 'Galaxy Fem', category: 'Femenino', number: 10, position: 'Mediocampista', goals: 8, matchesPlayed: 6 },
  { id: 'p19', name: 'Paula Dávila', teamId: 'team-galaxy', teamName: 'Galaxy Fem', category: 'Femenino', number: 11, position: 'Delantero', goals: 7, matchesPlayed: 6 }
];

export const INITIAL_MATCHES: Match[] = [
  // COPA ELITE LIBRE 2026 - JORNADA 1 (FINALIZADOS)
  {
    id: 'm1',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-leiva-fc',
    teamBId: 'team-vecindad',
    teamAName: 'Leiva FC',
    teamBName: 'La Vecindad F.C.',
    teamAScore: 3,
    teamBScore: 2,
    date: '2026-05-10',
    time: '18:00',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 1,
    events: [
      { id: 'e1_1', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Mateo Guerrero', minute: 12 },
      { id: 'e1_2', type: 'goal', teamId: 'team-vecindad', playerName: 'Ramón Valdés', minute: 28 },
      { id: 'e1_3', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Santiago Paz', minute: 45 },
      { id: 'e1_4', type: 'goal', teamId: 'team-vecindad', playerName: 'Ramón Valdés', minute: 61 },
      { id: 'e1_5', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Mateo Guerrero', minute: 82 },
      { id: 'e1_6', type: 'yellow_card', teamId: 'team-vecindad', playerName: 'Gonzalo Vera', minute: 34 }
    ]
  },
  {
    id: 'm2',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-deportivo-leiva',
    teamBId: 'team-cerveceros',
    teamAName: 'Deportivo Sur',
    teamBName: 'Cerveceros F.C.',
    teamAScore: 1,
    teamBScore: 1,
    date: '2026-05-10',
    time: '19:30',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 1,
    events: [
      { id: 'e2_1', type: 'goal', teamId: 'team-deportivo-leiva', playerName: 'Felipe Caicedo Jr', minute: 30 },
      { id: 'e2_2', type: 'goal', teamId: 'team-cerveceros', playerName: 'Esteban Paredes', minute: 75 }
    ]
  },
  {
    id: 'm3',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-naranjas',
    teamBId: 'team-cristal',
    teamAName: 'Naranja Mecánica',
    teamBName: 'Sporting Cristal Leiva',
    teamAScore: 2,
    teamBScore: 0,
    date: '2026-05-10',
    time: '21:00',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 1,
    events: [
      { id: 'e3_1', type: 'goal', teamId: 'team-naranjas', playerName: 'Diego Maradona Jr', minute: 15 },
      { id: 'e3_2', type: 'goal', teamId: 'team-naranjas', playerName: 'Diego Maradona Jr', minute: 55 }
    ]
  },

  // JORNADA 2 (FINALIZADOS)
  {
    id: 'm4',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-leiva-fc',
    teamBId: 'team-deportivo-leiva',
    teamAName: 'Leiva FC',
    teamBName: 'Deportivo Sur',
    teamAScore: 2,
    teamBScore: 2,
    date: '2026-05-17',
    time: '18:00',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 2,
    events: [
      { id: 'e4_1', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Mateo Guerrero', minute: 5 },
      { id: 'e4_2', type: 'goal', teamId: 'team-deportivo-leiva', playerName: 'Andrés Tobar', minute: 40 },
      { id: 'e4_3', type: 'goal', teamId: 'team-deportivo-leiva', playerName: 'Felipe Caicedo Jr', minute: 60 },
      { id: 'e4_4', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Santiago Paz', minute: 88 }
    ]
  },
  {
    id: 'm5',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-vecindad',
    teamBId: 'team-naranjas',
    teamAName: 'La Vecindad F.C.',
    teamBName: 'Naranja Mecánica',
    teamAScore: 4,
    teamBScore: 1,
    date: '2026-05-17',
    time: '19:30',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 2,
    events: [
      { id: 'e5_1', type: 'goal', teamId: 'team-vecindad', playerName: 'Ramón Valdés', minute: 14 },
      { id: 'e5_2', type: 'goal', teamId: 'team-vecindad', playerName: 'Alberto Medina', minute: 22 },
      { id: 'e5_3', type: 'goal', teamId: 'team-naranjas', playerName: 'Diego Maradona Jr', minute: 50 },
      { id: 'e5_4', type: 'goal', teamId: 'team-vecindad', playerName: 'Ramón Valdés', minute: 73 },
      { id: 'e5_5', type: 'goal', teamId: 'team-vecindad', playerName: 'Alberto Medina', minute: 85 }
    ]
  },
  {
    id: 'm6',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-cerveceros',
    teamBId: 'team-cristal',
    teamAName: 'Cerveceros F.C.',
    teamBName: 'Sporting Cristal Leiva',
    teamAScore: 3,
    teamBScore: 1,
    date: '2026-05-17',
    time: '21:00',
    pitch: 'Cancha Central 1',
    status: 'Finalizado',
    matchday: 2,
    events: [
      { id: 'e6_1', type: 'goal', teamId: 'team-cerveceros', playerName: 'Esteban Paredes', minute: 18 },
      { id: 'e6_2', type: 'goal', teamId: 'team-cristal', playerName: 'Luis Advíncula', minute: 44 },
      { id: 'e6_3', type: 'goal', teamId: 'team-cerveceros', playerName: 'Esteban Paredes', minute: 67 },
      { id: 'e6_4', type: 'goal', teamId: 'team-cerveceros', playerName: 'Kevin Quishpe', minute: 81 }
    ]
  },

  // JORNADA 3 (EN VIVO & PROGRAMADOS)
  {
    id: 'm7',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-leiva-fc',
    teamBId: 'team-naranjas',
    teamAName: 'Leiva FC',
    teamBName: 'Naranja Mecánica',
    teamAScore: 2,
    teamBScore: 1,
    date: '2026-07-06', // Hoy según local time 2026-07-06
    time: '15:00',
    pitch: 'Cancha Central 1',
    status: 'En vivo',
    matchday: 3,
    events: [
      { id: 'e7_1', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Mateo Guerrero', minute: 24 },
      { id: 'e7_2', type: 'goal', teamId: 'team-naranjas', playerName: 'Diego Maradona Jr', minute: 38 },
      { id: 'e7_3', type: 'goal', teamId: 'team-leiva-fc', playerName: 'Santiago Paz', minute: 52 },
      { id: 'e7_4', type: 'yellow_card', teamId: 'team-leiva-fc', playerName: 'Javier Calle', minute: 41 }
    ]
  },
  {
    id: 'm8',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-vecindad',
    teamBId: 'team-cerveceros',
    teamAName: 'La Vecindad F.C.',
    teamBName: 'Cerveceros F.C.',
    date: '2026-07-06',
    time: '17:00',
    pitch: 'Cancha Central 1',
    status: 'Programado',
    matchday: 3,
    events: []
  },
  {
    id: 'm9',
    tournamentId: 't-libre-2026',
    category: 'Libre',
    teamAId: 'team-deportivo-leiva',
    teamBId: 'team-cristal',
    teamAName: 'Deportivo Sur',
    teamBName: 'Sporting Cristal Leiva',
    date: '2026-07-06',
    time: '19:00',
    pitch: 'Cancha Central 2',
    status: 'Programado',
    matchday: 3,
    events: []
  },

  // COPA FEMENINA 2026 - JORNADA 1
  {
    id: 'mf1',
    tournamentId: 't-femenino-2026',
    category: 'Femenino',
    teamAId: 'team-leonas',
    teamBId: 'team-amazonas',
    teamAName: 'Leonas de Leiva',
    teamBName: 'Amazonas F.C.',
    teamAScore: 4,
    teamBScore: 2,
    date: '2026-06-01',
    time: '19:00',
    pitch: 'Cancha Sintética 3',
    status: 'Finalizado',
    matchday: 1,
    events: [
      { id: 'ef1_1', type: 'goal', teamId: 'team-leonas', playerName: 'Diana Morán', minute: 8 },
      { id: 'ef1_2', type: 'goal', teamId: 'team-leonas', playerName: 'Diana Morán', minute: 15 },
      { id: 'ef1_3', type: 'goal', teamId: 'team-amazonas', playerName: 'Gabriela Romero', minute: 22 },
      { id: 'ef1_4', type: 'goal', teamId: 'team-leonas', playerName: 'María Belén Arroyo', minute: 34 },
      { id: 'ef1_5', type: 'goal', teamId: 'team-amazonas', playerName: 'Camila Benítez', minute: 48 },
      { id: 'ef1_6', type: 'goal', teamId: 'team-leonas', playerName: 'Diana Morán', minute: 58 }
    ]
  },
  {
    id: 'mf2',
    tournamentId: 't-femenino-2026',
    category: 'Femenino',
    teamAId: 'team-galaxy',
    teamBId: 'team-valkirias',
    teamAName: 'Galaxy Fem',
    teamBName: 'Valkirias Leiva',
    teamAScore: 1,
    teamBScore: 0,
    date: '2026-06-01',
    time: '20:30',
    pitch: 'Cancha Sintética 3',
    status: 'Finalizado',
    matchday: 1,
    events: [
      { id: 'ef2_1', type: 'goal', teamId: 'team-galaxy', playerName: 'Valeria Novoa', minute: 19 }
    ]
  },
  // JORNADA 2 COPA FEMENINA (HOY/PRÓXIMO)
  {
    id: 'mf3',
    tournamentId: 't-femenino-2026',
    category: 'Femenino',
    teamAId: 'team-leonas',
    teamBId: 'team-galaxy',
    teamAName: 'Leonas de Leiva',
    teamBName: 'Galaxy Fem',
    date: '2026-07-07',
    time: '18:00',
    pitch: 'Cancha Sintética 3',
    status: 'Programado',
    matchday: 2,
    events: []
  },
  {
    id: 'mf4',
    tournamentId: 't-femenino-2026',
    category: 'Femenino',
    teamAId: 'team-amazonas',
    teamBId: 'team-valkirias',
    teamAName: 'Amazonas F.C.',
    teamBName: 'Valkirias Leiva',
    date: '2026-07-07',
    time: '19:30',
    pitch: 'Cancha Sintética 3',
    status: 'Programado',
    matchday: 2,
    events: []
  }
];

/**
 * Recalculates team standings based on a tournament, a category, and a list of matches and teams.
 */
export function calculateStandings(
  tournamentId: string,
  category: TournamentCategory,
  matches: Match[],
  teams: Team[]
): TeamStanding[] {
  // Filter teams of this category
  const filteredTeams = teams.filter((t) => t.category === category);
  
  // Initialize standings for all category teams
  const standingsMap: Record<string, TeamStanding> = {};
  filteredTeams.forEach((t) => {
    standingsMap[t.id] = {
      teamId: t.id,
      teamName: t.name,
      teamLogo: t.logo,
      color: t.color,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  // Filter matches of this tournament that are "Finalizado" or "En vivo" (optionally, but normally just Finalizado or also En Vivo scores if we want)
  // Let's count "Finalizado" and "En vivo" (usually positions only count final or live, let's count both if they have scores, but only Finalizado is standard, or let's count Finalizado + En vivo to make it look super reactive!)
  const scoredMatches = matches.filter(
    (m) =>
      m.tournamentId === tournamentId &&
      (m.status === 'Finalizado' || m.status === 'En vivo') &&
      m.teamAScore !== undefined &&
      m.teamBScore !== undefined
  );

  scoredMatches.forEach((m) => {
    const sA = standingsMap[m.teamAId];
    const sB = standingsMap[m.teamBId];

    // If matches have teams that aren't in this filtered category list, skip
    if (!sA || !sB) return;

    sA.played += 1;
    sB.played += 1;

    const scoreA = m.teamAScore ?? 0;
    const scoreB = m.teamBScore ?? 0;

    sA.goalsFor += scoreA;
    sA.goalsAgainst += scoreB;

    sB.goalsFor += scoreB;
    sB.goalsAgainst += scoreA;

    if (scoreA > scoreB) {
      sA.won += 1;
      sA.points += 3;
      sB.lost += 1;
    } else if (scoreA < scoreB) {
      sB.won += 1;
      sB.points += 3;
      sA.lost += 1;
    } else {
      sA.drawn += 1;
      sA.points += 1;
      sB.drawn += 1;
      sB.points += 1;
    }
  });

  // Calculate differences and convert to array
  const standingsList = Object.values(standingsMap).map((s) => {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
    return s;
  });

  // Sort: 1. Points, 2. GD, 3. GF, 4. Team Name
  return standingsList.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    return a.teamName.localeCompare(b.teamName);
  });
}

/**
 * Seed or retrieve full application state from localStorage
 */
export interface AppState {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
}

export function loadAppState(): AppState {
  try {
    const tournamentsStr = localStorage.getItem('leiva_tournaments');
    const teamsStr = localStorage.getItem('leiva_teams');
    const playersStr = localStorage.getItem('leiva_players');
    const matchesStr = localStorage.getItem('leiva_matches');

    if (tournamentsStr && teamsStr && playersStr && matchesStr) {
      return {
        tournaments: JSON.parse(tournamentsStr),
        teams: JSON.parse(teamsStr),
        players: JSON.parse(playersStr),
        matches: JSON.parse(matchesStr),
      };
    }
  } catch (error) {
    console.error('Failed to parse localStorage state:', error);
  }

  // Fallback to initial state and seed localStorage
  const defaultState: AppState = {
    tournaments: INITIAL_TOURNAMENTS,
    teams: INITIAL_TEAMS,
    players: INITIAL_PLAYERS,
    matches: INITIAL_MATCHES,
  };
  saveAppState(defaultState);
  return defaultState;
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem('leiva_tournaments', JSON.stringify(state.tournaments));
    localStorage.setItem('leiva_teams', JSON.stringify(state.teams));
    localStorage.setItem('leiva_players', JSON.stringify(state.players));
    localStorage.setItem('leiva_matches', JSON.stringify(state.matches));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}
