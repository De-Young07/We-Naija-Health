// WhatsApp Cloud API Integration (Meta Graph API)

interface SendWhatsAppTextParams {
  to: string; // e.g. 2348012345678 or 08012345678
  message: string;
}

interface SendWhatsAppTemplateParams {
  to: string;
  templateName: string;
  languageCode?: string;
  parameters?: Array<{ type: string; text: string }>;
}

/**
 * Normalize Nigerian phone number to international E.164 format without '+'
 * e.g. '08012345678' -> '2348012345678'
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '234' + clean.substring(1);
  }
  return clean;
}

/**
 * Send a direct text message via Meta WhatsApp Business Cloud API
 */
export async function sendWhatsAppTextMessage({ to, message }: SendWhatsAppTextParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn('[WhatsApp] Skipped: WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured');
    return {
      success: false,
      skipped: true,
      reason: 'WhatsApp API credentials not configured in environment',
    };
  }

  const recipient = normalizePhoneForWhatsApp(to);
  const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: { preview_url: false, body: message },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[WhatsApp] Meta API Error:', data);
    throw new Error(`WhatsApp API failed: ${data.error?.message || response.statusText}`);
  }

  return { success: true, data };
}

/**
 * Send an approved Meta WhatsApp Template (required to initiate conversations outside the 24h window)
 */
export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  languageCode = 'en_US',
  parameters = [],
}: SendWhatsAppTemplateParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return {
      success: false,
      skipped: true,
      reason: 'WhatsApp API credentials not configured in environment',
    };
  }

  const recipient = normalizePhoneForWhatsApp(to);
  const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: parameters.length > 0 ? [
        {
          type: 'body',
          parameters: parameters,
        },
      ] : undefined,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[WhatsApp Template] Meta API Error:', data);
    throw new Error(`WhatsApp template failed: ${data.error?.message || response.statusText}`);
  }

  return { success: true, data };
}

