'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectsApi } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { Layers, RefreshCw, AlertCircle } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectsApi.getAll();
      setProjects(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filterCategories = ['All', 'UI/UX Design', 'Web Development', 'Mobile App', 'FinTech', 'AI/ML'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase())));

  return (
    <section id="work" className="py-24 relative bg-[#080C15]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 uppercase tracking-wider">
              Selected Work & Case Studies
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Products engineered for <span className="text-gradient-brand">market impact.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Explore how Orbitly Studio helps ambitious startups create transformative digital experiences.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === category
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-surface border border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl glass-card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-surface-elevated" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-surface-elevated rounded w-1/3" />
                  <div className="h-6 bg-surface-elevated rounded w-3/4" />
                  <div className="h-4 bg-surface-elevated rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl glass-card border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-slate-300 font-medium">{error}</p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="p-12 rounded-2xl glass-card text-center space-y-4 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No published projects found</h3>
            <p className="text-sm text-slate-400">
              There are currently no published projects in this category. Check back soon!
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
