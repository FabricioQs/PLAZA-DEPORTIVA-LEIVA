/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, User, Calendar, Trophy, Award, Activity, X, Info } from 'lucide-react';
import { Team, Player, Match, TeamStanding } from '../types';

interface TeamsListViewProps {
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: TeamStanding[];
}

export default function TeamsListView({ teams, players, matches, standings }: TeamsListViewProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Helper to find team info
  const getTeam = (id: string) => teams.find((t) => t.id === id);

  // Filter teams of current tab/category (assumes parent filters category, but we display all teams in this list)
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  // Get roster for selected team
  const roster = players.filter((p) => p.teamId === selectedTeamId);

  // Get matches played by the selected team
  const teamMatches = matches.filter(
    (m) =>
      (m.teamAId === selectedTeamId || m.teamBId === selectedTeamId) &&
      (m.status === 'Finalizado' || m.status === 'En vivo')
  );

  // Find standing for selected team
  const teamStanding = standings.find((s) => s.teamId === selectedTeamId);

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
        <h3 className="text-lg font-display font-bold text-white tracking-wide">Equipos Participantes</h3>
        <p className="text-xs text-zinc-400">Selecciona cualquier equipo para visualizar su plantilla de jugadores, historial de partidos y estadísticas detalladas.</p>
      </div>

      {/* TEAMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, idx) => {
          const teamRoster = players.filter((p) => p.teamId === team.id);
          const standing = standings.find((s) => s.teamId === team.id);

          return (
            <motion.div
              key={team.id}
              whileHover={{ y: -4, scale: 1.02 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              onClick={() => setSelectedTeamId(team.id)}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-brand-green/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Background gradient splash */}
              <div
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: team.color }}
              />

              <div className="space-y-4">
                {/* Header: Logo and Color */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border overflow-hidden shrink-0"
                    style={{ backgroundColor: `${team.color}15`, borderColor: team.color }}
                  >
                    {team.logo && (team.logo.startsWith('http') || team.logo.startsWith('data:image')) ? (
                      <img src={team.logo} alt={team.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    ) : (
                      team.logo || '⚽'
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-lg leading-tight group-hover:text-brand-green transition-colors">
                      {team.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                      Fundado: {team.founded.split('-')[0]}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">{team.description}</p>

                {/* Team metadata pills */}
                <div className="flex flex-wrap gap-2 text-xxs font-semibold">
                  <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                    👥 {teamRoster.length} Jugadores
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                    👑 Cap: {team.captain.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Mini standing summary */}
              {standing && (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span>PJ: <strong className="text-zinc-200">{standing.played}</strong></span>
                    <span>GD: <strong className={standing.goalDifference > 0 ? 'text-emerald-400' : 'text-zinc-200'}>{standing.goalDifference}</strong></span>
                  </div>
                  <span className="text-brand-green font-display font-bold">
                    {standing.points} PTS
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* TEAM DETAIL OVERLAY / DRAWER MODAL */}
      <AnimatePresence>
        {selectedTeam && (
          <div 
            onClick={() => setSelectedTeamId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative cursor-default"
            >
              {/* Close Button */}
              <button
                type="button"
                id="btn-close-team-modal"
                onClick={() => setSelectedTeamId(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer z-50 transition-all hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Area */}
              <div
                className="h-32 relative overflow-hidden"
                style={{ backgroundColor: `${selectedTeam.color}20` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-end gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-xl bg-zinc-900 overflow-hidden shrink-0"
                    style={{ borderColor: selectedTeam.color }}
                  >
                    {selectedTeam.logo && (selectedTeam.logo.startsWith('http') || selectedTeam.logo.startsWith('data:image')) ? (
                      <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-contain p-1.5" referrerPolicy="no-referrer" />
                    ) : (
                      selectedTeam.logo || '⚽'
                    )}
                  </div>
                  <div className="pb-1">
                    <h2 className="text-2xl font-display font-black text-white">{selectedTeam.name}</h2>
                    <span className="text-xs text-brand-green font-mono uppercase font-semibold">
                      Categoría {selectedTeam.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Meta */}
                <div className="space-y-6 lg:col-span-1">
                  {/* General Info */}
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                    <h3 className="text-sm text-zinc-400 font-display uppercase tracking-wider border-b border-zinc-800 pb-1.5 flex items-center gap-2">
                      <Info className="w-4 h-4 text-brand-green" /> Ficha Técnica
                    </h3>
                    <div className="space-y-3 text-xs text-zinc-300">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Capitán:</span>
                        <span className="font-semibold">{selectedTeam.captain}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Fundación:</span>
                        <span className="font-semibold">{selectedTeam.founded}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Color Escudo:</span>
                        <span className="flex items-center gap-1.5 font-semibold uppercase">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTeam.color }} />
                          {selectedTeam.color}
                        </span>
                      </div>
                      <p className="text-zinc-400 italic pt-2 border-t border-zinc-800 text-[11px] leading-relaxed">
                        {selectedTeam.description}
                      </p>
                    </div>
                  </div>

                  {/* Overall Standing stats card */}
                  {teamStanding && (
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-4">
                      <h3 className="text-sm text-zinc-400 font-display uppercase tracking-wider border-b border-zinc-800 pb-1.5 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-brand-gold" /> Desempeño
                      </h3>

                      <div className="text-center py-2">
                        <span className="text-4xl font-display font-black text-white">{teamStanding.points}</span>
                        <span className="text-xs text-zinc-500 block uppercase font-mono mt-1">Puntos Totales</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xxs font-mono">
                        <div className="bg-black/30 p-2 rounded-lg">
                          <span className="text-zinc-500 block">PG</span>
                          <strong className="text-emerald-400 text-sm mt-0.5 block">{teamStanding.won}</strong>
                        </div>
                        <div className="bg-black/30 p-2 rounded-lg">
                          <span className="text-zinc-500 block">PE</span>
                          <strong className="text-zinc-300 text-sm mt-0.5 block">{teamStanding.drawn}</strong>
                        </div>
                        <div className="bg-black/30 p-2 rounded-lg">
                          <span className="text-zinc-500 block">PP</span>
                          <strong className="text-rose-400 text-sm mt-0.5 block">{teamStanding.lost}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs border-t border-zinc-800 text-zinc-400 font-mono">
                        <div className="flex justify-between">
                          <span>Goles Marcados:</span>
                          <strong className="text-white">{teamStanding.goalsFor}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Goles Recibidos:</span>
                          <strong className="text-white">{teamStanding.goalsAgainst}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Diferencia de Goles:</span>
                          <strong className={teamStanding.goalDifference > 0 ? 'text-emerald-400' : 'text-white'}>
                            {teamStanding.goalDifference > 0 ? `+${teamStanding.goalDifference}` : teamStanding.goalDifference}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Columns: Squad Roster (Table/Grid) */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Roster list */}
                  <div className="space-y-4">
                    <h3 className="text-sm text-zinc-400 font-display uppercase tracking-wider pl-1 flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-green" /> Plantel de Jugadores ({roster.length})
                    </h3>

                    <div className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-950 text-zinc-500 font-display uppercase text-xxs tracking-wider border-b border-zinc-800">
                            <th className="py-3 px-4 w-12 text-center">N°</th>
                            <th className="py-3 px-4">Jugador</th>
                            <th className="py-3 px-4">Posición</th>
                            <th className="py-3 px-3 text-center">Partidos</th>
                            <th className="py-3 px-4 text-center font-bold text-brand-gold w-16">Goles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {roster.map((player) => (
                            <tr key={player.id} className="hover:bg-zinc-800/10">
                              <td className="py-3 px-4 text-center font-mono font-bold text-brand-green">
                                {player.number}
                              </td>
                              <td className="py-3 px-4 font-display font-bold text-white">
                                {player.name}
                              </td>
                              <td className="py-3 px-4 text-zinc-400 font-medium">
                                {player.position}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-zinc-400">
                                {player.matchesPlayed}
                              </td>
                              <td className="py-3 px-4 text-center font-display font-black text-brand-gold">
                                {player.goals}
                              </td>
                            </tr>
                          ))}
                          {roster.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-5 text-center text-zinc-500 italic">
                                No hay jugadores inscritos en este plantel.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Match History */}
                  <div className="space-y-4">
                    <h3 className="text-sm text-zinc-400 font-display uppercase tracking-wider pl-1 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-brand-green" /> Historial de Partidos Recientes
                    </h3>

                    <div className="space-y-3">
                      {teamMatches.map((m) => {
                        const oppName = m.teamAId === selectedTeamId ? m.teamBName : m.teamAName;
                        const oppLogo = m.teamAId === selectedTeamId ? getTeam(m.teamBId)?.logo : getTeam(m.teamAId)?.logo;
                        const myScore = m.teamAId === selectedTeamId ? m.teamAScore : m.teamBScore;
                        const oppScore = m.teamAId === selectedTeamId ? m.teamBScore : m.teamAScore;

                        const isWin = (myScore ?? 0) > (oppScore ?? 0);
                        const isLoss = (myScore ?? 0) < (oppScore ?? 0);
                        const isDraw = myScore === oppScore;

                        return (
                          <div
                            key={m.id}
                            className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between text-xs font-medium"
                          >
                            <div className="flex items-center gap-3">
                              {/* Outcome Indicator */}
                              <span
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-display font-bold text-black ${
                                  isWin ? 'bg-brand-green' : isDraw ? 'bg-zinc-500' : 'bg-rose-500'
                                }`}
                              >
                                {isWin ? 'G' : isDraw ? 'E' : 'P'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-zinc-500">vs</span>
                                <span className="font-bold text-white">{oppName}</span>
                                <span className="text-xs">{oppLogo}</span>
                              </div>
                            </div>

                            {/* Score info */}
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500 font-mono text-[10px]">{m.date}</span>
                              <span className="font-display font-black text-sm text-zinc-200">
                                {myScore} - {oppScore}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {teamMatches.length === 0 && (
                        <p className="text-xs text-zinc-500 italic py-2">No se registran partidos finalizados para este equipo.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
