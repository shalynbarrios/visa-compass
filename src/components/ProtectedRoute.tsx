import { Navigate } from "react-router-dom";
import { authClient } from "@/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session.data) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
