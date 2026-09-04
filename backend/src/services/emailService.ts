import { Resend } from 'resend';
import { IInquiry } from '../models/Inquiry';
import { Settings } from '../models/Settings';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client only if API key is provided
const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 're_your_resend_api_key') {
    return null;
  }
  return new Resend(apiKey);
};

// Default sender email (Resend onboarding address or custom verified domain)
const getSenderEmail = (): string => {
  return process.env.RESEND_FROM_EMAIL || 'Orbitly Studio <onboarding@resend.dev>';
};

/**
 * Sends an email notification to the studio admin whenever a new inquiry is submitted
 */
export const sendInquiryNotificationToAdmin = async (inquiry: IInquiry): Promise<boolean> => {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[EmailService] RESEND_API_KEY is not configured. Skipping admin inquiry email notification.'
      );
      return false;
    }

    // Retrieve configured studio email or fallback to environment variable
    let adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) {
      try {
        const settings = await Settings.findOne();
        adminEmail = settings?.studioEmail || 'admin@orbitly.studio';
      } catch {
        adminEmail = 'admin@orbitly.studio';
      }
    }

    const formattedDate = new Date(inquiry.createdAt || Date.now()).toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060911; color: #e2e8f0; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 24px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 32px 24px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; background-color: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 16px; }
            .field-group { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { font-size: 14px; color: #f8fafc; font-weight: 500; }
            .message-box { background-color: #060911; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; font-size: 13px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-top: 8px; }
            .footer { padding: 20px 24px; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
            .cta-button { display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Orbitly Studio — New Project Inquiry</h1>
            </div>
            <div class="content">
              <span class="badge">New Lead Received</span>
              
              <div class="field-group">
                <div class="label">Client Name</div>
                <div class="value">${inquiry.name}</div>
              </div>

              <div class="field-group">
                <div class="label">Client Email</div>
                <div class="value"><a href="mailto:${inquiry.email}" style="color: #38bdf8; text-decoration: none;">${inquiry.email}</a></div>
              </div>

              <div class="field-group">
                <div class="label">Primary Service / Need</div>
                <div class="value">${inquiry.service}</div>
              </div>

              <div class="field-group">
                <div class="label">Estimated Budget</div>
                <div class="value">${inquiry.budget}</div>
              </div>

              <div class="field-group">
                <div class="label">Project Brief / Message</div>
                <div class="message-box">${inquiry.message}</div>
              </div>

              <div class="field-group">
                <div class="label">Submitted At</div>
                <div class="value" style="font-size: 12px; color: #94a3b8;">${formattedDate}</div>
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${inquiry.email}?subject=Orbitly Studio — Re: Your Project Inquiry" class="cta-button">Reply Directly to Client</a>
              </div>
            </div>
            <div class="footer">
              Orbitly Studio Platform • Automated Admin Lead Dispatch
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: adminEmail,
      subject: `[New Inquiry] ${inquiry.name} — ${inquiry.service}`,
      html: emailHtml,
    });

    if (error) {
      console.warn('[EmailService] ⚠️ Resend error sending admin notification:', error.message || error);
      return false;
    }

    console.log(`[EmailService] ✅ Admin notification email successfully sent to ${adminEmail} (ID: ${data?.id})`);
    return true;
  } catch (err: any) {
    console.warn('[EmailService] ⚠️ Unexpected error sending admin email:', err.message || err);
    return false;
  }
};

/**
 * Sends an automated confirmation email to the client acknowledging their project brief
 */
export const sendInquiryConfirmationToClient = async (inquiry: IInquiry): Promise<boolean> => {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[EmailService] RESEND_API_KEY is not configured. Skipping client confirmation email.'
      );
      return false;
    }

    if (!inquiry.email || !inquiry.email.includes('@')) {
      return false;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060911; color: #e2e8f0; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); padding: 28px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; }
            .content { padding: 32px 24px; line-height: 1.6; }
            .greeting { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 16px; }
            .summary-card { background-color: #060911; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; }
            .summary-item { margin-bottom: 12px; }
            .summary-item:last-child { margin-bottom: 0; }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
            .value { font-size: 13px; color: #e2e8f0; font-weight: 500; margin-top: 2px; }
            .steps-box { background-color: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 12px; padding: 16px; margin: 20px 0; }
            .footer { padding: 20px 24px; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Orbitly Studio</h1>
              <p>Next-Gen Digital Product & Experience Studio</p>
            </div>
            <div class="content">
              <div class="greeting">Hi ${inquiry.name},</div>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 16px 0;">
                Thank you for reaching out to <strong>Orbitly Studio</strong>! We have received your project inquiry and our design & engineering leads are currently reviewing your brief.
              </p>

              <div class="summary-card">
                <div class="summary-item">
                  <div class="label">Service Required</div>
                  <div class="value">${inquiry.service}</div>
                </div>
                <div class="summary-item">
                  <div class="label">Budget Estimate</div>
                  <div class="value">${inquiry.budget}</div>
                </div>
                <div class="summary-item">
                  <div class="label">Your Message</div>
                  <div class="value" style="color: #94a3b8; font-style: italic;">"${inquiry.message}"</div>
                </div>
              </div>

              <div class="steps-box">
                <div style="font-weight: 600; color: #34d399; font-size: 13px; margin-bottom: 4px;">⚡ What happens next?</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                  Our team typically reviews all project briefs within <strong>24 to 48 hours</strong>. We will get in touch with you directly at this email address to schedule an introductory discovery call.
                </p>
              </div>

              <p style="color: #cbd5e1; font-size: 14px; margin: 16px 0 0 0;">
                Warm regards,<br>
                <strong>The Orbitly Studio Team</strong>
              </p>
            </div>
            <div class="footer">
              Orbitly Studio • San Francisco, CA & Remote Worldwide<br>
              <span style="font-size: 11px; color: #475569;">You are receiving this email because you submitted an inquiry at orbitly.studio</span>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: inquiry.email,
      subject: `Thank you for contacting Orbitly Studio! We've received your inquiry`,
      html: emailHtml,
    });

    if (error) {
      if (error.name === 'validation_error' && error.message?.includes('testing emails')) {
        console.warn(
          `[EmailService] ℹ️ Resend Sandbox Note: In free testing mode, Resend only sends to your registered account (${process.env.ADMIN_NOTIFICATION_EMAIL}). To send to all client emails like '${inquiry.email}', verify a custom domain at resend.com/domains.`
        );
      } else {
        console.warn('[EmailService] ⚠️ Resend error sending client confirmation email:', error.message || error);
      }
      return false;
    }

    console.log(`[EmailService] ✅ Client confirmation email successfully sent to ${inquiry.email} (ID: ${data?.id})`);
    return true;
  } catch (err: any) {
    console.warn('[EmailService] ⚠️ Unexpected error sending client confirmation email:', err.message || err);
    return false;
  }
};
