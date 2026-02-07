import { UserProfile } from '@/lib/mockData';
import { Shield, Calendar, Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusCardProps {
  profile: UserProfile;
}

export function StatusCard({ profile }: StatusCardProps) {
  const daysUntilExpiry = Math.ceil(
    (new Date(profile.visaExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getExpiryStatus = () => {
    if (daysUntilExpiry < 90) return 'riskHigh';
    if (daysUntilExpiry < 180) return 'riskMedium';
    return 'riskLow';
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-foreground">Your Status</h2>
        <Badge variant={getExpiryStatus()}>
          {daysUntilExpiry} days until expiry
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Visa Status</p>
            <p className="font-semibold text-foreground">{profile.visaStatus}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Country of Citizenship</p>
            <p className="font-semibold text-foreground">{profile.citizenship}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {profile.affiliationType === 'school' ? 'School' : 'Employer'}
            </p>
            <p className="font-semibold text-foreground">{profile.affiliation}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Visa Expiry</p>
            <p className="font-semibold text-foreground">
              {new Date(profile.visaExpiry).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
