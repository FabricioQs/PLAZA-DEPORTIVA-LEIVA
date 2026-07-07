/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { AppState } from '../data/mockData';
import { Tournament, Team, Player, Match } from '../types';

// Read from import.meta.env for Vite React client
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};

// Create client lazy initializer to avoid crashing if credentials are not set
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
};

// SQL commands to generate tables in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- 1. TABLA DE TORNEOS
CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  format TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT
);

-- 2. TABLA DE EQUIPOS / CLUBES
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  category TEXT NOT NULL,
  founded TEXT NOT NULL,
  captain TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL
);

-- 3. TABLA DE JUGADORES
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "teamId" TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  "teamName" TEXT NOT NULL,
  category TEXT NOT NULL,
  number INTEGER NOT NULL,
  position TEXT NOT NULL,
  goals INTEGER NOT NULL DEFAULT 0,
  "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
  "avatarUrl" TEXT
);

-- 4. TABLA DE PARTIDOS Y JORNADAS
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  "tournamentId" TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  "teamAId" TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  "teamBId" TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  "teamAName" TEXT NOT NULL,
  "teamBName" TEXT NOT NULL,
  "teamAScore" INTEGER,
  "teamBScore" INTEGER,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  pitch TEXT NOT NULL,
  status TEXT NOT NULL,
  matchday INTEGER NOT NULL,
  events JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- HABILITAR SEGURIDAD (RLS) O PERMISOS PARA PRUEBAS (LECTURA/ESCRITURA LIBRE)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anonimos en tournaments" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en matches" ON matches FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Fetch entire state from Supabase
 */
export async function fetchStateFromSupabase(): Promise<AppState | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  // Parallel fetch for speed
  const [
    { data: tournaments, error: tErr },
    { data: teams, error: tmErr },
    { data: players, error: pErr },
    { data: matches, error: mErr }
  ] = await Promise.all([
    client.from('tournaments').select('*'),
    client.from('teams').select('*'),
    client.from('players').select('*'),
    client.from('matches').select('*')
  ]);

  if (tErr || tmErr || pErr || mErr) {
    const primaryError = tErr || tmErr || pErr || mErr;
    console.warn('Supabase fetch details:', { tErr, tmErr, pErr, mErr });
    const err = new Error(primaryError?.message || 'Error al consultar Supabase');
    (err as any).code = primaryError?.code;
    throw err;
  }

  return {
    tournaments: tournaments || [],
    teams: teams || [],
    players: players || [],
    matches: matches || []
  };
}

/**
 * Sync entire state to Supabase by batch upserting
 */
export async function syncStateToSupabase(state: AppState): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Perform bulk upsert for active elements
    const promises = [];

    if (state.tournaments.length > 0) {
      promises.push(client.from('tournaments').upsert(state.tournaments));
    }
    if (state.teams.length > 0) {
      promises.push(client.from('teams').upsert(state.teams));
    }
    if (state.players.length > 0) {
      promises.push(client.from('players').upsert(state.players));
    }
    if (state.matches.length > 0) {
      promises.push(client.from('matches').upsert(state.matches));
    }

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.warn('Error syncing state to Supabase:', error);
    return false;
  }
}

/**
 * Sync single item (Create or Update)
 */
export async function syncSingleItemToSupabase(table: string, item: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(table).upsert(item);
    if (error) {
      console.warn(`Error saving to table ${table}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`Failed to sync to ${table}:`, error);
    return false;
  }
}

/**
 * Delete single item
 */
export async function deleteSingleItemFromSupabase(table: string, id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`Error deleting from table ${table}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`Failed to delete from ${table}:`, error);
    return false;
  }
}
