import { Request, Response } from 'express';
import { Settings } from '../models/Settings';
import { UpdateSettingsInput } from '../validators/settingsValidator';

// @desc    Get studio contact settings (Public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json({
      success: true,
      data: {
        studioEmail: settings.studioEmail,
        location: settings.location,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error: any) {
    // If database lookup fails, return sensible fallback values seamlessly
    res.status(200).json({
      success: true,
      data: {
        studioEmail: 'hello@orbitly.studio',
        location: 'San Francisco, CA & Remote Worldwide',
      },
    });
  }
};

// @desc    Update studio contact settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (
  req: Request<{}, {}, UpdateSettingsInput>,
  res: Response
): Promise<void> => {
  try {
    const { studioEmail, location } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ studioEmail, location });
    } else {
      settings.studioEmail = studioEmail;
      settings.location = location;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Studio settings updated successfully.',
      data: {
        studioEmail: settings.studioEmail,
        location: settings.location,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update studio settings.',
    });
  }
};
