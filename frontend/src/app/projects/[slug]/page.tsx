'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { projectsApi } from '../../../services/api';
import { Project } from '../../../types';
import { ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw, Calendar, Building, Sparkles } from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await projectsApi.getBySlug(slug);
      setProject(res.data);
    } catch (err: any) {
      setError(err.message || 'Project not found or unpublished.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {/* Back Navigation */}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Case Studies</span>
          </Link>

          {/* Loading State */}
          {loading && (
            <div className="space-y-8 animate-pulse">
              <div className="h-10 bg-surface-elevated rounded-lg w-3/4" />
              <div className="aspect-[16/9] bg-surface-elevated rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-surface-elevated rounded w-full" />
                <div className="h-4 bg-surface-elevated rounded w-5/6" />
                <div className="h-4 bg-surface-elevated rounded w-4/6" />
              </div>
            </div>
          )}

          {/* Error / 404 State */}
          {!loading && error && (
            <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Case Study Not Found</h1>
                <p className="text-sm text-slate-400">
                  {error} It may be an unpublished draft or the link may be incorrect.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={fetchProject}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />
                  Retry
                </button>
                <Link
                  href="/#work"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
                >
                  Browse All Work
                </Link>
              </div>
            </div>
          )}

          {/* Project Content */}
          {!loading && project && (
            <article className="space-y-12">
              {/* Header */}
              <div className="space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {project.title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pt-2 border-t border-b border-white/5 py-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-400" />
                    <span>Client: <strong className="text-slate-200">{project.client || 'Orbitly Client'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    <span>Year: <strong className="text-slate-200">{project.year || '2025'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="aspect-[16/9] rounded-3xl overflow-hidden glass-panel">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Case Study Grid: Overview & Deliverables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Overview */}
                <div className="lg:col-span-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white">Project Overview</h2>
                  <div className="text-base text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                    {project.description}
                  </div>
                </div>

                {/* Sidebar Deliverables */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      Studio Deliverables
                    </h3>
                    <ul className="space-y-2.5">
                      {(project.deliverables && project.deliverables.length > 0
                        ? project.deliverables
                        : ['Product Discovery', 'Design System', 'Frontend Engineering', 'API Integration']
                      ).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Deep Dive: Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="glass-panel p-8 rounded-2xl space-y-4">
                  <div className="inline-flex px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400">
                    The Challenge
                  </div>
                  <h3 className="text-xl font-bold text-white">What we needed to solve</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {project.challenge || 'Designing an architecture capable of processing high-volume requests while delivering sub-second page transitions.'}
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl space-y-4">
                  <div className="inline-flex px-3 py-1 rounded-md bg-accent-emerald/10 border border-accent-emerald/20 text-xs font-semibold text-accent-emerald">
                    The Solution
                  </div>
                  <h3 className="text-xl font-bold text-white">How Orbitly delivered</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {project.solution || 'Implemented a modular component design system, edge caching, and automated end-to-end testing pipelines.'}
                  </p>
                </div>
              </div>

              {/* Results Banner */}
              {project.results && (
                <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-900/40 via-surface to-brand-900/20 border border-brand-500/30 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Business Impact & Key Metrics
                  </p>
                  <p className="text-lg font-semibold text-white leading-relaxed">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="p-10 rounded-3xl glass-card text-center space-y-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Want to build a product like this?
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Our multidisciplinary engineering and design team is ready to accelerate your technical roadmap.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg"
                >
                  <span>Start Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
