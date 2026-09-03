import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden glass-card transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail with overlay gradient */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* View Case Study pill badge on hover */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#090D16]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-brand-600 transition-all duration-300 shadow-lg">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
            {project.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>{project.client || 'Orbitly Client'}</span>
          <span>{project.year || '2025'}</span>
        </div>
      </div>
    </Link>
  );
};
