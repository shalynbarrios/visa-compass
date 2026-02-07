import { PolicyUpdate, UpdateCategory } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronRight } from 'lucide-react';

interface UpdatesFeedProps {
  updates: PolicyUpdate[];
  onSelectUpdate: (update: PolicyUpdate) => void;
  selectedUpdateId?: string;
}

const categoryVariants: Record<UpdateCategory, 'tagDhs' | 'tagCourt' | 'tagElection' | 'tagInternational'> = {
  'DHS/USCIS': 'tagDhs',
  'Court': 'tagCourt',
  'Election': 'tagElection',
  'International Policy': 'tagInternational',
};

const riskVariants = {
  low: 'riskLow',
  medium: 'riskMedium',
  high: 'riskHigh',
  unknown: 'riskUnknown',
} as const;

export function UpdatesFeed({ updates, onSelectUpdate, selectedUpdateId }: UpdatesFeedProps) {
  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="border-b p-4">
        <h2 className="font-serif text-xl font-semibold text-foreground">What Changed</h2>
        <p className="text-sm text-muted-foreground">Recent policy updates</p>
      </div>

      <div className="divide-y">
        {updates.map((update) => (
          <button
            key={update.id}
            onClick={() => onSelectUpdate(update)}
            className={`w-full p-4 text-left transition-all hover:bg-muted/50 ${
              selectedUpdateId === update.id ? 'bg-muted/50' : ''
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={categoryVariants[update.category]}>
                {update.category}
              </Badge>
              <Badge variant={riskVariants[update.impact]}>
                {update.impact.toUpperCase()} IMPACT
              </Badge>
              {update.appliesToUser && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  Applies to you
                </Badge>
              )}
            </div>

            <h3 className="mb-1 font-semibold text-foreground">
              {update.title}
            </h3>
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {update.summary}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(update.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface ExplanationPanelProps {
  update: PolicyUpdate | null;
  onOpenSources: () => void;
}

export function ExplanationPanel({ update, onOpenSources }: ExplanationPanelProps) {
  if (!update) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-card p-8 shadow-card">
        <div className="text-center">
          <p className="text-muted-foreground">
            Select an update to see how it applies to you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="border-b p-4">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          How This Applies to You
        </h2>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant={categoryVariants[update.category]}>
            {update.category}
          </Badge>
          <Badge variant={riskVariants[update.impact]}>
            {update.impact.toUpperCase()} IMPACT
          </Badge>
        </div>

        <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
          {update.title}
        </h3>

        <p className="mb-4 text-muted-foreground">{update.summary}</p>

        <div className="mb-4 rounded-lg bg-accent/10 p-4">
          <h4 className="mb-2 font-semibold text-foreground">
            What this means for you:
          </h4>
          <p className="text-foreground">{update.explanation}</p>
        </div>

        <Button variant="outline" onClick={onOpenSources} className="w-full">
          <ExternalLink className="h-4 w-4" />
          View Sources & Citations ({update.sources.length})
        </Button>
      </div>
    </div>
  );
}
