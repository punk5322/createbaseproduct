import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePayment } from "@/hooks/use-payment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Payment() {
  const { user } = useAuth();
  const { paymentMutation } = usePayment();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment successful",
        description: "Please proceed to review the EULA",
      });
      setLocation("/eula");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (user?.paymentStatus === "completed") {
    setLocation("/eula");
    return null;
  }

  const handlePayment = async () => {
    try {
      await paymentMutation.mutateAsync();
      // After successful payment, update user status
      updateUserMutation.mutate({ paymentStatus: "completed" });
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Platform Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">One-time Setup Fee</h3>
                <p className="text-2xl font-bold">$20.00</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This covers identity verification, royalty recovery, and ongoing collection services.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/how-it-works")}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={paymentMutation.isPending || updateUserMutation.isPending}
                  className="flex-1"
                >
                  {paymentMutation.isPending || updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay $20"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}