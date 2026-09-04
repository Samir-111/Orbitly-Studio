import mongoose, { Document, Schema } from 'mongoose';

// Project interface for TypeScript type safety
export interface IProject extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  shortDescription: string;
  description: string;
  tags: string[];
  client?: string;
  year?: string;
  deliverables?: string[];
  challenge?: string;
  solution?: string;
  results?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Project schema for MongoDB
const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Project thumbnail image URL is required'],
    },
    thumbnailPublicId: {
      type: String,
      default: null,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short summary description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Full project description is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    client: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    deliverables: {
      type: [String],
      default: [],
    },
    challenge: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
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

// Index for filtering published projects quickly
projectSchema.index({ isPublished: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
