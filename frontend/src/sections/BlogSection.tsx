'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { blogApi } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { BookOpen, RefreshCw, AlertCircle } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getAll();
      setPosts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <section id="blog" className="py-24 relative section-radial-bg border-t border-[#20263A]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="max-w-2xl mb-14 space-y-3">
            <div className="text-xs font-semibold text-[#8B7CF6] uppercase tracking-wider">
              Studio Journal
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
              Latest insights & thinking.
            </h2>
            <p className="text-base sm:text-lg text-[#9CA3B5]">
              Thoughts on product design, modern software engineering, and startup scaling.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl glass-card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-surface-elevated" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-surface-elevated rounded w-1/4" />
                  <div className="h-6 bg-surface-elevated rounded w-4/5" />
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
              onClick={fetchBlogPosts}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="p-12 rounded-2xl glass-card text-center space-y-3 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No published articles yet</h3>
            <p className="text-xs text-slate-400">
              Check back soon for new studio engineering and design insights.
            </p>
          </div>
        )}

        {/* Blog Cards Grid with Staggered Scroll Reveal */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 6).map((post, index) => (
              <ScrollReveal key={post._id} delay={index * 80}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
