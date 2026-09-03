import mongoose, { Document, Schema } from 'mongoose';

// BlogPost interface for TypeScript type safety
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// BlogPost schema for MongoDB
const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog post slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Short excerpt is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    author: {
      type: String,
      default: 'Orbitly Studio Team',
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast sorting of featured & published articles
blogPostSchema.index({ isPublished: 1, featured: -1, createdAt: -1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
