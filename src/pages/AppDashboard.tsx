import { authClient } from "@/auth";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AppDashboard = () => {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              You are successfully authenticated.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your authenticated user details</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>Your current session information</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(session.data?.session, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppDashboard;
