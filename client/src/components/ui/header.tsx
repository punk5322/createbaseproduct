import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Loader2, LogOut } from "lucide-react";

export function Header() {
  const { logoutMutation } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 border-b bg-background">
      <Logo />
      <Button
        variant="outline"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </>
        )}
      </Button>
    </div>
  );
}