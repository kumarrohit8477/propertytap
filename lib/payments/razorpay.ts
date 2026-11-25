export const RAZORPAY_KEY_ID = process.env.PUBLIC_RAZORPAY_KEY_ID || '';

/**
 * Dynamically loads the Razorpay checkout script into the DOM.
 */
export function load_razorpay_script(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existing_script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing_script) {
      existing_script.addEventListener('load', () => resolve(true));
      existing_script.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutOptions {
  key?: string;
  amount: number; // in paise
  currency?: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

/**
 * Opens the Razorpay checkout popup.
 */
export async function open_razorpay_checkout(options: RazorpayCheckoutOptions): Promise<boolean> {
  const is_loaded = await load_razorpay_script();
  if (!is_loaded) {
    console.error('Failed to load Razorpay SDK');
    return false;
  }

  const razorpay = new (window as any).Razorpay({
    key: options.key || RAZORPAY_KEY_ID,
    ...options,
  });

  razorpay.open();
  return true;
}

