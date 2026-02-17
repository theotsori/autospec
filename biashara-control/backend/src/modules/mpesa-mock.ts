import { randomUUID } from 'crypto';

type SimulatedMpesaInput = {
  amountKes: number;
  msisdn: string;
  message: string;
  happenedAt: string;
};

export type MpesaCategory = 'sale' | 'expense' | 'supplier_payment' | 'owner_withdrawal' | 'transfer';

export const inferCategory = (message: string): MpesaCategory => {
  const m = message.toLowerCase();
  if (m.includes('supplier') || m.includes('wholesale')) return 'supplier_payment';
  if (m.includes('withdraw') || m.includes('owner')) return 'owner_withdrawal';
  if (m.includes('transfer')) return 'transfer';
  if (m.includes('buy') || m.includes('expense') || m.includes('bill')) return 'expense';
  return 'sale';
};

export const buildMockWebhookPayload = (input: SimulatedMpesaInput) => {
  const category = inferCategory(input.message);

  return {
    transactionId: `MOCK-${randomUUID()}`,
    transType: 'CustomerPayBillOnline',
    amountKes: input.amountKes,
    msisdn: input.msisdn,
    message: input.message,
    happenedAt: input.happenedAt,
    category,
    rawPayload: {
      ResultCode: 0,
      ResultDesc: 'The service request is processed successfully.',
      CallbackMetadata: {
        Item: [
          { Name: 'Amount', Value: input.amountKes },
          { Name: 'MpesaReceiptNumber', Value: `RCP${Date.now()}` },
          { Name: 'PhoneNumber', Value: input.msisdn }
        ]
      }
    }
  };
};
