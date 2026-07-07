/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TournamentFormat = 'Liga' | 'Eliminación Directa' | 'Grupos';
export type TournamentStatus = 'Activo' | 'Finalizado' | 'Próximo';
export type MatchStatus = 'Programado' | 'En vivo' | 'Finalizado';
export type TournamentCategory = 'Sub-15' | 'Sub-20' | 'Libre' | 'Femenino' | 'Master';

export interface Tournament {
  id: string;
  name: string;
  category: TournamentCategory;
  startDate: string;
  endDate: string;
  format: TournamentFormat;
  status: TournamentStatus;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string; // Color preset or SVG icon name or URL
  category: TournamentCategory;
  founded: string;
  captain: string;
  description?: string;
  color: string; // Hex color or Tailwind class for branding
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  category: TournamentCategory;
  number: number;
  position: 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  goals: number;
  matchesPlayed: number;
  avatarUrl?: string;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card';
  teamId: string;
  playerName: string;
  minute: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  category: TournamentCategory;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamAScore?: number;
  teamBScore?: number;
  date: string;
  time: string;
  pitch: string; // Cancha de juego
  status: MatchStatus;
  matchday: number; // Jornada (1, 2, 3...)
  events: MatchEvent[];
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamLogo: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
