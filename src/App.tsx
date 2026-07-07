/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Users,
  Calendar,
  Settings,
  Heart,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight,
  Github
} from 'lucide-react';
import { AppState, loadAppState, saveAppState, INITIAL_TOURNAMENTS, INITIAL_TEAMS, INITIAL_PLAYERS, INITIAL_MATCHES } from './data/mockData';
import { isSupabaseConfigured, fetchStateFromSupabase, syncStateToSupabase } from './lib/supabase';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import TournamentsListView from './components/TournamentsListView';
import TournamentDetailView from './components/TournamentDetailView';
import AdminView from './components/AdminView';
import AdminLoginForm from './components/AdminLoginForm';

export default function App() {
  const [state, setState] = useState<AppState>({
    tournaments: [],
    teams: [],
    players: [],
    matches: [],
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [isAdminLogged, setIsAdminLogged] = useState<boolean>(false);

  // Theme Mode state
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('pdl-theme-mode') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('pdl-theme-mode', themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    }
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Supabase Sync States
  const [isSupaConfigured, setIsSupaConfigured] = useState<boolean>(false);
  const [isSupaActive, setIsSupaActive] = useState<boolean>(false);
  const [loadingSupa, setLoadingSupa] = useState<boolean>(false);
  const [supaError, setSupaError] = useState<string | null>(null);

  // Initialize and fetch data
  const loadInitialData = async () => {
    const configured = isSupabaseConfigured();
    setIsSupaConfigured(configured);
    
    // Always load local storage cache as a safe local fallback first
    const cachedState = loadAppState();
    setState(cachedState);

    const logged = localStorage.getItem('is_admin_logged') === 'true';
    setIsAdminLogged(logged);

    if (configured) {
      setLoadingSupa(true);
      setSupaError(null);
      try {
        const dbState = await fetchStateFromSupabase();
        if (dbState) {
          // If Supabase tables exist but are completely empty, perform a polite automatic seed
          if (dbState.tournaments.length === 0 && dbState.teams.length === 0) {
            console.log('Supabase tables are empty. Seeding initial data...');
            const defaultState: AppState = {
              tournaments: INITIAL_TOURNAMENTS,
              teams: INITIAL_TEAMS,
              players: INITIAL_PLAYERS,
              matches: INITIAL_MATCHES,
            };
            const success = await syncStateToSupabase(defaultState);
            if (success) {
              setState(defaultState);
              saveAppState(defaultState);
              setIsSupaActive(true);
            } else {
              setSupaError('No se pudieron crear los datos semilla en Supabase. Verifica si ejecutaste el script SQL de tablas en el editor de Supabase.');
              setIsSupaActive(false);
            }
          } else {
            // Set real state from Supabase
            setState(dbState);
            saveAppState(dbState); // Sync local cache
            setIsSupaActive(true);
          }
        } else {
          setSupaError('Error al conectar con Supabase. Asegúrate de haber ejecutado el script de tablas SQL y tener las políticas RLS abiertas.');
          setIsSupaActive(false);
        }
      } catch (err: any) {
        console.warn('Failed to load from Supabase (offline fallback is active):', err);
        if (err.code === '42P01') {
          setSupaError('Las tablas aún no existen en tu base de datos Supabase (Error 42P01). Debes ejecutar el script SQL de tablas en el editor SQL de tu consola de Supabase.');
        } else {
          setSupaError(`Error al consultar Supabase: ${err.message || 'Error de red'}`);
        }
        setIsSupaActive(false);
      } finally {
        setLoadingSupa(false);
      }
    } else {
      setIsSupaActive(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleLogout = () => {
    setIsAdminLogged(false);
    localStorage.removeItem('is_admin_logged');
    if (currentTab === 'admin') {
      setCurrentTab('home');
    }
    alert('Has cerrado sesión como administrador.');
  };

  const handleLoginSuccess = () => {
    setIsAdminLogged(true);
    localStorage.setItem('is_admin_logged', 'true');
    setCurrentTab('admin');
  };

  // Update State & save in localStorage + Supabase (if active)
  const handleUpdateState = async (newState: AppState) => {
    setState(newState);
    saveAppState(newState);

    if (isSupaActive) {
      setLoadingSupa(true);
      try {
        const success = await syncStateToSupabase(newState);
        if (!success) {
          console.warn('Supabase sync failed on state update');
        }
      } catch (error) {
        console.warn('Error in background state sync:', error);
      } finally {
        setLoadingSupa(false);
      }
    }
  };

  // Reset to pristine initial seed data
  const handleResetSeedData = async () => {
    if (confirm('¿Deseas restablecer todos los torneos, equipos, jugadores y fixture a los datos de fábrica? Tus cambios locales se perderán.')) {
      const defaultState: AppState = {
        tournaments: INITIAL_TOURNAMENTS,
        teams: INITIAL_TEAMS,
        players: INITIAL_PLAYERS,
        matches: INITIAL_MATCHES,
      };
      
      setState(defaultState);
      saveAppState(defaultState);
      setSelectedTournamentId(null);
      setCurrentTab('home');

      if (isSupaActive) {
        setLoadingSupa(true);
        const success = await syncStateToSupabase(defaultState);
        setLoadingSupa(false);
        if (success) {
          alert('Se han restablecido los datos semilla correctamente en el Almacenamiento Local y en tu Supabase Cloud.');
        } else {
          alert('Se restablecieron los datos locales, pero falló la sincronización con Supabase. Verifica la conexión.');
        }
      } else {
        alert('Se han restablecido los datos semilla en el almacenamiento local correctamente.');
      }
    }
  };

  // Safe navigation handler
  const handleNavigate = (tab: string, extraData?: any) => {
    setCurrentTab(tab);
    if (tab === 'tournaments' && extraData?.tournamentId) {
      setSelectedTournamentId(extraData.tournamentId);
    } else if (tab === 'tournaments' && !extraData?.tournamentId) {
      setSelectedTournamentId(null);
    }
  };

  // Derived selected tournament
  const selectedTournament = state.tournaments.find((t) => t.id === selectedTournamentId);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-[#4CAF50] selection:text-black transition-colors duration-300 ${
        themeMode === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'theme-dark bg-[#000000] text-zinc-100'
      }`}
      id="pdl-root-wrapper"
    >
      {/* GLOBAL NAVBAR HEADER */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isAdmin={isAdminLogged}
        onLogout={handleLogout}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* CORE ROUTING STAGE WITH ANIMATED TRANSITIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTab}-${selectedTournamentId}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {currentTab === 'home' && (
              <HomeView
                tournaments={state.tournaments}
                teams={state.teams}
                matches={state.matches}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'tournaments' && (
              selectedTournament ? (
                <TournamentDetailView
                  tournament={selectedTournament}
                  teams={state.teams}
                  players={state.players}
                  matches={state.matches}
                  onBack={() => setSelectedTournamentId(null)}
                />
              ) : (
                <TournamentsListView
                  tournaments={state.tournaments}
                  onSelectTournament={(id) => setSelectedTournamentId(id)}
                  onCreateTournamentClick={() => setCurrentTab('admin')}
                  isAdmin={isAdminLogged}
                />
              )
            )}

            {currentTab === 'teams' && (
              <TournamentDetailView
                // Pass the first active tournament to show teams in depth, or build category list
                tournament={state.tournaments[0] || INITIAL_TOURNAMENTS[0]}
                teams={state.teams}
                players={state.players}
                matches={state.matches}
                onBack={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'admin' && (
              isAdminLogged ? (
                <AdminView
                  tournaments={state.tournaments}
                  teams={state.teams}
                  players={state.players}
                  matches={state.matches}
                  onUpdateState={handleUpdateState}
                  isSupaConfigured={isSupaConfigured}
                  isSupaActive={isSupaActive}
                  loadingSupa={loadingSupa}
                  supaError={supaError}
                  onRefreshSupa={loadInitialData}
                />
              ) : (
                <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* COMPREHENSIVE LUXURY SPORTS BRAND FOOTER */}
      <footer className="bg-black/60 border-t border-zinc-900 py-12 mt-16 text-xs text-zinc-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-zinc-900">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-[#4CAF50] tracking-wider text-xs">PLAZA</span>
                <span className="font-display font-black text-white text-sm">DEPORTIVA LEIVA</span>
              </div>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                Plataforma web avanzada para la simulación, control táctico y visualización interactiva de ligas barriales, torneos de fútbol e indor. Diseñado para ofrecer la mejor experiencia deportiva.
              </p>
            </div>

            {/* Column 2: Rápido acceso */}
            <div className="space-y-2 col-span-1 md:col-span-1">
              <h4 className="text-white font-display uppercase tracking-widest text-xxs font-bold">Navegación</h4>
              <ul className="space-y-1.5 font-sans">
                <li>
                  <button id="btn-footer-nav-home" onClick={() => handleNavigate('home')} className="hover:text-brand-green transition-colors cursor-pointer">
                    Inicio / Landing
                  </button>
                </li>
                <li>
                  <button id="btn-footer-nav-tournaments" onClick={() => handleNavigate('tournaments')} className="hover:text-brand-green transition-colors cursor-pointer">
                    Competiciones Activas
                  </button>
                </li>
                {isAdminLogged && (
                  <li>
                    <button id="btn-footer-nav-admin" onClick={() => handleNavigate('admin')} className="hover:text-brand-green transition-colors cursor-pointer">
                      Panel Administrativo
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>&copy; {new Date().getFullYear()} Plaza Deportiva Leiva. Todos los derechos reservados.</span>
              <span className="text-zinc-800">•</span>
              <button
                id="btn-footer-admin-lock"
                onClick={() => handleNavigate('admin')}
                className="hover:text-[#4CAF50] transition-colors cursor-pointer text-[11px] font-mono flex items-center gap-1"
              >
                {isAdminLogged ? '🔓 Consola Activa' : '🔐 Acceso Admin'}
              </button>
            </div>
             <div className="flex items-center gap-2.5">
              <span className="text-zinc-500 text-xs sm:text-sm">Desarrollado por:</span>
              <a
                href="https://linktr.ee/FABRITEKHX"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-black text-white hover:text-brand-green transition-colors py-1 px-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-brand-green/30"
                id="fabritekhx-footer-link"
              >
                <img
                  src="https://cnikfcehhfvgnpzpwotm.supabase.co/storage/v1/object/sign/IMAGENES/LOGO/LOGO.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMDFjN2VjYi05ZjEzLTQ2ZmUtYTk3OS1mZDRlNGYwMWZjYTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJTUFHRU5FUy9MT0dPL0xPR08ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM5OTAxNiwiZXhwIjoyMDk4NzU5MDE2fQ.WqOi2iutNMDzrfStTMiNh0qd5-u-GC1cpKL0mNrXjuw"
                  alt="FABRITEKHX Logo"
                  className="w-6 h-6 object-contain"
                  referrerPolicy="no-referrer"
                  id="fabritekhx-logo-img"
                />
                <span className="font-display tracking-wider text-sm sm:text-base">FABRITEKHX</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
