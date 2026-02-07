import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TravelResponseCard } from '@/components/travel/TravelResponseCard';
import { askTravelBot } from '@/lib/api';
import { TravelResponse } from '@/lib/mockData';
import { Plane, Send, Loader2, MessageSquare } from 'lucide-react';

const TravelCheck = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<TravelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasAsked(true);
    try {
      const result = await askTravelBot(query);
      setResponse(result);
    } catch (error) {
      console.error('Error getting travel advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    'I would like to travel to Russia, can I?',
    'Is it safe to visit Canada for a weekend?',
    'Can I travel to my home country on F-1 OPT?',
    'What documents do I need for travel to Mexico?',
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent/10 px-4 py-2">
              <Plane className="h-5 w-5 text-accent" />
              <span className="font-medium text-accent">Travel Check AI</span>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
              Check Your Travel Risks
            </h1>
            <p className="text-muted-foreground">
              Ask about any travel destination and get personalized guidance based on your immigration status.
            </p>
          </div>

          {/* Chat Input */}
          <div className="mb-8 rounded-xl border bg-card p-6 shadow-card">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Textarea
                  placeholder="Ask about your travel plans... e.g., 'I would like to travel to Russia, can I?'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <MessageSquare className="mr-1 inline h-4 w-4" />
                  Ask in plain English
                </p>
                <Button
                  type="submit"
                  variant="accentSolid"
                  disabled={!query.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Check Travel
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Example Questions (show only before first query) */}
          {!hasAsked && (
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Try asking:
              </h3>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setQuery(question)}
                    className="rounded-full border bg-card px-4 py-2 text-sm text-foreground transition-all hover:bg-muted/50 hover:shadow-card"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-accent" />
              <p className="text-lg text-muted-foreground">
                Analyzing travel risks for your status...
              </p>
            </div>
          )}

          {/* Response */}
          {response && !loading && <TravelResponseCard response={response} />}

          {/* Disclaimer */}
          <div className="mt-8 rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This tool provides general information only and does
            not constitute legal advice. Travel decisions should be made in consultation with
            your DSO, immigration attorney, or other qualified professionals.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TravelCheck;
