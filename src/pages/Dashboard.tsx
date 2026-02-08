import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { UpdatesFeed, ExplanationPanel } from '@/components/dashboard/UpdatesFeed';
import { SourcesDrawer } from '@/components/dashboard/SourcesDrawer';
import { fetchUpdates } from '@/lib/api';
import { PolicyUpdate } from '@/lib/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserProfile } from '@/contexts/UserProfileContext';

const Dashboard = () => {
  const { profile: onboardingProfile } = useUserProfile();
  const [updates, setUpdates] = useState<PolicyUpdate[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<PolicyUpdate | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const updatesData = await fetchUpdates();
        setUpdates(updatesData);
        if (updatesData.length > 0) {
          setSelectedUpdate(updatesData[0]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Welcome{onboardingProfile ? ` back` : ''}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your immigration status.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Status Card */}
            <div className="lg:col-span-1">
              {onboardingProfile && <StatusCard profile={onboardingProfile} />}
            </div>

            {/* Updates Feed */}
            <div className="lg:col-span-1">
              <UpdatesFeed
                updates={updates}
                onSelectUpdate={setSelectedUpdate}
                selectedUpdateId={selectedUpdate?.id}
              />
            </div>

            {/* Explanation Panel */}
            <div className="lg:col-span-1">
              <ExplanationPanel
                update={selectedUpdate}
                onOpenSources={() => setSourcesOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <SourcesDrawer
        open={sourcesOpen}
        onOpenChange={setSourcesOpen}
        update={selectedUpdate}
      />
    </Layout>
  );
};

export default Dashboard;
