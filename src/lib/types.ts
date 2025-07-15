export type ApiResponse = {
  status: "success" | "error";
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
};

// Razorpay Error Types
export type RazorpayError = {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  field?: string;
};

export type RazorpayErrorResponse = {
  error: RazorpayError;
};

// Validation Error Types
export type ValidationError = {
  errors: string[];
  properties?: {
    [key: string]: { errors: string[] };
  };
};

export type ValidationErrorResponse = {
  error: ValidationError;
};

// Generic Error Response
export type GenericErrorResponse = {
  error: string;
};

// Combined Error Response Types
export type ApiErrorResponse =
  | RazorpayErrorResponse
  | ValidationErrorResponse
  | GenericErrorResponse;

// Razorpay Order Types
export type RazorpayOrderStatus = "created" | "attempted" | "paid" | "captured";

export type RazorpayOrder = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  offer_id: string | null;
  offers?: string[];
  status: RazorpayOrderStatus;
  attempts: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes: Record<string, any>[];
  created_at: number;
};

export type RazorpayOrderCollection = {
  entity: "collection";
  count: number;
  items: RazorpayOrder[];
};

// Order Creation Request Types
export type CreateOrderRequest = {
  amount: number;
  currency: string;
  receipt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: Record<string, any>;
  partial_payment?: boolean;
  callback_url?: string;
  callback_method?: string;
};

export type CreateOrderResponse = {
  orderId: string;
};

// Price Conversion Types
export type CurrencyType =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "SGD"
  | "AED"
  | "SAR"
  | "QAR"
  | "BHD"
  | "KWD"
  | "OMR"
  | "JOD"
  | "LYD" // Two and Three decimal currencies
  | "JPY"
  | "VND"
  | "KRW"
  | "CLP"
  | "PYG"
  | "ISK"
  | "BIF"
  | "DJF"
  | "GNF"
  | "KMF"
  | "MGA"
  | "RWF"
  | "XOF"
  | "XAF"
  | "XPF"; // Zero decimal currencies

export type ZeroDecimalCurrency =
  | "JPY"
  | "VND"
  | "KRW"
  | "CLP"
  | "PYG"
  | "ISK"
  | "BIF"
  | "DJF"
  | "GNF"
  | "KMF"
  | "MGA"
  | "RWF"
  | "XOF"
  | "XAF"
  | "XPF";

export type ThreeDecimalCurrency = "KWD" | "BHD" | "OMR" | "JOD" | "LYD";

export type TwoDecimalCurrency =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "SGD"
  | "AED"
  | "SAR"
  | "QAR";

// Payment Types
export type PaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "card"
  | "netbanking"
  | "wallet"
  | "emi"
  | "upi"
  | "paylater";

export type RazorpayPayment = {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes: Record<string, any>[];
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
};

// API Response Types
export type CreateOrderApiResponse =
  | CreateOrderResponse
  | RazorpayErrorResponse;

export type GetOrderApiResponse = RazorpayOrder | RazorpayErrorResponse;

export type GetAllOrdersApiResponse =
  | RazorpayOrderCollection
  | RazorpayErrorResponse;
