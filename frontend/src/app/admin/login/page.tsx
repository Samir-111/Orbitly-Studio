'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authApi } from '../../../services/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@orbitly.studio');
  const [password, setPassword] = useState('OrbitlyAdmin2025!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authApi.login({ email, password });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 space-y-3 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-[1px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0B101E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            ORBITLY<span className="text-brand-400 font-normal text-sm tracking-widest uppercase ml-1">Studio</span>
          </span>
        </Link>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-accent-emerald" />
          Administrator Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl relative z-10 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-bold text-white">Studio Admin Sign In</h1>
          <p className="text-xs text-slate-400">
            Authenticate to manage dynamic case studies and blog publications.
          </p>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-brand-400">Coding-Round Demo Credentials:</p>
          <p>Email: <code className="text-white font-mono bg-surface px-1.5 py-0.5 rounded">admin@orbitly.studio</code></p>
          <p>Password: <code className="text-white font-mono bg-surface px-1.5 py-0.5 rounded">OrbitlyAdmin2025!</code></p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@orbitly.studio"
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
