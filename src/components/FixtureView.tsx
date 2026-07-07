/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Play, CheckCircle, Eye, EyeOff, ShieldAlert, Award } from 'lucide-react';
import { Match, Team, MatchStatus } from '../types';

interface FixtureViewProps {
  matches: Match[];
  teams: Team[];
}

export default function FixtureView({ matches, teams }: FixtureViewProps) {
  const [selectedMatchday, setSelectedMatchday] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'Todos'>('Todos');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Find team helper
  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  // Get list of unique matchdays present in the matches
  const matchdays = useMemo(() => {
    const days = matches.map((m) => m.matchday);
    const uniqueDays = Array.from(new Set(days)).sort((a, b) => a - b);
    return uniqueDays.length > 0 ? uniqueDays : [1];
  }, [matches]);

  // Set initial selected matchday if currently selected is not in list
  React.useEffect(() => {
    if (matchdays.length > 0 && !matchdays.includes(selectedMatchday)) {
      setSelectedMatchday(matchdays[0]);
    }
  }, [matchdays, selectedMatchday]);

  // Filter matches based on selected matchday and status
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchdayMatch = m.matchday === selectedMatchday;
      const statusMatch = statusFilter === 'Todos' || m.status === statusFilter;
      return matchdayMatch && statusMatch;
    });
  }, [matches, selectedMatchday, statusFilter]);

  const toggleExpandMatch = (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(matchId);
    }
  };

  return (
    <div className="space-y-6">
      {/* MATCHDAY / JORNADA CAROUSEL SELECTOR */}
      <div className="space-y-3">
        <label className="text-xs text-zinc-400 font-display uppercase tracking-wider pl-1">Seleccionar Jornada</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {matchdays.map((day) => {
            const isSelected = selectedMatchday === day;
            return (
              <button
                key={day}
                id={`btn-fixture-jornada-${day}`}
                onClick={() => setSelectedMatchday(day)}
                className={`px-5 py-2.5 rounded-xl font-display font-bold text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-brand-green text-black shadow-lg shadow-brand-green/10'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                Jornada {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
        <span className="text-xs text-zinc-400 font-medium">
          Mostrando <strong className="text-white">{filteredMatches.length}</strong> partidos
        </span>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-lg border border-zinc-800/60">
          {(['Todos', 'Programado', 'En vivo', 'Finalizado'] as const).map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                id={`btn-fixture-filter-${filter}`}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {filter === 'Todos' ? 'Todos' : filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* MATCHES LIST */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => {
            const teamA = getTeam(match.teamAId);
            const teamB = getTeam(match.teamBId);
            const isExpanded = expandedMatchId === match.id;

            return (
              <motion.div
                key={match.id}
                layout="position"
                className={`rounded-2xl border transition-all ${
                  match.status === 'En vivo'
                    ? 'border-red-500/30 bg-[#140b0b]/60'
                    : isExpanded
                    ? 'border-brand-green/30 bg-zinc-900'
                    : 'border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700/60'
                }`}
              >
                {/* MATCH ROW CLICKABLE HEADER */}
                <div
                  className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => toggleExpandMatch(match.id)}
                >
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 md:order-1 order-3 w-full md:w-auto md:justify-start justify-center">
                    {match.status === 'En vivo' ? (
                      <span className="px-2.5 py-1 rounded bg-red-600/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> En vivo
                      </span>
                    ) : match.status === 'Finalizado' ? (
                      <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Finalizado
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-brand-green/10 text-brand-green border border-brand-green/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Programado
                      </span>
                    )}

                    <span className="text-xxs text-zinc-500 font-bold bg-zinc-800 px-2 py-1 rounded capitalize">
                      Cat. {match.category}
                    </span>
                  </div>

                  {/* Competitors and Score */}
                  <div className="flex-1 flex flex-row items-center justify-center gap-6 w-full md:order-2 order-1 md:py-0 py-2">
                    {/* Team A */}
                    <div className="flex items-center gap-3 w-2/5 justify-end text-right">
                      <span className="font-display font-bold text-sm md:text-base text-white truncate max-w-[140px]">
                        {match.teamAName}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-lg border shadow-inner shrink-0 overflow-hidden"
                        style={{ backgroundColor: `${teamA?.color}15`, borderColor: teamA?.color }}
                      >
                        {teamA?.logo && (teamA.logo.startsWith('http') || teamA.logo.startsWith('data:image')) ? (
                          <img src={teamA.logo} alt={match.teamAName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                        ) : (
                          teamA?.logo || '⚽'
                        )}
                      </div>
                    </div>

                    {/* SCORE BOARD */}
                    <div className="bg-black/40 px-4 py-2 rounded-xl border border-zinc-800/80 min-w-[80px] text-center shrink-0">
                      {match.status !== 'Programado' ? (
                        <span className="text-xl md:text-2xl font-display font-black text-white flex items-center justify-center gap-2">
                          <span className={match.status === 'En vivo' ? 'text-brand-green animate-pulse' : 'text-zinc-100'}>
                            {match.teamAScore}
                          </span>
                          <span className="text-zinc-600 font-light text-sm">:</span>
                          <span className={match.status === 'En vivo' ? 'text-brand-green animate-pulse' : 'text-zinc-100'}>
                            {match.teamBScore}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wide">VS</span>
                      )}
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-3 w-2/5 justify-start text-left">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-lg border shadow-inner shrink-0 overflow-hidden"
                        style={{ backgroundColor: `${teamB?.color}15`, borderColor: teamB?.color }}
                      >
                        {teamB?.logo && (teamB.logo.startsWith('http') || teamB.logo.startsWith('data:image')) ? (
                          <img src={teamB.logo} alt={match.teamBName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                        ) : (
                          teamB?.logo || '⚽'
                        )}
                      </div>
                      <span className="font-display font-bold text-sm md:text-base text-white truncate max-w-[140px]">
                        {match.teamBName}
                      </span>
                    </div>
                  </div>

                  {/* Info Button & Expand Chevron */}
                  <div className="flex items-center gap-3 md:order-3 order-2 text-zinc-500 text-xs w-full md:w-auto md:justify-end justify-center">
                    <span className="hidden md:inline-flex items-center gap-1 hover:text-zinc-300">
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4" /> Ocultar incidencias
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" /> Ver incidencias
                        </>
                      )}
                    </span>
                    <div className="md:hidden">
                      {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                    </div>
                  </div>
                </div>

                {/* DETAILS ACCORDION AREA (Goals, Cards, Referee, Pitch info) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-black/20 border-t border-zinc-800/80"
                    >
                      <div className="p-5 space-y-6">
                        {/* Event Ticker (Goals, Cards) */}
                        <div className="space-y-3">
                          <h5 className="text-xs text-zinc-400 font-display uppercase tracking-widest font-semibold border-b border-zinc-800/60 pb-1 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-brand-green" /> Incidencias del Encuentro
                          </h5>

                          {match.events && match.events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {/* Left Team Goals/Events */}
                              <div className="space-y-2 border-r border-zinc-800/40 pr-4">
                                <div className="text-xxs text-zinc-500 font-bold uppercase">{match.teamAName}</div>
                                {match.events
                                  .filter((e) => e.teamId === match.teamAId)
                                  .map((evt) => (
                                    <div key={evt.id} className="flex items-center gap-2 text-xs">
                                      <span className="font-mono text-brand-green font-bold">{evt.minute}'</span>
                                      <span>
                                        {evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : '🟥'}
                                      </span>
                                      <span className="text-zinc-200">{evt.playerName}</span>
                                    </div>
                                  ))}
                                {match.events.filter((e) => e.teamId === match.teamAId).length === 0 && (
                                  <div className="text-xs text-zinc-600 italic">Sin incidencias registradas.</div>
                                )}
                              </div>

                              {/* Right Team Goals/Events */}
                              <div className="space-y-2 pl-2">
                                <div className="text-xxs text-zinc-500 font-bold uppercase">{match.teamBName}</div>
                                {match.events
                                  .filter((e) => e.teamId === match.teamBId)
                                  .map((evt) => (
                                    <div key={evt.id} className="flex items-center gap-2 text-xs">
                                      <span className="font-mono text-brand-green font-bold">{evt.minute}'</span>
                                      <span>
                                        {evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : '🟥'}
                                      </span>
                                      <span className="text-zinc-200">{evt.playerName}</span>
                                    </div>
                                  ))}
                                {match.events.filter((e) => e.teamId === match.teamBId).length === 0 && (
                                  <div className="text-xs text-zinc-600 italic">Sin incidencias registradas.</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-500 italic py-2">
                              {match.status === 'Programado'
                                ? 'El partido aún no ha comenzado. Las incidencias aparecerán en tiempo real.'
                                : 'No se registraron incidencias detalladas para este encuentro.'}
                            </p>
                          )}
                        </div>

                        {/* Venue, Pitch & Referee specifications */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/40 text-xs">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                            <div>
                              <span className="text-xxs text-zinc-500 block uppercase font-mono">Sede / Cancha</span>
                              <strong className="text-zinc-200">{match.pitch}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar className="w-4 h-4 text-brand-green shrink-0" />
                            <div>
                              <span className="text-xxs text-zinc-500 block uppercase font-mono">Fecha del Partido</span>
                              <strong className="text-zinc-200">{match.date}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-zinc-400">
                            <Clock className="w-4 h-4 text-brand-green shrink-0" />
                            <div>
                              <span className="text-xxs text-zinc-500 block uppercase font-mono">Hora Establecida</span>
                              <strong className="text-zinc-200">{match.time} Horas</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="p-12 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center text-zinc-500">
            No se encontraron partidos para la jornada y filtro seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
