import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePayment() {
  const { toast } = useToast();

  const paymentMutation = useMutation({
    mutationFn: async () => {
      // Mock payment processing
      const response = await apiRequest("POST", "/api/payment", {
        payment_method: "card",
        amount: 999, // $9.99
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { paymentMutation };
}
