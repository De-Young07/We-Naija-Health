// Email sender using Resend

import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY is not set');
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export function teamNotificationEmail(): string {
  return process.env.TEAM_NOTIFICATION_EMAIL || 'team.accesscare@gmail.com';
}

export function fromEmail(): string {
  // Use verified custom domain if provided, otherwise fallback to Resend's default onboarding address
  return process.env.RESEND_FROM_EMAIL || 'WeNaijaHealth <onboarding@resend.dev>';
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams) {
  const resend = getResend();

  const { data, error } = await resend.emails.send({
    from: fromEmail(),
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });

  if (error) {
    console.error('[Email] Resend API Error:', error);
    throw new Error(`Email send failed: ${error.message}`);
  }

  return data;
}
