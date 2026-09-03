import { Request, Response, NextFunction } from 'express';
import { Inquiry } from '../models/Inquiry';
import { AuthRequest } from '../middleware/authMiddleware';

// POST /api/inquiries
// Public: Customer submits new project inquiry from the website
export const createInquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project inquiry submitted successfully. Orbitly Studio will contact you soon.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/inquiries
// Protected: Admin retrieves all client project inquiries
export const getInquiries = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/inquiries/:id
// Protected: Admin updates inquiry status (e.g. marked as 'contacted' or 'archived')
export const updateInquiryStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/inquiries/:id
// Protected: Admin deletes an inquiry
export const deleteInquiry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
