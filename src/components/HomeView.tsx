/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Calendar, Activity, ChevronRight, Play, Clock, MapPin, Sparkles } from 'lucide-react';
import { Tournament, Match, Team } from '../types';
import BrandLogo from './BrandLogo';

interface HomeViewProps {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  onNavigate: (tab: string, extraData?: any) => void;
}

export default function HomeView({ tournaments, teams, matches, onNavigate }: HomeViewProps) {
  // Counters animation state
  const [counts, setCounts] = useState({ tournaments: 0, teams: 0, matches: 0, goals: 0 });

  // Get highlights matches
  const liveMatches = matches.filter((m) => m.status === 'En vivo');
  const upcomingMatches = matches.filter((m) => m.status === 'Programado').slice(0, 3);
  const finishedMatches = matches.filter((m) => m.status === 'Finalizado').slice(0, 3);

  // Calculate total goals scored
  const totalGoals = matches.reduce((acc, m) => {
    if (m.status === 'Finalizado' || m.status === 'En vivo') {
      return acc + (m.teamAScore ?? 0) + (m.teamBScore ?? 0);
    }
    return acc;
  }, 0);

  // Counter effects
  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        tournaments: Math.min(Math.ceil((tournaments.length * step) / steps), tournaments.length),
        teams: Math.min(Math.ceil((teams.length * step) / steps), teams.length),
        matches: Math.min(Math.ceil((matches.length * step) / steps), matches.length),
        goals: Math.min(Math.ceil((totalGoals * step) / steps), totalGoals),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [tournaments.length, teams.length, matches.length, totalGoals]);

  // Find team helper to display color / emblem
  const findTeam = (id: string) => teams.find((t) => t.id === id);

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#141414] border border-zinc-800/80 p-8 md:p-16 sports-grid">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-brand-green-dark/10 rounded-full blur-3xl -z-10" />

        {/* Parallax turf design */}
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-brand-green via-emerald-400 to-brand-green-dark" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Brand Logo Component (Large) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="p-6 bg-white rounded-full border border-zinc-200 shadow-xl"
            >
              <BrandLogo size="xl" showText={true} variant="dark" />
            </motion.div>
          </div>

          {/* Hero text */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Sinfonía del Fútbol Local de Alta Calidad
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-none"
            >
              ¡Sigue la Pasión en <span className="text-brand-green">Plaza Leiva</span>!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg max-w-xl"
            >
              Resultados en tiempo real, tablas de posiciones dinámicas, estadísticas de goleadores y la gestión total de tus torneos favoritos de fútbol e indor.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                id="btn-hero-explore-tournaments"
                onClick={() => onNavigate('tournaments')}
                className="px-8 py-4 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-semibold shadow-lg shadow-brand-green/20 hover:shadow-brand-green-dark/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                Explorar Torneos Activos
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS COUNT GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Trophy, label: 'Torneos Registrados', value: counts.tournaments, color: 'text-brand-green bg-brand-green/10' },
          { icon: Users, label: 'Equipos Activos', value: counts.teams, color: 'text-blue-400 bg-blue-500/10' },
          { icon: Calendar, label: 'Partidos Totales', value: counts.matches, color: 'text-amber-400 bg-amber-500/10' },
          { icon: Activity, label: 'Goles Marcados', value: counts.goals, color: 'text-rose-400 bg-rose-500/10' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/60 flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-green/20 transition-colors"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl md:text-4xl font-display font-extrabold text-white">{stat.value}</div>
            <div className="text-xs md:text-sm text-zinc-400 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* MATCH HIGHLIGHTS - GRID / SLIDER */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIVE PARTIDOS WIDGET */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-white tracking-wide flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Partidos En Vivo y Destacados
            </h2>
            <button
              id="btn-view-all-fixture"
              onClick={() => onNavigate('tournaments', { view: 'fixture' })}
              className="text-brand-green text-sm hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver todo el fixture
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => {
                const teamA = findTeam(match.teamAId);
                const teamB = findTeam(match.teamBId);
                return (
                  <motion.div
                    key={match.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl bg-[#1b1010]/80 border border-red-500/20 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-xxs font-bold uppercase rounded-bl-xl tracking-widest animate-pulse flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> EN VIVO
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left Team */}
                      <div className="flex items-center gap-3 w-full md:w-2/5 justify-end text-right">
                        <span className="font-display font-semibold text-lg text-white max-w-[150px] truncate">{match.teamAName}</span>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border border-zinc-700"
                          style={{ backgroundColor: teamA?.color ? `${teamA.color}20` : '#222', borderColor: teamA?.color }}
                        >
                          {teamA?.logo || '⚽'}
                        </div>
                      </div>

                      {/* Score Board */}
                      <div className="flex flex-col items-center justify-center bg-black/40 px-6 py-2.5 rounded-2xl border border-zinc-800 min-w-[120px]">
                        <div className="text-3xl font-display font-black text-white flex items-center gap-3">
                          <span className="text-brand-green">{match.teamAScore}</span>
                          <span className="text-zinc-600 text-xl font-light">:</span>
                          <span className="text-brand-green">{match.teamBScore}</span>
                        </div>
                        <span className="text-red-400 font-mono text-xs font-semibold animate-pulse mt-1">2do Tiempo</span>
                      </div>

                      {/* Right Team */}
                      <div className="flex items-center gap-3 w-full md:w-2/5 justify-start text-left">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border border-zinc-700"
                          style={{ backgroundColor: teamB?.color ? `${teamB.color}20` : '#222', borderColor: teamB?.color }}
                        >
                          {teamB?.logo || '⚽'}
                        </div>
                        <span className="font-display font-semibold text-lg text-white max-w-[150px] truncate">{match.teamBName}</span>
                      </div>
                    </div>

                    {/* Live events / goals ticker */}
                    {match.events && match.events.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-2 justify-center text-xs text-zinc-400">
                        {match.events.filter((e) => e.type === 'goal').slice(-2).map((evt) => (
                          <div key={evt.id} className="bg-black/30 px-2.5 py-1 rounded-full border border-zinc-800/80 flex items-center gap-1.5">
                            <span className="text-brand-green">⚽</span>
                            <span>{evt.playerName} ({evt.minute}')</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-500 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {match.pitch}
                      </div>
                      <div>•</div>
                      <div className="capitalize">Cat. {match.category}</div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-950/40 border border-zinc-800/40 text-center text-zinc-500 flex flex-col items-center justify-center space-y-2">
                <Activity className="w-8 h-8 text-zinc-600" />
                <p>No hay partidos jugándose en este momento.</p>
                <p className="text-xs">¡Revisa los próximos encuentros programados!</p>
              </div>
            )}
          </div>

          {/* UPCOMING MATCHES */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-display font-bold text-white tracking-wide">Siguientes Partidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => {
                  const teamA = findTeam(match.teamAId);
                  const teamB = findTeam(match.teamBId);
                  return (
                    <div
                      key={match.id}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-brand-green/30 transition-all flex flex-col justify-between h-36"
                    >
                      <div className="flex items-center justify-between text-xxs text-zinc-500 uppercase font-bold tracking-wider">
                        <span>Jornada {match.matchday}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-brand-green">
                          Cat. {match.category}
                        </span>
                      </div>

                      {/* Opponents and Verses */}
                      <div className="grid grid-cols-9 items-center py-2">
                        <div className="col-span-4 flex items-center gap-2 justify-end text-right">
                          <span className="text-sm font-display font-semibold text-white truncate max-w-[80px]">{match.teamAName}</span>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                            style={{ backgroundColor: teamA?.color ? `${teamA.color}15` : '#222', borderColor: teamA?.color }}
                          >
                            {teamA?.logo || '⚽'}
                          </div>
                        </div>
                        <div className="col-span-1 text-center font-mono font-bold text-zinc-600 text-xs">VS</div>
                        <div className="col-span-4 flex items-center gap-2 justify-start text-left">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                            style={{ backgroundColor: teamB?.color ? `${teamB.color}15` : '#222', borderColor: teamB?.color }}
                          >
                            {teamB?.logo || '⚽'}
                          </div>
                          <span className="text-sm font-display font-semibold text-white truncate max-w-[80px]">{match.teamBName}</span>
                        </div>
                      </div>

                      {/* Date & Location */}
                      <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-800/50">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-green" /> {match.time} ({match.date})
                        </span>
                        <span className="truncate max-w-[120px]">{match.pitch}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/40 text-center text-zinc-500">
                  No hay partidos programados.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVE TOURNAMENTS CARDS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-white tracking-wide">Torneos Destacados</h2>

          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-brand-green/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                onClick={() => onNavigate('tournaments', { tournamentId: tournament.id })}
              >
                {/* Visual marker of active status */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${
                    tournament.status === 'Activo'
                      ? 'bg-brand-green'
                      : tournament.status === 'Próximo'
                      ? 'bg-blue-500'
                      : 'bg-zinc-600'
                  }`}
                />

                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${
                        tournament.status === 'Activo'
                          ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                          : tournament.status === 'Próximo'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {tournament.status}
                    </span>
                    <span className="text-xs text-zinc-500 font-semibold">{tournament.format}</span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white group-hover:text-brand-green transition-colors leading-tight">
                    {tournament.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2">{tournament.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 pl-2 flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span className="capitalize text-zinc-300">Cat. {tournament.category}</span>
                  <span className="text-brand-green hover:underline flex items-center gap-0.5">
                    Ver estadísticas <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
