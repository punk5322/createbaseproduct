import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Upload, CreditCard, Library } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const steps = [
    {
      title: "Complete KYC",
      description: "Upload your identification documents",
      icon: Upload,
      link: "/kyc",
      complete: user?.kycVerified
    },
    {
      title: "Make Payment",
      description: "One-time platform fee of $20",
      icon: CreditCard,
      link: "/payment",
      complete: user?.paymentCompleted
    },
    {
      title: "Manage Catalog",
      description: "View and manage your song catalog",
      icon: Library,
      link: "/catalog",
      complete: user?.kycVerified && user?.paymentCompleted
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.artistName}</h1>
          <p className="text-muted-foreground">{user?.songwriterName}</p>
        </div>
        <Music className="h-8 w-8 text-primary" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <step.icon className="h-5 w-5" />
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <Button
                asChild
                variant={step.complete ? "outline" : "default"}
                className="w-full"
                disabled={!step.complete && step.title === "Manage Catalog"}
              >
                <Link href={step.link}>
                  {step.complete ? "View" : "Complete"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
