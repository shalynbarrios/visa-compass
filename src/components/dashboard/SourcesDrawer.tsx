import { PolicyUpdate } from '@/lib/mockData';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';

interface SourcesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  update: PolicyUpdate | null;
}

export function SourcesDrawer({ open, onOpenChange, update }: SourcesDrawerProps) {
  if (!update) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif">Sources & Citations</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {update.sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-card"
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-semibold text-foreground">{source.title}</h4>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{source.publisher}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(source.publishedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This information is for educational purposes
            only and does not constitute legal advice. Always consult with a qualified
            immigration attorney for guidance specific to your situation.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
