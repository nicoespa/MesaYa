import { MessageProvider } from './provider';

export class WhatsAppProvider implements MessageProvider {
  private baseUrl: string;
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.baseUrl = process.env.WHATSAPP_BASE_URL || 'https://graph.facebook.com/v21.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
  }

  private async sendTemplate(templateName: string, to: string, components: any[]) {
    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace('+', ''),
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'es' },
        components: components,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WhatsApp API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return {
      id: data.messages?.[0]?.id || 'unknown',
      cost: 0.05, // Approximate cost per message
    };
  }

  async sendTemplateJoinConfirm(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }> {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: args.name },
          { type: 'text', text: args.restaurantName },
          { type: 'text', text: args.link },
        ],
      },
    ];

    return this.sendTemplate('join_confirm', args.to, components);
  }

  async sendTemplateReminder(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
    etaMinutes: number;
  }): Promise<{ id: string; cost?: number }> {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: args.name },
          { type: 'text', text: args.restaurantName },
          { type: 'text', text: args.etaMinutes.toString() },
          { type: 'text', text: 'En espera' },
          { type: 'text', text: args.link },
        ],
      },
    ];

    return this.sendTemplate('reminder', args.to, components);
  }

  async sendTemplateTableReady(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }> {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: args.restaurantName },
          { type: 'text', text: `Hola ${args.name}, tu mesa está lista!` },
        ],
      },
    ];

    return this.sendTemplate('table_ready', args.to, components);
  }
}
