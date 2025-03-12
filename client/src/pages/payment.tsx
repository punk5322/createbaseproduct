import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function Payment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if payment is already completed
  if (user?.paymentStatus === "completed") {
    setLocation("/eula");
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Mock payment request
      await apiRequest("POST", "/api/payment", {});

      // Invalidate user query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      toast({
        title: "Payment Successful",
        description: "Please proceed to review the EULA",
      });
      setLocation("/eula");
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
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