/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Trophy, Calendar, Filter, Plus, ChevronRight, Activity } from 'lucide-react';
import { Tournament, TournamentCategory, TournamentStatus } from '../types';

interface TournamentsListViewProps {
  tournaments: Tournament[];
  onSelectTournament: (id: string) => void;
  onCreateTournamentClick: () => void;
}

export default function TournamentsListView({
  tournaments,
  onSelectTournament,
  onCreateTournamentClick,
}: TournamentsListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | 'Todas'>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'Todos'>('Todos');

  // Filter tournaments list
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Todos' || t.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tournaments, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-wide">
            Torneos de Fútbol e Indor
          </h1>
          <p className="text-sm text-zinc-400">
            Explora las tablas, goleadores, fixture de partidos y estadísticas por categoría.
          </p>
        </div>
        <button
          id="btn-tournaments-create-new"
          onClick={onCreateTournamentClick}
          className="px-5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0 text-sm"
        >
          <Plus className="w-4.5 h-4.5" /> Crear Torneo
        </button>
      </div>

      {/* FILTER CONTROLS TOOLBAR */}
      <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-zinc-500" />
          <input
            id="input-tournaments-search"
            type="text"
            placeholder="Buscar torneo por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/40 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="relative md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:inline" />
          <select
            id="select-tournaments-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
          >
            <option value="Todas">Todas las Categorías</option>
            <option value="Sub-15">Categoría Sub-15</option>
            <option value="Sub-20">Categoría Sub-20</option>
            <option value="Libre">Categoría Libre</option>
            <option value="Femenino">Categoría Femenino</option>
            <option value="Master">Categoría Master</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="relative md:col-span-3">
          <select
            id="select-tournaments-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Torneos Activos</option>
            <option value="Próximo">Próximos Torneos</option>
            <option value="Finalizado">Torneos Finalizados</option>
          </select>
        </div>
      </div>

      {/* TOURNAMENTS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tournament, idx) => (
          <motion.div
            key={tournament.id}
            whileHover={{ y: -4, scale: 1.01 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 hover:border-brand-green/40 transition-all flex flex-col justify-between cursor-pointer group"
            onClick={() => onSelectTournament(tournament.id)}
          >
            <div className="space-y-4">
              {/* Header Status + Category */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider ${
                    tournament.status === 'Activo'
                      ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                      : tournament.status === 'Próximo'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {tournament.status}
                </span>

                <span className="text-xxs text-zinc-500 font-bold uppercase tracking-wide bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  Cat. {tournament.category}
                </span>
              </div>

              {/* Tournament Name */}
              <h3 className="text-xl font-display font-extrabold text-white leading-snug group-hover:text-brand-green transition-colors">
                {tournament.name}
              </h3>

              {/* Tournament Description */}
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {tournament.description || 'Sin descripción detallada disponible.'}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-medium font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-green" />
                <span>{tournament.startDate} • {tournament.endDate}</span>
              </div>
              <span className="text-brand-green group-hover:underline flex items-center gap-0.5 font-display font-bold font-sans">
                Explorar <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        ))}

        {/* CREATE CARD CTA */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={onCreateTournamentClick}
          className="rounded-2xl border border-dashed border-zinc-800 hover:border-brand-green/50 hover:bg-brand-green/3 bg-zinc-950/20 p-6 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer group min-h-[220px]"
        >
          <div className="p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-brand-green group-hover:bg-brand-green group-hover:text-black transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">¿No encuentras tu torneo?</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
              Crea tu propia liga o campeonato de fútbol, administra equipos y sube resultados.
            </p>
          </div>
        </motion.div>
      </div>

      {filteredTournaments.length === 0 && (
        <div className="p-16 rounded-2xl bg-zinc-900/20 border border-zinc-800/80 text-center text-zinc-500">
          No se encontraron torneos activos que coincidan con la búsqueda o los filtros seleccionados.
        </div>
      )}
    </div>
  );
}
