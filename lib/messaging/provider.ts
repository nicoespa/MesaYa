export type MessagePayload = { 
  to: string; 
  body: string; 
  link?: string; 
};

export interface MessageProvider {
  sendTemplateJoinConfirm(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }>;
  
  sendTemplateReminder(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
    etaMinutes: number;
  }): Promise<{ id: string; cost?: number }>;
  
  sendTemplateTableReady(args: { 
    to: string; 
    name: string; 
    link: string; 
    restaurantName: string;
  }): Promise<{ id: string; cost?: number }>;
}

export interface NotificationRecord {
  party_id: string;
  channel: 'whatsapp' | 'sms';
  template: 'join_confirm' | 'reminder' | 'table_ready';
  status: 'queued' | 'sent' | 'failed';
  cost?: number;
  provider_id?: string;
}

export async function sendWithFallback(
  providerWA: MessageProvider,
  providerSMS: MessageProvider,
  template: 'join_confirm' | 'reminder' | 'table_ready',
  args: any,
  recordNotification: (record: NotificationRecord) => Promise<void>
): Promise<{ success: boolean; channel: string; provider_id: string; cost?: number }> {
  // Map template names to method names
  const methodMap = {
    'join_confirm': 'sendTemplateJoinConfirm',
    'reminder': 'sendTemplateReminder',
    'table_ready': 'sendTemplateTableReady',
  };
  
  const methodName = methodMap[template] as keyof MessageProvider;
  
  try {
    // Try WhatsApp first
    const result = await (providerWA[methodName] as any)(args);
    
    await recordNotification({
      party_id: args.partyId,
      channel: 'whatsapp',
      template,
      status: 'sent',
      cost: result.cost,
      provider_id: result.id,
    });
    
    return {
      success: true,
      channel: 'whatsapp',
      provider_id: result.id,
      cost: result.cost,
    };
  } catch (waError) {
    console.warn('WhatsApp failed, trying SMS fallback:', waError);
    
    try {
      // Fallback to SMS
      const result = await (providerSMS[methodName] as any)(args);
      
      await recordNotification({
        party_id: args.partyId,
        channel: 'sms',
        template,
        status: 'sent',
        cost: result.cost,
        provider_id: result.id,
      });
      
      return {
        success: true,
        channel: 'sms',
        provider_id: result.id,
        cost: result.cost,
      };
    } catch (smsError) {
      console.error('Both WhatsApp and SMS failed:', { waError, smsError });
      
      await recordNotification({
        party_id: args.partyId,
        channel: 'whatsapp', // Record as WhatsApp attempt
        template,
        status: 'failed',
      });
      
      throw new Error('All messaging channels failed');
    }
  }
}
