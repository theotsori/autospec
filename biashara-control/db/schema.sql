CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE plan_status AS ENUM ('trialing', 'active', 'past_due', 'locked');
CREATE TYPE ledger_source AS ENUM ('manual', 'mpesa', 'system');
CREATE TYPE ledger_type AS ENUM ('sale', 'expense', 'stock_purchase', 'supplier_payment', 'owner_withdrawal', 'owner_topup', 'transfer');
CREATE TYPE debt_direction AS ENUM ('owed_to_me', 'i_owe');
CREATE TYPE debt_status AS ENUM ('open', 'partial', 'closed', 'defaulted');
CREATE TYPE inventory_event_type AS ENUM ('stock_in', 'stock_out', 'adjustment');

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  phone_e164 VARCHAR(20) NOT NULL UNIQUE,
  category VARCHAR(40) NOT NULL DEFAULT 'retail',
  currency CHAR(3) NOT NULL DEFAULT 'KES',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Nairobi',
  preferred_language VARCHAR(8) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150),
  password_hash TEXT NOT NULL,
  pin_hash TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, email)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  plan_code VARCHAR(40) NOT NULL DEFAULT 'bc_monthly_3000',
  plan_price_kes INTEGER NOT NULL DEFAULT 3000,
  status plan_status NOT NULL DEFAULT 'trialing',
  trial_start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_end_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '14 days'),
  paid_until TIMESTAMPTZ,
  grace_until TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  lock_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  checkout_reference VARCHAR(60) NOT NULL,
  amount_kes INTEGER NOT NULL CHECK (amount_kes > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending','success','failed')),
  provider VARCHAR(20) NOT NULL DEFAULT 'mpesa_mock',
  paid_at TIMESTAMPTZ,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, checkout_reference)
);

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  wallet_type VARCHAR(32) NOT NULL CHECK (wallet_type IN ('cash', 'mpesa')),
  balance_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, wallet_type)
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source ledger_source NOT NULL,
  type ledger_type NOT NULL,
  amount_kes NUMERIC(14,2) NOT NULL CHECK (amount_kes >= 0),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('cash', 'mpesa', 'mixed')),
  note TEXT,
  happened_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES owners(id),
  idempotency_key VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, idempotency_key)
);
CREATE INDEX idx_ledger_business_time ON ledger_entries (business_id, happened_at DESC);
CREATE INDEX idx_ledger_business_type ON ledger_entries (business_id, type, happened_at DESC);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  unit_cost_kes NUMERIC(14,2) NOT NULL CHECK (unit_cost_kes >= 0),
  quantity_on_hand NUMERIC(14,3) NOT NULL DEFAULT 0,
  reorder_level NUMERIC(14,3) NOT NULL DEFAULT 0,
  sold_last_7d NUMERIC(14,3) NOT NULL DEFAULT 0,
  sold_last_30d NUMERIC(14,3) NOT NULL DEFAULT 0,
  last_movement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, name)
);

CREATE TABLE inventory_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  event_type inventory_event_type NOT NULL,
  quantity_delta NUMERIC(14,3) NOT NULL,
  unit_cost_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  note TEXT,
  happened_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inventory_events_business_time ON inventory_events (business_id, happened_at DESC);

CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  direction debt_direction NOT NULL,
  counterparty_name VARCHAR(120) NOT NULL,
  principal_kes NUMERIC(14,2) NOT NULL CHECK (principal_kes > 0),
  balance_kes NUMERIC(14,2) NOT NULL CHECK (balance_kes >= 0),
  due_date DATE,
  status debt_status NOT NULL DEFAULT 'open',
  risk_score SMALLINT NOT NULL DEFAULT 1 CHECK (risk_score BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_debts_business_status ON debts (business_id, status, due_date);

CREATE TABLE debt_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  amount_kes NUMERIC(14,2) NOT NULL CHECK (amount_kes > 0),
  happened_at TIMESTAMPTZ NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tax_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  estimated_tax_rate NUMERIC(5,4) NOT NULL DEFAULT 0.03,
  vat_registration_threshold_kes NUMERIC(14,2) NOT NULL DEFAULT 5000000,
  monthly_vat_warning_ratio NUMERIC(5,4) NOT NULL DEFAULT 0.80,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE daily_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  sales_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  expenses_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  stock_bought_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  profit_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  burn_rate_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_set_aside_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  cash_balance_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  mpesa_balance_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  stock_value_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  owed_to_me_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  i_owe_kes NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, snapshot_date)
);

CREATE TABLE mpesa_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  mode VARCHAR(20) NOT NULL DEFAULT 'mock' CHECK (mode IN ('mock')),
  shortcode VARCHAR(20),
  passkey TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  external_id VARCHAR(64) NOT NULL,
  trans_type VARCHAR(40) NOT NULL,
  amount_kes NUMERIC(14,2) NOT NULL,
  msisdn VARCHAR(20),
  payer_name VARCHAR(120),
  message TEXT,
  inferred_category ledger_type,
  happened_at TIMESTAMPTZ NOT NULL,
  raw_payload JSONB NOT NULL,
  mapped_ledger_entry_id UUID REFERENCES ledger_entries(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, external_id)
);

CREATE TABLE device_sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  operation VARCHAR(60) NOT NULL,
  payload JSONB NOT NULL,
  idempotency_key VARCHAR(120) NOT NULL,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  UNIQUE (business_id, idempotency_key)
);

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_businesses_touch BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_subscriptions_touch BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_inventory_items_touch BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_debts_touch BEFORE UPDATE ON debts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_ledger_policy ON ledger_entries
  USING (business_id = current_setting('app.business_id', true)::uuid)
  WITH CHECK (business_id = current_setting('app.business_id', true)::uuid);

CREATE POLICY tenant_inventory_policy ON inventory_items
  USING (business_id = current_setting('app.business_id', true)::uuid)
  WITH CHECK (business_id = current_setting('app.business_id', true)::uuid);

CREATE POLICY tenant_debts_policy ON debts
  USING (business_id = current_setting('app.business_id', true)::uuid)
  WITH CHECK (business_id = current_setting('app.business_id', true)::uuid);
