import { OnboardingData } from '@/lib/api';
import { Shield, Building2, MapPin } from 'lucide-react';

interface StatusCardProps {
  profile: OnboardingData;
}

export function StatusCard({ profile }: StatusCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-foreground">Your Status</h2>
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

        {profile.hasTravelPlans && profile.travelDestination && (
          <div className="mt-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
            <p className="text-xs font-medium text-accent">Upcoming Travel</p>
            <p className="text-sm font-semibold text-foreground">{profile.travelDestination}</p>
            {profile.travelDepartureDate && (
              <p className="text-xs text-muted-foreground">
                {new Date(profile.travelDepartureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {profile.travelReturnDate && (
                  <> — {new Date(profile.travelReturnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
