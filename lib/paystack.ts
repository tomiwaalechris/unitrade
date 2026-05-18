export interface PaystackTransactionInitialize {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference?: string;
  callback_url?: string;
  subaccount?: string; // The vendor's subaccount id
  transaction_charge?: number; // Optional flat fee
  split_code?: string;
}

export async function initializeTransaction(data: PaystackTransactionInitialize) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || "Failed to initialize Paystack transaction");
  }

  return body.data;
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || "Failed to verify Paystack transaction");
  }

  return body.data;
}
