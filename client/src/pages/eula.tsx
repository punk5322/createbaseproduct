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
                The Cur8 Group Corp. or its licensors. You retain ownership of your intellectual property rights 
                in any User Content uploaded to the Platform.
              </p>

              <h2 className="text-lg font-semibold mb-4">User Content and Intellectual Property Disclaimer</h2>
              <p className="mb-4">
                By uploading, submitting, or otherwise making available content through the Platform ("User Content"), 
                you retain ownership of your intellectual property rights in the User Content.
                The Cur8 Group Corp. expressly disclaims any ownership or control over the copyrights or other 
                intellectual property rights of any User Content uploaded to the Platform.
              </p>

              <h2 className="text-lg font-semibold mb-4">IP Metadata Registration and Royalty Collection</h2>
              <p className="mb-4">
                By using the Platform, you authorize The Cur8 Group Corp. to register creative intellectual property (IP) metadata 
                on your behalf and to act as your publishing entity for the sole purpose of facilitating royalty collection.
                The Cur8 Group Corp. expressly disclaims any ownership or control over the copyrights to any IP referenced 
                by user-uploaded metadata.
              </p>

              <h2 className="text-lg font-semibold mb-4">User Obligations and Prohibited Activities</h2>
              <p className="mb-4">
                You agree to comply with all applicable laws, regulations, and acceptable use policies when using the Software.
                You must provide accurate, current, and complete information as required for your use of the Software.
                You must maintain the security and confidentiality of your account credentials.
              </p>

              <h2 className="text-lg font-semibold mb-4">Termination</h2>
              <p className="mb-4">
                The Cur8 Group Corp. reserves the right to suspend or terminate your access to the Software at any time
                and for any reason, with or without cause, including for your breach of this EULA.
              </p>

              <h2 className="text-lg font-semibold mb-4">Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                This Agreement is governed by Delaware law. Any disputes will be resolved exclusively in San Diego County, California.
                Any disputes arising from this EULA shall be resolved through binding arbitration in San Diego, California.
              </p>

              <h2 className="text-lg font-semibold mb-4">Miscellaneous</h2>
              <p className="mb-4">
                This EULA constitutes the entire agreement between you and The Cur8 Group Corp. concerning the Software.
                No waiver of any term of this EULA shall be deemed a further or continuing waiver.
                If any provision of this EULA is found to be invalid or unenforceable, the remaining provisions will remain 
                in full force and effect.
              </p>
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
                type="button"
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinue}
                type="button"
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