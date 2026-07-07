/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Trophy, Home, Users, Settings, Flame, Sun, Moon } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({
  currentTab,
  onNavigate,
  isAdmin,
  onLogout,
  themeMode,
  onToggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'tournaments', label: 'Torneos', icon: Trophy },
    { id: 'teams', label: 'Equipos', icon: Users },
  ];

  const displayedItems = menuItems;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <BrandLogo size="sm" showText={false} variant="dark" className="bg-white p-1 rounded-xl border border-zinc-200 shadow-sm" />
            <div className="flex flex-col select-none">
              <span className="font-display font-extrabold text-[#4CAF50] text-sm tracking-widest leading-none">PLAZA</span>
              <span className="font-display font-black text-white text-base tracking-normal leading-none mt-0.5">DEPORTIVA</span>
              <span className="font-display font-semibold text-[#4CAF50] text-[10px] tracking-wider leading-none mt-0.5">LEIVA</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-2">
            {displayedItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`btn-nav-desktop-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-brand-green bg-brand-green/8'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}

                  {/* Little active dot marker */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-green"
                    />
                  )}
                </button>
              );
            })}
            {isAdmin && (
              <button
                id="btn-nav-logout"
                onClick={onLogout}
                className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/8 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-rose-500/10"
              >
                Cerrar Sesión
              </button>
            )}
            <button
              id="btn-nav-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              className={`ml-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={themeMode === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            >
              {themeMode === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </nav>

          {/* MOBILE BURGER ACTION BUTTON */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="btn-nav-mobile-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={themeMode === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            >
              {themeMode === 'light' ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
            <button
              id="btn-nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER ACCORDION MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {displayedItems.map((item) => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`btn-nav-mobile-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-brand-green text-black font-extrabold'
                        : 'text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
              {isAdmin && (
                <button
                  id="btn-nav-mobile-logout"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all text-left text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer border border-rose-500/10 mt-2"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
