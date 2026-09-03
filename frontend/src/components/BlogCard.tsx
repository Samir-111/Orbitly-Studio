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
      className={`group block rounded-2xl overflow-hidden glass-card transition-all duration-300 flex flex-col h-full border hover:-translate-y-1 ${
        post.featured ? 'border-brand-500/40 ring-1 ring-brand-500/20' : 'border-[#20263A] hover:border-[#8B7CF6]/35'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500 text-white shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Featured Article</span>
          </div>
        )}

        {/* Arrow Badge */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#080B14]/80 backdrop-blur-md border border-[#20263A] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-brand-500 transition-all duration-200">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-normal">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8B7CF6]" />
              <span>{post.readTime || '4 min read'}</span>
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F7] group-hover:text-[#8B7CF6] transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#9CA3B5] line-clamp-2 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        </div>

        {/* Author Footer */}
        <div className="pt-3 border-t border-[#20263A]/80 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-[#9CA3B5]">{post.author}</span>
          <span className="text-[#8B7CF6] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
            Read Article →
          </span>
        </div>
      </div>
    </Link>
  );
};
