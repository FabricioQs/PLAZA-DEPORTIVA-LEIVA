/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Trophy,
  Users,
  UserPlus,
  PlusCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Award,
  Activity,
  PlusSquare,
  Sparkles,
  Info,
  Database,
  Copy
} from 'lucide-react';
import { Tournament, Team, Player, Match, TournamentCategory, TournamentFormat, TournamentStatus, MatchStatus, MatchEvent } from '../types';
import { SUPABASE_SQL_SCHEMA, syncStateToSupabase } from '../lib/supabase';

interface AdminViewProps {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  onUpdateState: (newState: {
    tournaments: Tournament[];
    teams: Team[];
    players: Player[];
    matches: Match[];
  }) => void;
  isSupaConfigured: boolean;
  isSupaActive: boolean;
  loadingSupa: boolean;
  supaError: string | null;
  onRefreshSupa: () => Promise<void>;
}

type AdminTab = 'results' | 'tournaments' | 'teams' | 'players' | 'supabase';

export default function AdminView({
  tournaments,
  teams,
  players,
  matches,
  onUpdateState,
  isSupaConfigured,
  isSupaActive,
  loadingSupa,
  supaError,
  onRefreshSupa,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('results');

  // FORM STATES
  // Tournament Form
  const [tName, setTName] = useState('');
  const [tCategory, setTCategory] = useState<TournamentCategory>('Libre');
  const [tFormat, setTFormat] = useState<TournamentFormat>('Liga');
  const [tStatus, setTStatus] = useState<TournamentStatus>('Activo');
  const [tStartDate, setTStartDate] = useState('2026-07-06');
  const [tEndDate, setTEndDate] = useState('2026-09-30');
  const [tDesc, setTDesc] = useState('');

  // Team Form
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('⚽');
  const [teamCategory, setTeamCategory] = useState<TournamentCategory>('Libre');
  const [teamFounded, setTeamFounded] = useState('2026');
  const [teamCaptain, setTeamCaptain] = useState('');
  const [teamColor, setTeamColor] = useState('#4CAF50');
  const [teamDesc, setTeamDesc] = useState('');

  // Player Form
  const [pName, setPName] = useState('');
  const [pTeamId, setPTeamId] = useState('');
  const [pCategory, setPCategory] = useState<TournamentCategory>('Libre');
  const [pNumber, setPNumber] = useState<number>(10);
  const [pPosition, setPPosition] = useState<'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero'>('Delantero');
  const [pGoals, setPGoals] = useState<number>(0);
  const [pMatchesPlayed, setPMatchesPlayed] = useState<number>(0);

  // MATCH EDITOR STATES
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('Programado');
  const [eventPlayerName, setEventPlayerName] = useState('');
  const [eventType, setEventType] = useState<'goal' | 'yellow_card' | 'red_card'>('goal');
  const [eventMinute, setEventMinute] = useState<number>(45);
  const [eventTeamId, setEventTeamId] = useState('');

  // Brand colors preset for team builder
  const COLOR_PRESETS = [
    '#4CAF50', // Emerald Leiva Green
    '#1A1A1A', // Charcoal Black
    '#E11D48', // Red
    '#2563EB', // Blue
    '#D97706', // Gold/Amber
    '#7C3AED', // Purple
    '#0891B2', // Cyan
    '#EA580C', // Orange
    '#DB2777', // Pink
  ];

  // LOGIC TO CREATE TOURNAMENT
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) return;

    const newTournament: Tournament = {
      id: `t-${Date.now()}`,
      name: tName,
      category: tCategory,
      startDate: tStartDate,
      endDate: tEndDate,
      format: tFormat,
      status: tStatus,
      description: tDesc,
    };

    onUpdateState({
      tournaments: [newTournament, ...tournaments],
      teams,
      players,
      matches,
    });

    // Clear form
    setTName('');
    setTDesc('');
    alert('Torneo creado exitosamente.');
  };

  // LOGIC TO DELETE TOURNAMENT
  const handleDeleteTournament = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este torneo? Se borrarán sus estadísticas relativas.')) {
      onUpdateState({
        tournaments: tournaments.filter((t) => t.id !== id),
        teams,
        players,
        matches: matches.filter((m) => m.tournamentId !== id),
      });
    }
  };

  // LOGIC TO CREATE TEAM
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      logo: teamLogo,
      category: teamCategory,
      founded: teamFounded,
      captain: teamCaptain || 'Sin Asignar',
      color: teamColor,
      description: teamDesc,
    };

    onUpdateState({
      tournaments,
      teams: [newTeam, ...teams],
      players,
      matches,
    });

    setTeamName('');
    setTeamCaptain('');
    setTeamDesc('');
    alert('Equipo registrado exitosamente.');
  };

  // LOGIC TO DELETE TEAM
  const handleDeleteTeam = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo? Se borrarán sus jugadores asociados.')) {
      onUpdateState({
        tournaments,
        teams: teams.filter((t) => t.id !== id),
        players: players.filter((p) => p.teamId !== id),
        matches: matches.filter((m) => m.teamAId !== id && m.teamBId !== id),
      });
    }
  };

  // LOGIC TO CREATE PLAYER
  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pTeamId) return;

    const selectedTeamObj = teams.find((t) => t.id === pTeamId);

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: pName,
      teamId: pTeamId,
      teamName: selectedTeamObj ? selectedTeamObj.name : 'Equipo Desconocido',
      category: pCategory,
      number: pNumber,
      position: pPosition,
      goals: Number(pGoals),
      matchesPlayed: Number(pMatchesPlayed),
    };

    onUpdateState({
      tournaments,
      teams,
      players: [newPlayer, ...players],
      matches,
    });

    setPName('');
    setPGoals(0);
    setPMatchesPlayed(0);
    alert('Jugador registrado exitosamente.');
  };

  // LOGIC TO DELETE PLAYER
  const handleDeletePlayer = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
      onUpdateState({
        tournaments,
        teams,
        players: players.filter((p) => p.id !== id),
        matches,
      });
    }
  };

  // MATCH EDITOR SELECTION
  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const matchTeamAPlayers = useMemo(() => {
    if (!selectedMatch) return [];
    return players.filter((p) => p.teamId === selectedMatch.teamAId);
  }, [selectedMatch, players]);

  const matchTeamBPlayers = useMemo(() => {
    if (!selectedMatch) return [];
    return players.filter((p) => p.teamId === selectedMatch.teamBId);
  }, [selectedMatch, players]);

  const handleSelectMatchToEdit = (match: Match) => {
    setSelectedMatchId(match.id);
    setScoreA(match.teamAScore ?? 0);
    setScoreB(match.teamBScore ?? 0);
    setMatchStatus(match.status);
    setEventPlayerName('');
    if (matchTeamAPlayers.length > 0) {
      setEventPlayerName(matchTeamAPlayers[0].name);
      setEventTeamId(match.teamAId);
    } else if (matchTeamBPlayers.length > 0) {
      setEventPlayerName(matchTeamBPlayers[0].name);
      setEventTeamId(match.teamBId);
    }
  };

  // SAVE MATCH SCORE AND STATUS
  const handleSaveMatchResult = () => {
    if (!selectedMatch) return;

    const previousStatus = selectedMatch.status;

    // Check if status changed to Finalizado from non-Finalizado to update player matches counts!
    let updatedPlayers = [...players];
    if (matchStatus === 'Finalizado' && previousStatus !== 'Finalizado') {
      // Increment matches played for all players in both rosters
      updatedPlayers = players.map((p) => {
        if (p.teamId === selectedMatch.teamAId || p.teamId === selectedMatch.teamBId) {
          return { ...p, matchesPlayed: p.matchesPlayed + 1 };
        }
        return p;
      });
    }

    const updatedMatches = matches.map((m) => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          teamAScore: scoreA,
          teamBScore: scoreB,
          status: matchStatus,
        };
      }
      return m;
    });

    onUpdateState({
      tournaments,
      teams,
      players: updatedPlayers,
      matches: updatedMatches,
    });

    alert('Marcador guardado exitosamente.');
  };

  // ADD EVENT TO MATCH (Goals, Cards)
  const handleAddMatchEvent = () => {
    if (!selectedMatch || !eventPlayerName) return;

    const newEvent: MatchEvent = {
      id: `evt-${Date.now()}`,
      type: eventType,
      teamId: eventTeamId,
      playerName: eventPlayerName,
      minute: Number(eventMinute),
    };

    // Reactively update player stats if it is a goal!
    let updatedPlayers = [...players];
    if (eventType === 'goal') {
      updatedPlayers = players.map((p) => {
        if (p.name === eventPlayerName && p.teamId === eventTeamId) {
          return { ...p, goals: p.goals + 1 };
        }
        return p;
      });

      // Update match scores automatically when goal event is added
      if (eventTeamId === selectedMatch.teamAId) {
        setScoreA((prev) => prev + 1);
      } else {
        setScoreB((prev) => prev + 1);
      }
    }

    const updatedMatches = matches.map((m) => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          events: [...m.events, newEvent],
          // Sync scores immediately
          teamAScore: eventTeamId === selectedMatch.teamAId && eventType === 'goal' ? (m.teamAScore ?? 0) + 1 : m.teamAScore,
          teamBScore: eventTeamId === selectedMatch.teamBId && eventType === 'goal' ? (m.teamBScore ?? 0) + 1 : m.teamBScore,
        };
      }
      return m;
    });

    onUpdateState({
      tournaments,
      teams,
      players: updatedPlayers,
      matches: updatedMatches,
    });

    alert('Incidencia guardada.');
  };

  // REMOVE EVENT FROM MATCH
  const handleRemoveEvent = (eventId: string, event: MatchEvent) => {
    if (!selectedMatch) return;

    // Reactively deduct goal if deleting a goal event
    let updatedPlayers = [...players];
    if (event.type === 'goal') {
      updatedPlayers = players.map((p) => {
        if (p.name === event.playerName && p.teamId === event.teamId) {
          return { ...p, goals: Math.max(0, p.goals - 1) };
        }
        return p;
      });

      // Sync local score counters
      if (event.teamId === selectedMatch.teamAId) {
        setScoreA((prev) => Math.max(0, prev - 1));
      } else {
        setScoreB((prev) => Math.max(0, prev - 1));
      }
    }

    const updatedMatches = matches.map((m) => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          events: m.events.filter((e) => e.id !== eventId),
          teamAScore: event.teamId === selectedMatch.teamAId && event.type === 'goal' ? Math.max(0, (m.teamAScore ?? 1) - 1) : m.teamAScore,
          teamBScore: event.teamId === selectedMatch.teamBId && event.type === 'goal' ? Math.max(0, (m.teamBScore ?? 1) - 1) : m.teamBScore,
        };
      }
      return m;
    });

    onUpdateState({
      tournaments,
      teams,
      players: updatedPlayers,
      matches: updatedMatches,
    });
  };

  // BULK GENERATE MATCHDAY MATCHES HELPER (For prototype ease)
  const handleGenerateMatchesForTournament = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;

    const tTeams = teams.filter((t) => t.category === tournament.category);
    if (tTeams.length < 2) {
      alert('Se requieren al menos 2 equipos inscritos en esta categoría para generar fixture.');
      return;
    }

    // Generate simple Round Robin match list (Jornada 1)
    const newMatches: Match[] = [];
    let matchCounter = 1;

    for (let i = 0; i < tTeams.length; i++) {
      for (let j = i + 1; j < tTeams.length; j++) {
        newMatches.push({
          id: `m-gen-${Date.now()}-${matchCounter++}`,
          tournamentId: tournament.id,
          category: tournament.category,
          teamAId: tTeams[i].id,
          teamBId: tTeams[j].id,
          teamAName: tTeams[i].name,
          teamBName: tTeams[j].name,
          date: '2026-07-15',
          time: '19:00',
          pitch: 'Cancha Central 1',
          status: 'Programado',
          matchday: 1,
          events: [],
        });
      }
    }

    onUpdateState({
      tournaments,
      teams,
      players,
      matches: [...matches, ...newMatches],
    });

    alert(`Se generaron exitosamente ${newMatches.length} partidos programados de la Jornada 1 para el torneo.`);
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
        <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20 text-brand-green">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-wide">
            Panel de Administración
          </h1>
          <p className="text-sm text-zinc-400">
            Administración completa de competiciones, planteles de equipos, estadísticas y tableros.
          </p>
        </div>
      </div>

      {/* ADMIN VIEW TABS */}
      <div className="flex border-b border-zinc-800/80 gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'results', label: 'Cargar Resultados', icon: Activity },
          { id: 'tournaments', label: 'Gestión de Torneos', icon: Trophy },
          { id: 'teams', label: 'Gestión de Equipos', icon: Users },
          { id: 'players', label: 'Gestión de Jugadores', icon: UserPlus },
          { id: 'supabase', label: 'Conexión Supabase', icon: Database },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`btn-admin-tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedMatchId(null);
              }}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-display font-bold text-xs tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* RENDER CURRENT ADMIN VIEW TAB */}
      <div>
        {/* TAB 1: RESULTS LOADER (MATCH SCORING) */}
        {activeTab === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List of matches to score */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-base">Fixture Registrado</h3>
                  <p className="text-xxs text-zinc-400">Haz clic en un partido para modificar sus marcadores e incidencias.</p>
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {matches.map((m) => {
                  const isSelected = selectedMatchId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMatchToEdit(m)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-green bg-brand-green/3'
                          : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xxs text-zinc-500 font-mono">
                        <span>JORNADA {m.matchday} • Cat. {m.category}</span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded ${
                            m.status === 'En vivo'
                              ? 'bg-red-500/15 text-red-500'
                              : m.status === 'Finalizado'
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-brand-green/15 text-brand-green'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 items-center py-2 text-xs">
                        <span className="col-span-3 text-right text-white font-bold truncate">{m.teamAName}</span>
                        <span className="col-span-1 text-center font-display font-black text-brand-green bg-black/40 py-1 rounded mx-2">
                          {m.status === 'Programado' ? '-' : m.teamAScore}
                        </span>
                        <span className="col-span-1 text-center font-display font-black text-brand-green bg-black/40 py-1 rounded mx-2">
                          {m.status === 'Programado' ? '-' : m.teamBScore}
                        </span>
                        <span className="col-span-3 text-left text-white font-bold truncate">{m.teamBName}</span>
                      </div>

                      <div className="text-[10px] text-zinc-500 flex justify-between font-mono pt-1.5 border-t border-zinc-800/40">
                        <span>{m.date}</span>
                        <span>{m.pitch}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Match editor panel */}
            <div className="lg:col-span-7">
              {selectedMatch ? (
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-6">
                  {/* Selected Match banner */}
                  <div className="border-b border-zinc-800 pb-4 text-center">
                    <span className="text-xxs text-brand-green font-mono uppercase tracking-widest font-bold">
                      MODO EDICIÓN DE RESULTADO
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-white mt-1">
                      {selectedMatch.teamAName} vs {selectedMatch.teamBName}
                    </h3>
                  </div>

                  {/* SCORE INCREMENTERS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Team A Score */}
                    <div className="bg-black/30 p-4 rounded-xl border border-zinc-800/60 text-center space-y-2">
                      <span className="text-xxs text-zinc-500 block uppercase font-mono truncate">{selectedMatch.teamAName}</span>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          id="btn-admin-scoreA-dec"
                          onClick={() => setScoreA((prev) => Math.max(0, prev - 1))}
                          className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-3xl font-display font-black text-brand-green">{scoreA}</span>
                        <button
                          id="btn-admin-scoreA-inc"
                          onClick={() => setScoreA((prev) => prev + 1)}
                          className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Match Status */}
                    <div className="space-y-2 text-center">
                      <label className="text-xs text-zinc-500 uppercase font-mono block">Estado del Partido</label>
                      <select
                        id="select-admin-match-status"
                        value={matchStatus}
                        onChange={(e) => setMatchStatus(e.target.value as MatchStatus)}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand-green cursor-pointer"
                      >
                        <option value="Programado">Programado</option>
                        <option value="En vivo">En vivo</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>

                      <button
                        id="btn-admin-save-score"
                        onClick={handleSaveMatchResult}
                        className="w-full mt-4 px-4 py-2.5 rounded-lg bg-brand-green hover:bg-brand-green-dark text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" /> Guardar Marcador
                      </button>
                    </div>

                    {/* Team B Score */}
                    <div className="bg-black/30 p-4 rounded-xl border border-zinc-800/60 text-center space-y-2">
                      <span className="text-xxs text-zinc-500 block uppercase font-mono truncate">{selectedMatch.teamBName}</span>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          id="btn-admin-scoreB-dec"
                          onClick={() => setScoreB((prev) => Math.max(0, prev - 1))}
                          className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-3xl font-display font-black text-brand-green">{scoreB}</span>
                        <button
                          id="btn-admin-scoreB-inc"
                          onClick={() => setScoreB((prev) => prev + 1)}
                          className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* INCIDENTS BUILDER / EVENTS LIST */}
                  <div className="border-t border-zinc-800 pt-6 space-y-4">
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <PlusSquare className="w-4 h-4 text-brand-green" /> Cargar Incidencia Directa (Goles/Tarjetas)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/30 p-4 rounded-xl border border-zinc-800/60">
                      {/* Select Team */}
                      <div>
                        <label className="text-xxs text-zinc-500 block uppercase font-mono mb-1">Equipo</label>
                        <select
                          id="select-admin-event-team"
                          value={eventTeamId}
                          onChange={(e) => {
                            setEventTeamId(e.target.value);
                            // Auto select first player of that team
                            const teamPlayers = players.filter((p) => p.teamId === e.target.value);
                            if (teamPlayers.length > 0) setEventPlayerName(teamPlayers[0].name);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white cursor-pointer"
                        >
                          <option value={selectedMatch.teamAId}>{selectedMatch.teamAName}</option>
                          <option value={selectedMatch.teamBId}>{selectedMatch.teamBName}</option>
                        </select>
                      </div>

                      {/* Select Player (Dynamic list of team) */}
                      <div>
                        <label className="text-xxs text-zinc-500 block uppercase font-mono mb-1">Jugador</label>
                        <select
                          id="select-admin-event-player"
                          value={eventPlayerName}
                          onChange={(e) => setEventPlayerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white cursor-pointer"
                        >
                          {(eventTeamId === selectedMatch.teamAId ? matchTeamAPlayers : matchTeamBPlayers).map((p) => (
                            <option key={p.id} value={p.name}>N° {p.number} - {p.name}</option>
                          ))}
                          {(eventTeamId === selectedMatch.teamAId ? matchTeamAPlayers : matchTeamBPlayers).length === 0 && (
                            <option value="">No hay jugadores inscritos</option>
                          )}
                        </select>
                      </div>

                      {/* Select Event Type */}
                      <div>
                        <label className="text-xxs text-zinc-500 block uppercase font-mono mb-1">Suceso</label>
                        <select
                          id="select-admin-event-type"
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white cursor-pointer"
                        >
                          <option value="goal">⚽ Gol Marcado</option>
                          <option value="yellow_card">🟨 Tarjeta Amarilla</option>
                          <option value="red_card">🟥 Tarjeta Roja</option>
                        </select>
                      </div>

                      {/* Minute & Button */}
                      <div className="flex items-end gap-2">
                        <div className="w-20">
                          <label className="text-xxs text-zinc-500 block uppercase font-mono mb-1">Minuto</label>
                          <input
                            id="input-admin-event-minute"
                            type="number"
                            min="1"
                            max="120"
                            value={eventMinute}
                            onChange={(e) => setEventMinute(Number(e.target.value))}
                            className="w-full px-2 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white focus:outline-none text-center"
                          />
                        </div>
                        <button
                          id="btn-admin-add-event"
                          onClick={handleAddMatchEvent}
                          className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer h-9 text-center"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>

                    {/* Current Events list */}
                    <div className="space-y-2">
                      <h5 className="text-xxs text-zinc-500 uppercase font-mono font-bold">Listado de Sucesos en el Partido</h5>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {selectedMatch.events.map((evt) => (
                          <div
                            key={evt.id}
                            className="p-2 rounded bg-black/40 border border-zinc-800/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-brand-green font-bold">{evt.minute}'</span>
                              <span>{evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : '🟥'}</span>
                              <strong className="text-zinc-200">{evt.playerName}</strong>
                              <span className="text-zinc-500">({evt.teamId === selectedMatch.teamAId ? selectedMatch.teamAName : selectedMatch.teamBName})</span>
                            </div>
                            <button
                              id={`btn-admin-remove-event-${evt.id}`}
                              onClick={() => handleRemoveEvent(evt.id, evt)}
                              className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {selectedMatch.events.length === 0 && (
                          <p className="text-xs text-zinc-600 italic">No hay sucesos registrados todavía.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 rounded-2xl bg-zinc-900/10 border border-zinc-800 border-dashed text-center text-zinc-500 h-full flex flex-col items-center justify-center space-y-3">
                  <Activity className="w-10 h-10 text-zinc-700 animate-pulse" />
                  <h4 className="font-display font-bold text-zinc-400">Selecciona un partido del fixture</h4>
                  <p className="text-xs max-w-xs leading-relaxed">
                    Para registrar anotaciones de goles, sanciones con tarjetas y cambiar el estado del partido en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TOURNAMENTS CREATOR */}
        {activeTab === 'tournaments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleCreateTournament} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-brand-green" /> Crear Nuevo Torneo
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Nombre del Torneo</label>
                    <input
                      id="input-form-tournament-name"
                      type="text"
                      placeholder="Ej. Copa Oro Plaza Leiva 2026"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Categoría</label>
                      <select
                        id="select-form-tournament-category"
                        value={tCategory}
                        onChange={(e) => setTCategory(e.target.value as TournamentCategory)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="Libre">Libre</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Sub-15">Sub-15</option>
                        <option value="Sub-20">Sub-20</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Formato</label>
                      <select
                        id="select-form-tournament-format"
                        value={tFormat}
                        onChange={(e) => setTFormat(e.target.value as TournamentFormat)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="Liga">Liga de Puntos</option>
                        <option value="Eliminación Directa">Eliminación Directa</option>
                        <option value="Grupos">Fase de Grupos</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Fecha de Inicio</label>
                      <input
                        id="input-form-tournament-start"
                        type="date"
                        value={tStartDate}
                        onChange={(e) => setTStartDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Fecha de Fin</label>
                      <input
                        id="input-form-tournament-end"
                        type="date"
                        value={tEndDate}
                        onChange={(e) => setTEndDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Estado Inicial</label>
                    <select
                      id="select-form-tournament-status"
                      value={tStatus}
                      onChange={(e) => setTStatus(e.target.value as TournamentStatus)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                    >
                      <option value="Activo">Activo (En progreso)</option>
                      <option value="Próximo">Próximo (Inscripciones)</option>
                      <option value="Finalizado">Finalizado (Terminado)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Descripción / Leyendas</label>
                    <textarea
                      id="input-form-tournament-desc"
                      placeholder="Escribe detalles del campeonato, premios, etc."
                      value={tDesc}
                      onChange={(e) => setTDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green text-sm"
                    />
                  </div>
                </div>

                <button
                  id="btn-form-tournament-submit"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold uppercase text-xs tracking-wider cursor-pointer shadow"
                >
                  Confirmar Registro
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-white text-base">Torneos Registrados ({tournaments.length})</h3>
              <div className="space-y-3">
                {tournaments.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-brand-green/15 text-brand-green text-xxs font-bold uppercase">{t.status}</span>
                        <span className="text-zinc-500 font-mono text-xxs">CAT. {t.category}</span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm">{t.name}</h4>
                      <p className="text-xxs text-zinc-500 mt-0.5 font-mono">Formato: {t.format} • {t.startDate} al {t.endDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-admin-generate-matches-${t.id}`}
                        onClick={() => handleGenerateMatchesForTournament(t.id)}
                        title="Generar Calendario de Ejemplo"
                        className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-brand-green border border-zinc-700 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-admin-delete-tournament-${t.id}`}
                        onClick={() => handleDeleteTournament(t.id)}
                        className="p-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border border-rose-500/20 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAMS CREATOR */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleCreateTeam} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-brand-green" /> Registrar Club / Equipo
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Nombre del Equipo</label>
                    <input
                      id="input-form-team-name"
                      type="text"
                      placeholder="Ej. Real Madrid F.S."
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Escudo / Logo del Club</label>
                      <div className="flex items-center gap-2">
                        {/* Preview */}
                        <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                          {teamLogo && (teamLogo.startsWith('http') || teamLogo.startsWith('data:image')) ? (
                            <img src={teamLogo} alt="Preview" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                          ) : (
                            teamLogo || '⚽'
                          )}
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-1">
                          {/* File input (invisible) */}
                          <input
                            type="file"
                            id="input-form-team-file-logo"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  alert('La imagen es demasiado grande. El límite es de 2MB para evitar exceso de almacenamiento.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setTeamLogo(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            id="btn-upload-file-logo"
                            onClick={() => document.getElementById('input-form-team-file-logo')?.click()}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 border border-zinc-700/60 cursor-pointer text-center select-none"
                          >
                            📷 Subir Foto
                          </button>
                          
                          <input
                            id="input-form-team-logo"
                            type="text"
                            placeholder="Emoji, link o Base64..."
                            value={teamLogo.startsWith('data:image') ? 'Foto Cargada (Base64)' : teamLogo}
                            onChange={(e) => setTeamLogo(e.target.value)}
                            className="w-full px-2 py-1 rounded-lg bg-black border border-zinc-800 text-xxs text-zinc-300 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Categoría</label>
                      <select
                        id="select-form-team-category"
                        value={teamCategory}
                        onChange={(e) => setTeamCategory(e.target.value as TournamentCategory)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="Libre">Libre</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Sub-15">Sub-15</option>
                        <option value="Sub-20">Sub-20</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Año de Fundación</label>
                      <input
                        id="input-form-team-founded"
                        type="text"
                        value={teamFounded}
                        onChange={(e) => setTeamFounded(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Capitán Delegado</label>
                      <input
                        id="input-form-team-captain"
                        type="text"
                        placeholder="Nombre completo"
                        value={teamCaptain}
                        onChange={(e) => setTeamCaptain(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Brand Color Selector */}
                  <div>
                    <label className="text-zinc-400 block mb-1">Color Oficial del Club</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          id={`btn-form-color-${color.replace('#', '')}`}
                          onClick={() => setTeamColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            teamColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        id="input-form-team-color-picker"
                        type="color"
                        value={teamColor}
                        onChange={(e) => setTeamColor(e.target.value)}
                        className="w-8 h-8 rounded-full border-none cursor-pointer overflow-hidden p-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Descripción del Club</label>
                    <textarea
                      id="input-form-team-desc"
                      placeholder="Detalles sobre la hinchada, historia o metas..."
                      value={teamDesc}
                      onChange={(e) => setTeamDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green text-sm"
                    />
                  </div>
                </div>

                <button
                  id="btn-form-team-submit"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold uppercase text-xs tracking-wider cursor-pointer shadow"
                >
                  Registrar Club
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-white text-base">Clubes Registrados ({teams.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 w-1"
                      style={{ backgroundColor: team.color }}
                    />
                    <div className="pl-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800/80 flex items-center justify-center text-lg overflow-hidden shrink-0">
                        {team.logo && (team.logo.startsWith('http') || team.logo.startsWith('data:image')) ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                        ) : (
                          team.logo || '⚽'
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-sm leading-tight">
                          {team.name}
                        </h4>
                        <p className="text-xxs text-zinc-500 font-mono mt-0.5 uppercase">Cat. {team.category} • Cap. {team.captain}</p>
                      </div>
                    </div>

                    <button
                      id={`btn-admin-delete-team-${team.id}`}
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border border-rose-500/20 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PLAYERS CREATOR */}
        {activeTab === 'players' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleCreatePlayer} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-brand-green" /> Inscribir Jugador en Ficha
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Nombre Completo</label>
                    <input
                      id="input-form-player-name"
                      type="text"
                      placeholder="Nombre y Apellido"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-brand-green text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Categoría</label>
                      <select
                        id="select-form-player-category"
                        value={pCategory}
                        onChange={(e) => {
                          setPCategory(e.target.value as TournamentCategory);
                          setPTeamId(''); // reset team selection
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="Libre">Libre</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Sub-15">Sub-15</option>
                        <option value="Sub-20">Sub-20</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Asignar Equipo</label>
                      <select
                        id="select-form-player-team"
                        value={pTeamId}
                        onChange={(e) => setPTeamId(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="">Seleccionar Equipo</option>
                        {teams
                          .filter((t) => t.category === pCategory)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.logo} {t.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Número de Camiseta</label>
                      <input
                        id="input-form-player-number"
                        type="number"
                        value={pNumber}
                        onChange={(e) => setPNumber(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Posición de Juego</label>
                      <select
                        id="select-form-player-position"
                        value={pPosition}
                        onChange={(e) => setPPosition(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-white cursor-pointer"
                      >
                        <option value="Delantero">Delantero</option>
                        <option value="Mediocampista">Mediocampista</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Portero">Portero</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-zinc-800/60">
                    <div>
                      <label className="text-zinc-500 block mb-1">Goles Iniciales</label>
                      <input
                        id="input-form-player-goals"
                        type="number"
                        value={pGoals}
                        onChange={(e) => setPGoals(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-center"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Partidos Jugados</label>
                      <input
                        id="input-form-player-played"
                        type="number"
                        value={pMatchesPlayed}
                        onChange={(e) => setPMatchesPlayed(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-center"
                      />
                    </div>
                  </div>
                </div>

                <button
                  id="btn-form-player-submit"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold uppercase text-xs tracking-wider cursor-pointer shadow"
                >
                  Fichar Jugador
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-white text-base">Fichas de Jugadores ({players.length})</h3>
              <div className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 text-xs max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 text-zinc-500 font-display uppercase text-xxs tracking-wider border-b border-zinc-800">
                      <th className="py-3 px-4">Jugador</th>
                      <th className="py-3 px-4">Club asignado</th>
                      <th className="py-3 px-4 text-center">Goles</th>
                      <th className="py-3 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-zinc-800/10">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-white block font-display text-sm">{player.name}</span>
                            <span className="text-xxs text-zinc-500 font-mono uppercase">N° {player.number} • {player.position}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-zinc-300">{player.teamName}</span>
                          <span className="text-xxs text-zinc-500 font-mono block uppercase">Cat. {player.category}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-brand-gold font-display text-sm">{player.goals}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            id={`btn-admin-delete-player-${player.id}`}
                            onClick={() => handleDeletePlayer(player.id)}
                            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border border-rose-500/20 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUPABASE INTEGRATION BOARD */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            {/* Status cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isSupaActive 
                      ? 'bg-brand-green/10 border-brand-green/20 text-brand-green' 
                      : isSupaConfigured 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">Estado de Base de Datos Cloud</h3>
                    <p className="text-xs text-zinc-400">Canal de sincronización de datos con tu cuenta de Supabase.</p>
                  </div>
                </div>

                <div className="pt-2">
                  {isSupaActive ? (
                    <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/10 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-brand-green font-bold uppercase tracking-wider font-mono">
                        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                        Conectado Exitosamente
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        Tu aplicación está completamente enlazada con tu instancia de <strong>Supabase</strong>. 
                        Todos los cambios en torneos, planillas de equipos, fixture e incidencias de partidos se guardan y sincronizan en la nube en tiempo real.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-[11px] text-zinc-500">
                        <div className="bg-black/40 p-2 rounded-lg border border-zinc-800">Torneos: <span className="text-white font-bold">{tournaments.length}</span></div>
                        <div className="bg-black/40 p-2 rounded-lg border border-zinc-800">Equipos: <span className="text-white font-bold">{teams.length}</span></div>
                        <div className="bg-black/40 p-2 rounded-lg border border-zinc-800">Jugadores: <span className="text-white font-bold">{players.length}</span></div>
                        <div className="bg-black/40 p-2 rounded-lg border border-zinc-800">Partidos: <span className="text-white font-bold">{matches.length}</span></div>
                      </div>
                    </div>
                  ) : isSupaConfigured ? (
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider font-mono">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Error de Sincronización
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        Se ingresaron credenciales pero falló la comunicación. {supaError || 'Verifica la consola para más detalles.'}
                      </p>
                      <p className="text-zinc-500 leading-relaxed">
                        <strong>Causa común:</strong> ¿Creaste las tablas usando el script SQL que se muestra a la derecha? Sin estas tablas, la base de datos rechazará las peticiones.
                      </p>
                      <button
                        id="btn-supa-retry"
                        onClick={onRefreshSupa}
                        disabled={loadingSupa}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border border-zinc-700/20"
                      >
                        {loadingSupa ? 'Reintentando...' : '🔄 Reintentar Conexión'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider font-mono">
                        <span>ℹ️</span> Modo Local (LocalStorage) Activo
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        Actualmente el sistema está operando de manera aislada utilizando la memoria local de tu navegador. 
                        Tus cambios se guardarán localmente, pero no se compartirán en la nube hasta que configures tu propia base de datos Supabase.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions box */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-white text-sm">Controles Rápidos</h4>
                  <p className="text-xxs text-zinc-500 leading-relaxed">
                    Utilidades para validar, refrescar datos o restablecer la base de datos remota.
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    id="btn-supa-action-refresh"
                    onClick={() => {
                      onRefreshSupa();
                      alert('Se ha consultado la base de datos de Supabase.');
                    }}
                    disabled={loadingSupa}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-[10px] tracking-wider font-mono cursor-pointer transition-colors border border-zinc-700/30"
                  >
                    {loadingSupa ? 'Cargando de Supabase...' : '🔄 Forzar Recarga Cloud'}
                  </button>

                  <button
                    id="btn-supa-action-push"
                    onClick={async () => {
                      if (confirm('¿Deseas enviar tus datos locales actuales (torneos, equipos, jugadores) para sobrescribir/actualizar en Supabase?')) {
                        const success = await syncStateToSupabase({ tournaments, teams, players, matches });
                        if (success) {
                          alert('¡Datos locales sincronizados exitosamente con tu Supabase!');
                        } else {
                          alert('Falló la sincronización. Asegúrate de tener credenciales de Supabase válidas.');
                        }
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold uppercase text-[10px] tracking-wider font-mono cursor-pointer transition-colors shadow"
                  >
                    📤 Subir Datos Locales a Cloud
                  </button>
                </div>
              </div>
            </div>

            {/* Steps & DDL Script */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Steps Guiding Column */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                <h3 className="font-display font-bold text-white text-base">Guía de Configuración Paso a Paso</h3>
                
                <div className="space-y-4 text-xs text-zinc-400">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold text-[11px] font-mono shrink-0">1</span>
                    <div className="space-y-1">
                      <p className="font-bold text-white">Crea tu proyecto Supabase</p>
                      <p className="leading-relaxed">Ve a <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-green hover:underline">supabase.com</a>, regístrate y crea un nuevo proyecto de base de datos PostgreSQL.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold text-[11px] font-mono shrink-0">2</span>
                    <div className="space-y-1">
                      <p className="font-bold text-white">Ejecuta el Script de Tablas SQL</p>
                      <p className="leading-relaxed">En la consola de tu proyecto Supabase, ingresa al menú <strong>SQL Editor</strong> de la barra lateral, crea una "New query", pega el código SQL de la derecha y haz clic en <strong>RUN</strong>.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold text-[11px] font-mono shrink-0">3</span>
                    <div className="space-y-1">
                      <p className="font-bold text-white">Ingresa las Credenciales en AI Studio</p>
                      <p className="leading-relaxed">
                        Abre el menú de <strong>Settings / Variables de Entorno</strong> en la esquina superior derecha del editor de AI Studio, y provee los siguientes valores:
                      </p>
                      <ul className="list-disc list-inside pl-1.5 space-y-1 text-zinc-500 font-mono text-[10px] pt-1">
                        <li><span className="text-zinc-300">VITE_SUPABASE_URL</span>: Tu endpoint de Supabase (ej: <code className="bg-black/50 px-1 py-0.5 rounded text-amber-500">https://xyz.supabase.co</code>)</li>
                        <li><span className="text-zinc-300">VITE_SUPABASE_ANON_KEY</span>: Tu anon public API key</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold text-[11px] font-mono shrink-0">4</span>
                    <div className="space-y-1">
                      <p className="font-bold text-white">¡Listo para usar!</p>
                      <p className="leading-relaxed">
                        El sistema detectará las variables, se conectará en vivo y auto-poblará tu base de datos remota con torneos y fixtures iniciales de demo para que comiences de inmediato.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DDL SQL Copy-Paste Box */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-base">Script de Estructura SQL</h3>
                    <button
                      id="btn-supa-copy-sql"
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                        alert('¡Script SQL copiado al portapapeles! Listo para pegar en Supabase SQL Editor.');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xxs font-bold uppercase tracking-wider font-mono transition-colors cursor-pointer border border-zinc-700/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar SQL
                    </button>
                  </div>
                  <p className="text-xxs text-zinc-500 leading-relaxed">
                    Ejecuta este código en tu SQL Editor de Supabase para generar las tablas <code className="text-zinc-400 font-mono">tournaments</code>, <code className="text-zinc-400 font-mono">teams</code>, <code className="text-zinc-400 font-mono">players</code>, y <code className="text-zinc-400 font-mono">matches</code> con sus relaciones correspondientes.
                  </p>
                </div>

                <div className="pt-3 flex-1 flex flex-col">
                  <pre className="w-full flex-1 max-h-[300px] overflow-auto bg-black text-[10px] text-zinc-400 font-mono p-4 rounded-xl border border-zinc-800 text-left whitespace-pre select-all">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
