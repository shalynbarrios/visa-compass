import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthView, NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
import { Layout } from "@/components/layout/Layout";
import { authClient } from "@/auth";

const AuthPage = () => {
  const session = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.isPending && session.data) {
      navigate("/app", { replace: true });
    }
  }, [session.data, session.isPending, navigate]);

  if (session.isPending) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (session.data) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-card py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Welcome to Hawkeye
            </h1>
            <p className="text-muted-foreground">
              Sign in or create an account to continue
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-lg p-6">
            <NeonAuthUIProvider authClient={authClient}>
              <AuthView
                onSuccess={() => {
                  navigate("/app", { replace: true });
                }}
              />
            </NeonAuthUIProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
