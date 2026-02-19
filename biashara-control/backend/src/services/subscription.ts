export type SubscriptionState = 'trialing' | 'active' | 'past_due' | 'locked';

export type SubscriptionRecord = {
  status: SubscriptionState;
  trialEndAt: Date;
  paidUntil: Date | null;
  graceUntil: Date | null;
  lockedAt: Date | null;
};

export const resolveSubscriptionState = (s: SubscriptionRecord, now = new Date()): SubscriptionState => {
  if (s.lockedAt) return 'locked';
  if (s.paidUntil && s.paidUntil >= now) return 'active';
  if (s.status === 'trialing' && s.trialEndAt >= now) return 'trialing';
  if (s.graceUntil && s.graceUntil >= now) return 'past_due';
  if (s.trialEndAt < now) return 'past_due';
  return s.status;
};

export const computeGraceUntil = (s: SubscriptionRecord) => {
  const dueDate = s.paidUntil ?? s.trialEndAt;
  const graceUntil = new Date(dueDate);
  graceUntil.setDate(graceUntil.getDate() + 7);
  return graceUntil;
};

export const shouldLockBusiness = (s: SubscriptionRecord, now = new Date()) => {
  if (resolveSubscriptionState(s, now) === 'locked') return true;
  const graceUntil = s.graceUntil ?? computeGraceUntil(s);
  return now > graceUntil;
export const shouldLockBusiness = (s: SubscriptionRecord, now = new Date()) => {
  const state = resolveSubscriptionState(s, now);
  if (state === 'locked') return true;

  const graceDays = 7;
  const dueDate = s.paidUntil ?? s.trialEndAt;
  const lockDate = new Date(dueDate);
  lockDate.setDate(lockDate.getDate() + graceDays);

  return now > lockDate;
};

export const subscriptionGate = (state: SubscriptionState) => ({
  allowWrite: state !== 'locked',
  allowRead: true,
  allowExport: true,
  showPaywall: state === 'past_due' || state === 'locked'
  showLockBanner: state === 'past_due' || state === 'locked'
});

export const applyPayment = (current: SubscriptionRecord, paidAt: Date, months = 1): SubscriptionRecord => {
  const start = current.paidUntil && current.paidUntil > paidAt ? current.paidUntil : paidAt;
  const paidUntil = new Date(start);
  paidUntil.setMonth(paidUntil.getMonth() + months);

  return {
    ...current,
    status: 'active',
    paidUntil,
    graceUntil: null,
    lockedAt: null
  };
};

export const lockSubscription = (current: SubscriptionRecord, reason = 'unpaid'): SubscriptionRecord => ({
  ...current,
  status: 'locked',
  lockedAt: new Date(),
  graceUntil: current.graceUntil ?? computeGraceUntil(current)
});
    lockedAt: null
  };
};
