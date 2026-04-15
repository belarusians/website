CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  newsletter_type text NOT NULL CHECK (newsletter_type IN ('financial_report', 'events')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  unsubscribe_token text NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text,
  source text NOT NULL CHECK (source IN ('stripe_webhook', 'stripe_backfill', 'manual')),
  unsubscribe_source text CHECK (unsubscribe_source IN ('user', 'stripe_subscription_lapsed')),
  welcome_email_pending boolean NOT NULL DEFAULT true,
  welcome_email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, newsletter_type)
);

CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions (stripe_subscription_id);
