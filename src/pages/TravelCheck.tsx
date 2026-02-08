import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { TravelResponseCard } from '@/components/travel/TravelResponseCard';
import { TravelResponse } from '@/lib/mockData';
import { Plane, Send, Loader2, User, Bot } from 'lucide-react';

const exampleQuestions = [
  'I would like to travel to Russia, can I?',
  'Is it safe to visit Canada for a weekend?',
  'Can I travel to my home country on F-1 OPT?',
  'What documents do I need for travel to Mexico?',
];

const TravelCheck = () => {
  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
  });
  const [input, setInput] = useState('');

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput('');
    sendMessage({ text });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen flex-col bg-gradient-card">
        <div className="container mx-auto flex max-w-3xl flex-1 flex-col px-4 py-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent/10 px-4 py-2">
              <Plane className="h-5 w-5 text-accent" />
              <span className="font-medium text-accent">Travel Check AI</span>
            </div>
            <h1 className="mb-1 font-serif text-2xl font-bold text-foreground md:text-3xl">
              Check Your Travel Risks
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask about any travel destination and get personalized guidance based on your immigration status.
            </p>
          </div>

          {/* Messages area */}
          <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Bot className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="mb-6 text-muted-foreground">Ask me about your travel plans</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {exampleQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSend(question)}
                      className="rounded-full border bg-card px-4 py-2 text-sm text-foreground transition-all hover:bg-muted/50 hover:shadow-card"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id}>
                {(m.parts ?? []).map((part, i) => {
                  // Text parts render as chat bubbles
                  if (part.type === 'text' && part.text.trim()) {
                    return (
                      <div
                        key={i}
                        className={`mb-3 flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            m.role === 'user'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            m.role === 'user'
                              ? 'bg-accent text-accent-foreground'
                              : 'border bg-card shadow-card'
                          }`}
                        >
                          <div
                            className={`text-sm leading-relaxed ${m.role === 'assistant' ? 'prose prose-sm dark:prose-invert max-w-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(part.text) }}
                          />
                        </div>
                      </div>
                    );
                  }

                  // Tool parts render as TravelResponseCard
                  if (part.type === 'dynamic-tool') {
                    const toolPart = part as { toolName: string; state: string; input?: unknown };

                    if (toolPart.toolName === 'assessTravelRisk') {
                      if (!toolPart.input || toolPart.state === 'input-streaming') {
                        return (
                          <div key={i} className="my-4 flex items-center gap-3 rounded-xl border bg-card p-6 shadow-card">
                            <Loader2 className="h-5 w-5 animate-spin text-accent" />
                            <span className="text-sm text-muted-foreground">Generating travel assessment...</span>
                          </div>
                        );
                      }

                      return (
                        <div key={i} className="my-4">
                          <TravelResponseCard response={toolPart.input as TravelResponse} />
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border bg-card px-4 py-3 shadow-card">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                Something went wrong. Please try again.
              </div>
            )}

          </div>

          {/* Input area */}
          <div className="sticky bottom-0 border-t bg-background/80 pt-4 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your travel plans..."
                rows={1}
                className="flex-1 resize-none rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                type="submit"
                variant="accentSolid"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 shrink-0 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="mt-2 pb-2 text-center text-xs text-muted-foreground">
              This tool provides general information only — not legal advice. Consult your DSO or immigration attorney.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

export default TravelCheck;
