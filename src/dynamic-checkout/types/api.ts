interface Transaction {
  status: string;
}

type Invoice = {
  id: string;
  name: string;
  customer_id: string;
  order_id: string | null;
  amount: string;
  currency: string;
  require_backend_capture: boolean | null;
  return_url: string;
  tax: string | null;
  payment_type: string | null;
  payment_methods: PaymentMethod[];
  expires_at: string | null;
  metadata: Record<string, unknown>;
  transaction: Transaction;
};

type PaymentMethod = {
  type: string;
  flow?: string;
  applepay?: ApplePay;
  googlepay?: GooglePay;
  display?: Display;
  card?: Card;
  apm?: Apm;
  apm_customer_token?: Apm;
  card_customer_token?: Apm;
};

type GooglePay = {
  allowed_auth_methods: string[];
  allowed_card_networks: string[];
  allow_prepaid_cards: boolean;
  allow_credit_cards: boolean;
  gateway: string;
  gateway_merchant_id: string;
};

type ApplePay = {
  merchant_id: string;
  country_code: string;
  supported_networks: string[];
  merchant_capabilities: string[];
};

type Display = {
  name: string;
  description: string;
  logo: Logo;
  brand_color: BrandColor;
};

type Logo = {
  light_url: Url;
  dark_url: Url;
};

type Url = {
  vector: string;
  raster: string;
};

type BrandColor = {
  light: string;
  dark: string;
};

type Card = {
  cvc_required: boolean;
  cardholder_name_required: boolean;
  scheme_selection_allowed: boolean;
  saving_allowed: boolean;
  billing_address: BillingAddress;
};

type BillingAddress = {
  collection_mode: string;
  restrict_to_country_codes: string[];
};

type Apm = {
  saving_allowed: boolean;
  gateway_configuration_id?: string;
  redirect_url?: string;
  customer_token_id?: string;
  gateway_name?: string;
  gateway_logo: {
    light_url: {
      raster: string;
    };
    dark_url: {
      raster: string;
    };
  };
  deleting_allowed?: boolean;
};
