import mongoose, { Document, Schema } from 'mongoose';

// Interface for Client Project Inquiries submitted from website contact form
export interface IInquiry extends Document {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Primary need / service is required'],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, 'Estimated budget is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Project message/requirements are required'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly sort inquiries by newest first
inquirySchema.index({ createdAt: -1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);
