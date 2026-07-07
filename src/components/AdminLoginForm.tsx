/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ShieldAlert, Eye, EyeOff, LogIn } from 'lucide-react';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default credentials
  const ADMIN_USER = 'adminpdl';
  const ADMIN_PASS = '741456963';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate small, clean authentication delay for high-fidelity feel
    setTimeout(() => {
      if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
        onLoginSuccess();
      } else {
        setError('El usuario o la contraseña ingresados son incorrectos.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
      >
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-black text-white tracking-wide mt-3">
              Consola del Administrador
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Ingresa tus credenciales autorizadas para gestionar los torneos, equipos, jugadores e incidencias de partidos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xxs font-mono uppercase tracking-widest text-zinc-500 block">
                Nombre de Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="input-login-username"
                  type="text"
                  placeholder="adminpdl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-brand-green focus:outline-none text-sm text-white transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xxs font-mono uppercase tracking-widest text-zinc-500 block">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black border border-zinc-800 focus:border-brand-green focus:outline-none text-sm text-white transition-all placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  id="btn-login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex gap-2.5 items-start"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-black font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-wait font-display shadow-lg shadow-brand-green/5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Acceder a la Consola</span>
                </>
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
