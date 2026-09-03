import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block rounded-2xl overflow-hidden glass-card transition-all duration-300 flex flex-col h-full ${
        post.featured ? 'border-brand-500/30 ring-1 ring-brand-500/20' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-lg shadow-brand-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Article</span>
          </div>
        )}

        {/* Arrow Badge */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#090D16]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-brand-600 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime || '4 min read'}</span>
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-400">{post.author}</span>
          <span className="text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Read Post →
          </span>
        </div>
      </div>
    </Link>
  );
};
