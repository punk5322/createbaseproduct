import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EULAPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const handleContinue = () => {
    if (!accepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms to continue",
        variant: "destructive",
      });
      return;
    }
    setLocation("/kyc");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>End User License Agreement (EULA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto bg-muted p-4 rounded-md text-sm">
              <h2 className="text-lg font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                This End User License Agreement ("EULA" or "Agreement") is a legally binding contract between you
                ("User," "you," or "your") and The Cur8 Group Corp. ("Company," "we," "us," or "our").
                This Agreement governs your access to and use of the CreateBase software platform, including any
                associated services, updates, or content (collectively, the "Software" or "Platform").
              </p>

              <h2 className="text-lg font-semibold mb-4">License Grant and Use Restrictions</h2>
              <p className="mb-4">
                Subject to your strict compliance with this EULA, The Cur8 Group Corp. grants you a limited,
                non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the
                Software solely for your personal or internal business purposes.
              </p>

              <h2 className="text-lg font-semibold mb-4">Intellectual Property Rights</h2>
              <p className="mb-4">
                The Software and all associated intellectual property rights are owned exclusively by
                The Cur8 Group Corp. or its licensors. You retain ownership of anything you upload,
                but you give us permission to use it as needed to operate our service.
              </p>

              <h2 className="text-lg font-semibold mb-4">User Obligations</h2>
              <p className="mb-4">
                You agree to comply with all applicable laws and regulations when using the Software,
                provide accurate information, and maintain the security of your account.
              </p>

              {/* Add more sections as needed from the provided EULA text */}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms in the license agreement
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/payment")}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinue}
              >
                Next: Verify Identity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}