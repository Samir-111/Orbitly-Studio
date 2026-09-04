import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  studioEmail: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    studioEmail: {
      type: String,
      required: [true, 'Studio email is required'],
      trim: true,
      lowercase: true,
      default: 'hello@orbitly.studio',
    },
    location: {
      type: String,
      required: [true, 'Studio location is required'],
      trim: true,
      default: 'San Francisco, CA & Remote Worldwide',
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to get existing settings or initialize with defaults
settingsSchema.statics.getSettings = async function (): Promise<ISettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      studioEmail: 'hello@orbitly.studio',
      location: 'San Francisco, CA & Remote Worldwide',
    });
  }
  return settings;
};

export interface SettingsModel extends mongoose.Model<ISettings> {
  getSettings(): Promise<ISettings>;
}

export const Settings = mongoose.model<ISettings, SettingsModel>('Settings', settingsSchema);
