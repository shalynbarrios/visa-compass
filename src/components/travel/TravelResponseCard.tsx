import { TravelResponse, RiskLevel } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  FileQuestion
} from 'lucide-react';

interface TravelResponseCardProps {
  response: TravelResponse;
}

const riskConfig: Record<RiskLevel, {
  variant: 'riskLow' | 'riskMedium' | 'riskHigh' | 'riskUnknown';
  icon: typeof CheckCircle;
  label: string;
  bgClass: string;
}> = {
  low: {
    variant: 'riskLow',
    icon: CheckCircle,
    label: 'LOW RISK',
    bgClass: 'bg-risk-low/10',
  },
  medium: {
    variant: 'riskMedium',
    icon: AlertTriangle,
    label: 'MEDIUM RISK',
    bgClass: 'bg-risk-medium/10',
  },
  high: {
    variant: 'riskHigh',
    icon: AlertTriangle,
    label: 'HIGH RISK',
    bgClass: 'bg-risk-high/10',
  },
  unknown: {
    variant: 'riskUnknown',
    icon: HelpCircle,
    label: 'UNKNOWN RISK',
    bgClass: 'bg-risk-unknown/10',
  },
};

export function TravelResponseCard({ response }: TravelResponseCardProps) {
  const config = riskConfig[response.riskLevel];
  const RiskIcon = config.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Risk Level Header */}
      <div className={`rounded-xl p-6 ${config.bgClass}`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-risk-${response.riskLevel}/20`}>
            <RiskIcon className={`h-7 w-7 text-risk-${response.riskLevel}`} />
          </div>
          <div>
            <Badge variant={config.variant} className="mb-1 text-sm">
              {config.label}
            </Badge>
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Travel to {response.destination}
            </h3>
          </div>
        </div>
      </div>

      {/* Key Reasons */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-risk-high" />
          Key Reasons
        </h4>
        <ul className="space-y-3">
          {response.keyReasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-3">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clarifying Questions */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <FileQuestion className="h-5 w-5 text-accent" />
          Clarifying Questions
        </h4>
        <p className="mb-4 text-sm text-muted-foreground">
          To provide more accurate guidance, please consider these questions:
        </p>
        <ul className="space-y-3">
          {response.clarifyingQuestions.map((question, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-foreground">{question}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <ExternalLink className="h-5 w-5 text-accent" />
          Sources
        </h4>
        <div className="space-y-3">
          {response.sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-muted/50"
            >
              <div>
                <p className="font-medium text-foreground">{source.title}</p>
                <p className="text-sm text-muted-foreground">
                  {source.publisher} • {new Date(source.publishedDate).toLocaleDateString()}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle className="h-5 w-5 text-accent" />
          Recommended Next Steps
        </h4>
        <ol className="space-y-3">
          {response.nextSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                {index + 1}
              </span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
