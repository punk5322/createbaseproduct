import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Redirect } from "wouter";

export default function Payment() {
  const { user, updateUserMutation } = useAuth(); 
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  if (user?.paymentStatus === "completed") {
    return <Redirect to="/eula" />;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await apiRequest("POST", "/api/payment", {});
      toast({
        title: "Payment successful",
        description: "Please proceed to review the EULA",
      });
      updateUserMutation.mutate({ ...user, paymentStatus: "completed" });
      setLocation("/eula");
    } catch (error: any) {
      toast({
        title: "Payment failed",
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