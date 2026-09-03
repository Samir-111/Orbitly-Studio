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
      className="group block rounded-2xl overflow-hidden glass-card transition-all duration-300 flex flex-col h-full border border-[#20263A] hover:border-[#8B7CF6]/35 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* View Case Study pill badge */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#080B14]/80 backdrop-blur-md border border-[#20263A] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-brand-500 transition-all duration-200">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-brand-500/10 text-[#8B7CF6] border border-brand-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F7] group-hover:text-[#8B7CF6] transition-colors line-clamp-2">
            {project.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-[#9CA3B5] line-clamp-2 leading-relaxed font-normal">
            {project.shortDescription}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-[#20263A]/80 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[#9CA3B5]">{project.client || 'Client Partnership'}</span>
          <span>{project.year || '2025'}</span>
        </div>
      </div>
    </Link>
  );
};
