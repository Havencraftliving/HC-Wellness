export type AppEnv = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  ODOO_URL?: string;
  ODOO_DB?: string;
  ODOO_API_KEY?: string;
};

function blankToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function readAppEnv(
  source: Record<string, string | undefined> = process.env,
): AppEnv {
  return {
    STRIPE_SECRET_KEY: blankToUndefined(source.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: blankToUndefined(source.STRIPE_WEBHOOK_SECRET),
    NEXT_PUBLIC_SITE_URL: blankToUndefined(source.NEXT_PUBLIC_SITE_URL),
    ODOO_URL: blankToUndefined(source.ODOO_URL),
    ODOO_DB: blankToUndefined(source.ODOO_DB),
    ODOO_API_KEY: blankToUndefined(source.ODOO_API_KEY),
  };
}

export function isStripeConfigured(env: AppEnv): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export function isStripeWebhookConfigured(env: AppEnv): boolean {
  return Boolean(env.STRIPE_WEBHOOK_SECRET && env.STRIPE_SECRET_KEY);
}

export function isOdooConfigured(env: AppEnv): boolean {
  return Boolean(env.ODOO_URL && env.ODOO_DB && env.ODOO_API_KEY);
}
