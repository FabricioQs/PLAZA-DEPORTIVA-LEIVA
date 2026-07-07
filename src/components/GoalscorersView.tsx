/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Flame, Users } from 'lucide-react';
import { Player, Team } from '../types';

interface GoalscorersViewProps {
  players: Player[];
  teams: Team[];
}

export default function GoalscorersView({ players, teams }: GoalscorersViewProps) {
  // Find team helper
  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  // Sort players by goals descending, then matchesPlayed ascending (fewer games is better)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.goals !== a.goals) {
      return b.goals - a.goals;
    }
    return a.matchesPlayed - b.matchesPlayed;
  });

  const top3 = sortedPlayers.slice(0, 3);
  const remainingPlayers = sortedPlayers.slice(3);

  // Re-arrange podium to traditional: [2nd, 1st, 3rd] for display
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ player: top3[1], rank: 2, color: 'text-zinc-300', bg: 'bg-zinc-300/10', border: 'border-zinc-300/30', badge: '🥈' });
  if (top3[0]) podiumOrder.push({ player: top3[0], rank: 1, color: 'text-brand-gold', bg: 'bg-brand-gold/10', border: 'border-brand-gold/30', badge: '👑' });
  if (top3[2]) podiumOrder.push({ player: top3[2], rank: 3, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30', badge: '🥉' });

  // If there are no players registered
  if (sortedPlayers.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-zinc-500">
        No hay estadísticas de goleadores disponibles todavía.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* SECTION HEADER */}
      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-white tracking-wide">Tabla de Goleadores</h3>
          <p className="text-xs text-zinc-400">Máximos anotadores del torneo. Se considera goles y promedio por partido.</p>
        </div>
        <Flame className="w-5 h-5 text-brand-gold animate-bounce" />
      </div>

      {/* TOP 3 PODIUM */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
          {podiumOrder.map(({ player, rank, color, bg, border, badge }) => {
            const team = getTeam(player.teamId);
            const ratio = player.matchesPlayed > 0 ? (player.goals / player.matchesPlayed).toFixed(2) : '0.00';
            const isFirst = rank === 1;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * rank }}
                className={`rounded-2xl border ${border} ${bg} p-6 flex flex-col items-center justify-center text-center relative ${
                  isFirst ? 'md:h-80 md:z-10 shadow-lg shadow-brand-gold/5 bg-zinc-900/80' : 'md:h-72 bg-zinc-900/40'
                }`}
              >
                {/* Crown / Rank indicator */}
                <div className="absolute -top-5 w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl shadow-md">
                  {badge}
                </div>

                {/* Avatar representation */}
                <div className="mt-2 relative">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold font-display text-zinc-400 overflow-hidden shadow-md">
                    {player.avatarUrl ? (
                      <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      player.name.charAt(0)
                    )}
                  </div>
                  {/* Small team logo overlay */}
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs border bg-black shadow"
                    style={{ borderColor: team?.color || '#555' }}
                  >
                    {team?.logo || '⚽'}
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="font-display font-bold text-white text-base truncate max-w-[200px]">{player.name}</h4>
                  <p className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1">
                    <span>{player.teamName}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-300">
                      N° {player.number}
                    </span>
                  </p>
                </div>

                {/* Main goals stat */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-3xl font-display font-black text-white">{player.goals}</span>
                  <div className="text-left text-xxs text-zinc-500 font-mono leading-tight uppercase">
                    <div>GOLES</div>
                    <div>MARCADOS</div>
                  </div>
                </div>

                {/* Played / Ratio details */}
                <div className="mt-4 w-full grid grid-cols-2 gap-2 border-t border-zinc-800/60 pt-3 text-xxs font-mono text-zinc-400">
                  <div>
                    <span className="block text-zinc-500 font-sans">PARTIDOS</span>
                    <span className="font-bold text-zinc-200 text-xs">{player.matchesPlayed}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 font-sans">PROMEDIO</span>
                    <span className="font-bold text-brand-green text-xs">{ratio} G/P</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* REMAINING PLAYERS (TABLE ON DESKTOP, CARDS ON MOBILE) */}
      {remainingPlayers.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-display font-bold text-white uppercase tracking-wider pl-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-green" /> Resto de Competidores
          </h4>

          {/* Desktop view */}
          <div className="hidden md:block overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 text-zinc-400 font-display uppercase text-xs tracking-wider border-b border-zinc-800">
                  <th className="py-3 px-4 w-14 text-center">Pos</th>
                  <th className="py-3 px-4">Jugador</th>
                  <th className="py-3 px-4">Equipo</th>
                  <th className="py-3 px-3 text-center">Partidos</th>
                  <th className="py-3 px-3 text-center">Goles/Partidos</th>
                  <th className="py-3 px-4 text-center font-bold text-brand-gold w-24">Goles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {remainingPlayers.map((player, index) => {
                  const team = getTeam(player.teamId);
                  const rank = index + 4;
                  const ratio = player.matchesPlayed > 0 ? (player.goals / player.matchesPlayed).toFixed(2) : '0.00';

                  return (
                    <tr key={player.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="py-3.5 px-4 text-center font-mono text-zinc-500 font-semibold">{rank}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold font-display text-zinc-300">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-display font-bold text-white group-hover:text-brand-green transition-colors block">
                              {player.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 uppercase font-mono">DORSAL {player.number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-300">{player.teamName}</span>
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border"
                            style={{ backgroundColor: `${team?.color}15`, borderColor: team?.color }}
                          >
                            {team?.logo || '⚽'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center text-zinc-300 font-mono">{player.matchesPlayed}</td>
                      <td className="py-3.5 px-3 text-center text-zinc-400 font-mono text-xs">{ratio} G/P</td>
                      <td className="py-3.5 px-4 text-center font-display font-black text-white text-base bg-brand-gold/3 border-l border-zinc-800/40">
                        {player.goals}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="block md:hidden space-y-3">
            {remainingPlayers.map((player, index) => {
              const team = getTeam(player.teamId);
              const rank = index + 4;
              const ratio = player.matchesPlayed > 0 ? (player.goals / player.matchesPlayed).toFixed(2) : '0.00';

              return (
                <div key={player.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-zinc-500 font-bold">#{rank}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-300">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-white text-sm">{player.name}</h5>
                      <p className="text-xxs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{player.teamName}</span>
                        <span>•</span>
                        <span>PJ: {player.matchesPlayed}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-500 font-mono">{ratio} G/P</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-800 text-brand-gold font-display font-black text-sm">
                      {player.goals}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
