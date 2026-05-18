"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/checkout";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function BuyButton({ productId, price }: { productId: string, price: number }) {
  const [isPending, startTransition] = useTransition();

  const handleBuy = () => {
    startTransition(async () => {
      const result = await createCheckoutSession(productId);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button 
      onClick={handleBuy} 
      disabled={isPending}
      className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
    >
      <Lock className="h-5 w-5" />
      {isPending ? "Initializing..." : `Buy Now for NGN ${price.toLocaleString()}`}
    </Button>
  );
}
