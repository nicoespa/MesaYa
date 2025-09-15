import { MessageProvider } from './provider';
import twilio from 'twilio';

export class SMSProvider implements MessageProvider {
  private client: twilio.Twilio;
  private fromNumber: string;
  private messagingServiceSid: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || '';
    this.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || '';

    if (!accountSid || !authToken) {
      throw new Error('Missing Twilio credentials');
    }

    this.client = twilio(accountSid, authToken);
  }

  private async sendSMS(to: string, body: string): Promise<{ id: string; cost?: number }> {
    try {
      // For trial accounts, check if number is verified first
      const messageOptions: any = {
        body,
        to: to,
        from: '+16316239279', // Use your verified Twilio number directly
      };

      const message = await this.client.messages.create(messageOptions);

      return {
        id: message.sid,
        cost: 0.0075, // Approximate cost per SMS
      };
    } catch (error: any) {
      // If it's a verification error, log it but don't fail completely
      if (error.code === 21608) {
        console.log(`⚠️  SMS no enviado: El número ${to} no está verificado en Twilio`);
        console.log(`📱 Para recibir SMS, verifica tu número en: https://console.twilio.com/us1/develop/phone-numbers/manage/verified`);
        console.log(`📝 Mensaje que se habría enviado: ${body}`);
        
        // Return a mock success for development
        return {
          id: `mock_${Date.now()}`,
          cost: 0,
        };
      }
      throw new Error(`SMS send failed: ${error}`);
    }
  }

  async sendTemplateJoinConfirm(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }> {
    const body = `Hola ${args.name}, te anotamos en la lista de espera de ${args.restaurantName}. Te avisaremos por mensaje cuando tu mesa esté lista. Ver tu lugar en la fila: ${args.link}`;
    return this.sendSMS(args.to, body);
  }

  async sendTemplateReminder(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
    etaMinutes: number;
  }): Promise<{ id: string; cost?: number }> {
    const body = `Hola ${args.name}, estás en la fila de ${args.restaurantName}. Tiempo estimado: ${args.etaMinutes} minutos. Estado: En espera. Ver tu lugar: ${args.link}`;
    return this.sendSMS(args.to, body);
  }

  async sendTemplateTableReady(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }> {
    const body = `¡Hola ${args.name}! Tu mesa está lista en ${args.restaurantName}. Por favor acercate al restaurante. Ver detalles: ${args.link}`;
    return this.sendSMS(args.to, body);
  }

  async sendVerificationCode(to: string, code: string): Promise<{ id: string; cost?: number }> {
    const body = `Tu código de verificación para FilaYA es: ${code}. Válido por 10 minutos.`;
    return this.sendSMS(to, body);
  }
}
