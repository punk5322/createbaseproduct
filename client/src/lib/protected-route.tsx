import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { ReactElement } from "react";

interface ProtectedRouteProps {
  path?: string;
  component: React.ComponentType;
}

export function ProtectedRoute({
  path,
  component: Component,
}: ProtectedRouteProps): ReactElement {
  const { user, isLoading } = useAuth();

  const WrappedComponent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to="/auth" />;
    }

    return <Component />;
  };

  if (path) {
    return (
      <Route path={path}>
        <WrappedComponent />
      </Route>
    );
  }

  return <WrappedComponent />;
}