/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, HelpCircle, Trophy, ShieldAlert } from 'lucide-react';
import { TeamStanding } from '../types';

interface StandingsViewProps {
  standings: TeamStanding[];
}

type SortKey = 'points' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference';

export default function StandingsView({ standings }: StandingsViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('points');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // Sort standings based on user click
  const sortedStandings = [...standings].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (valA === valB) {
      // Tie breaker: always fallback to points first, then goalDifference
      if (sortKey !== 'points' && a.points !== b.points) {
        return b.points - a.points;
      }
      return b.goalDifference - a.goalDifference;
    }

    return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
        <div>
          <h3 className="text-lg font-display font-bold text-white tracking-wide">Tabla de Clasificación</h3>
          <p className="text-xs text-zinc-400">Ordenado por rendimiento. Los 4 mejores clasifican a los Play-Offs directos.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-brand-green" />
            <span className="text-zinc-300">Zona de Clasificación</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-zinc-700" />
            <span className="text-zinc-300">Posición Regular</span>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (TABLE) */}
      <div className="hidden md:block overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 font-display uppercase text-xs tracking-wider border-b border-zinc-800">
              <th className="py-4 px-4 w-14 text-center">Pos</th>
              <th className="py-4 px-4 min-w-[180px]">Equipo</th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('played')}>
                <div className="flex items-center justify-center gap-1">PJ <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('won')}>
                <div className="flex items-center justify-center gap-1">PG <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('drawn')}>
                <div className="flex items-center justify-center gap-1">PE <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('lost')}>
                <div className="flex items-center justify-center gap-1">PP <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('goalsFor')}>
                <div className="flex items-center justify-center gap-1">GF <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('goalsAgainst')}>
                <div className="flex items-center justify-center gap-1">GC <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('goalDifference')}>
                <div className="flex items-center justify-center gap-1">DIF <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
              <th className="py-4 px-4 text-center font-bold text-brand-green cursor-pointer hover:text-brand-green-dark transition-colors bg-brand-green/5" onClick={() => handleSort('points')}>
                <div className="flex items-center justify-center gap-1">PTS <ArrowUpDown className="w-3.5 h-3.5" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {sortedStandings.map((team, index) => {
              const originalPos = standings.findIndex((s) => s.teamId === team.teamId) + 1;
              const isClassified = originalPos <= 4;

              return (
                <tr
                  key={team.teamId}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Position with left zone border */}
                  <td className="py-4 px-4 text-center relative font-mono font-bold text-sm">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isClassified ? 'bg-brand-green' : 'bg-transparent'
                      }`}
                    />
                    <span className={isClassified ? 'text-brand-green' : 'text-zinc-400'}>
                      {originalPos}
                    </span>
                  </td>

                  {/* Team badge and Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg border border-zinc-700/60 shadow-inner overflow-hidden shrink-0"
                        style={{ backgroundColor: `${team.color}15`, borderColor: team.color }}
                      >
                        {team.teamLogo && (team.teamLogo.startsWith('http') || team.teamLogo.startsWith('data:image')) ? (
                          <img src={team.teamLogo} alt={team.teamName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                        ) : (
                          team.teamLogo || '⚽'
                        )}
                      </div>
                      <span className="font-display font-bold text-white group-hover:text-brand-green transition-colors">
                        {team.teamName}
                      </span>
                    </div>
                  </td>

                  {/* PJ */}
                  <td className="py-4 px-3 text-center text-zinc-300 font-mono">{team.played}</td>
                  {/* PG */}
                  <td className="py-4 px-3 text-center text-emerald-400 font-mono">{team.won}</td>
                  {/* PE */}
                  <td className="py-4 px-3 text-center text-zinc-400 font-mono">{team.drawn}</td>
                  {/* PP */}
                  <td className="py-4 px-3 text-center text-rose-400 font-mono">{team.lost}</td>
                  {/* GF */}
                  <td className="py-4 px-3 text-center text-zinc-400 font-mono">{team.goalsFor}</td>
                  {/* GC */}
                  <td className="py-4 px-3 text-center text-zinc-400 font-mono">{team.goalsAgainst}</td>
                  {/* DIF */}
                  <td className="py-4 px-3 text-center font-mono font-semibold">
                    <span className={team.goalDifference > 0 ? 'text-emerald-400' : team.goalDifference < 0 ? 'text-rose-400' : 'text-zinc-500'}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>

                  {/* PTS */}
                  <td className="py-4 px-4 text-center font-display font-black text-white text-lg bg-brand-green/3 border-l border-zinc-800/40">
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE-FIRST VIEW (STACKED CARDS) */}
      <div className="block md:hidden space-y-3">
        {sortedStandings.map((team, index) => {
          const originalPos = standings.findIndex((s) => s.teamId === team.teamId) + 1;
          const isClassified = originalPos <= 4;

          return (
            <motion.div
              key={team.teamId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 relative overflow-hidden flex flex-col gap-3"
            >
              {/* Highlight bar */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  isClassified ? 'bg-brand-green' : 'bg-zinc-700'
                }`}
              />

              {/* Card Header: Position and Team info */}
              <div className="flex items-center justify-between pl-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-display font-black ${isClassified ? 'text-brand-green' : 'text-zinc-500'}`}>
                    #{originalPos}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg border overflow-hidden shrink-0"
                    style={{ backgroundColor: `${team.color}15`, borderColor: team.color }}
                  >
                    {team.teamLogo && (team.teamLogo.startsWith('http') || team.teamLogo.startsWith('data:image')) ? (
                      <img src={team.teamLogo} alt={team.teamName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    ) : (
                      team.teamLogo || '⚽'
                    )}
                  </div>
                  <h4 className="font-display font-bold text-white text-base">{team.teamName}</h4>
                </div>

                {/* Points Badge */}
                <div className="px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/20 text-brand-green font-display font-black text-base">
                  {team.points} PTS
                </div>
              </div>

              {/* Stats detail grid */}
              <div className="grid grid-cols-7 gap-2 bg-black/40 p-2.5 rounded-lg text-center text-xxs font-mono text-zinc-400 pl-4">
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">PJ</div>
                  <div className="font-bold text-white text-xs mt-0.5">{team.played}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">PG</div>
                  <div className="font-bold text-emerald-400 text-xs mt-0.5">{team.won}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">PE</div>
                  <div className="font-bold text-zinc-300 text-xs mt-0.5">{team.drawn}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">PP</div>
                  <div className="font-bold text-rose-400 text-xs mt-0.5">{team.lost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">GF</div>
                  <div className="font-bold text-zinc-300 text-xs mt-0.5">{team.goalsFor}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">GC</div>
                  <div className="font-bold text-zinc-300 text-xs mt-0.5">{team.goalsAgainst}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-sans">DF</div>
                  <div className={`font-bold text-xs mt-0.5 ${team.goalDifference > 0 ? 'text-emerald-400' : team.goalDifference < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
