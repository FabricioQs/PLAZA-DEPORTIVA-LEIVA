/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Calendar, Users, Award, ChevronLeft } from 'lucide-react';
import { Tournament, Team, Player, Match, TeamStanding } from '../types';
import StandingsView from './StandingsView';
import GoalscorersView from './GoalscorersView';
import FixtureView from './FixtureView';
import TeamsListView from './TeamsListView';
import { calculateStandings } from '../data/mockData';

interface TournamentDetailViewProps {
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  matches: Match[];
  onBack: () => void;
}

type TabType = 'standings' | 'goalscorers' | 'fixture' | 'teams';

export default function TournamentDetailView({
  tournament,
  teams,
  players,
  matches,
  onBack,
}: TournamentDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('standings');

  // 1. Filter teams belonging to this tournament's category
  const tournamentTeams = teams.filter((t) => t.category === tournament.category);

  // 2. Filter matches belonging to this tournament
  const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);

  // 3. Calculate dynamic standings
  const standings: TeamStanding[] = calculateStandings(
    tournament.id,
    tournament.category,
    matches,
    teams
  );

  // 4. Filter players belonging to this tournament's category (since players are registered by category)
  const tournamentPlayers = players.filter((p) => p.category === tournament.category);

  const tabs = [
    { id: 'standings', label: 'Posiciones', icon: Trophy },
    { id: 'goalscorers', label: 'Goleadores', icon: Award },
    { id: 'fixture', label: 'Calendario', icon: Calendar },
    { id: 'teams', label: 'Equipos', icon: Users },
  ] as const;

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR WITH BACK BUTTON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            id="btn-tournament-detail-back"
            onClick={onBack}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-brand-green/30 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
              <span className="text-zinc-500 text-xs font-semibold">•</span>
              <span className="text-zinc-400 text-xs font-semibold uppercase">Cat. {tournament.category}</span>
              <span className="text-zinc-500 text-xs font-semibold">•</span>
              <span className="text-zinc-400 text-xs font-semibold uppercase">{tournament.format}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
              {tournament.name}
            </h1>
          </div>
        </div>

        {/* Date / Category display */}
        <div className="text-xs text-zinc-400 font-mono bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-xl self-start md:self-auto shrink-0 flex flex-col justify-center">
          <div>INICIO: <span className="text-zinc-200 font-bold">{tournament.startDate}</span></div>
          <div className="mt-1">FIN: <span className="text-zinc-200 font-bold">{tournament.endDate}</span></div>
        </div>
      </div>

      {/* DESCRIPTION BLOCK */}
      {tournament.description && (
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl pl-1 italic">
          "{tournament.description}"
        </p>
      )}

      {/* TAB NAVIGATION BAR */}
      <div className="flex border-b border-zinc-800/80 overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`btn-tournament-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-display font-bold text-sm tracking-wide transition-all cursor-pointer whitespace-nowrap ${
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

      {/* RENDER CURRENT TAB */}
      <div className="pt-2">
        {activeTab === 'standings' && <StandingsView standings={standings} />}
        {activeTab === 'goalscorers' && (
          <GoalscorersView players={tournamentPlayers} teams={tournamentTeams} />
        )}
        {activeTab === 'fixture' && (
          <FixtureView matches={tournamentMatches} teams={tournamentTeams} />
        )}
        {activeTab === 'teams' && (
          <TeamsListView
            teams={tournamentTeams}
            players={players}
            matches={matches}
            standings={standings}
          />
        )}
      </div>
    </div>
  );
}
