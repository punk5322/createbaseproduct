import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function KYCPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a driver's license image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // In a real implementation, you would upload to a secure storage service
      // For this demo, we'll just simulate the upload
      const driverLicenseUrl = "https://example.com/license.jpg";

      await apiRequest("POST", "/api/kyc", { driverLicenseUrl });
      
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "KYC Completed",
        description: "Your driver's license has been uploaded successfully",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Complete KYC Verification</CardTitle>
          <CardDescription>
            Please upload a clear image of your driver's license to verify your
            identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Input
                id="license"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!file || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Driver's License"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
