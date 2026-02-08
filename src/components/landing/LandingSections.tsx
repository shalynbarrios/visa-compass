import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Bell, FileSearch, Globe, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent-foreground">
            <Shield className="h-4 w-4" />
            <span>Immigration compliance made simple</span>
          </div>

          <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Know what changed —{' '}
            <span className="text-accent">and whether it applies to your immigration status</span>
          </h1>

          <p className="mb-10 text-lg text-primary-foreground/80 md:text-xl">
            Stay informed about policy changes from DHS, USCIS, courts, and more.
            Get personalized alerts and understand exactly how each update affects you.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <Link to="/onboarding">
                Start Tracking Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/dashboard">View Demo Dashboard</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Personalized alerts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Get notified immediately when policies change that affect your specific visa status.',
    },
    {
      icon: FileSearch,
      title: 'Source Verification',
      description: 'Every update links directly to official government sources and legal citations.',
    },
    {
      icon: Globe,
      title: 'Immigration Advisor',
      description: 'Ask questions about travel, visas, work authorization, and get personalized guidance.',
    },
    {
      icon: Shield,
      title: 'Status Tracking',
      description: 'Monitor your visa timeline, I-20 dates, and important deadlines in one place.',
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Stay ahead of immigration changes
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform monitors policy changes 24/7 and filters what matters to you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Tell us your citizenship, visa status, and employer or school affiliation.',
    },
    {
      number: '02',
      title: 'Set Preferences',
      description: 'Choose which categories of updates matter most to you.',
    },
    {
      number: '03',
      title: 'Get Personalized Updates',
      description: 'Receive alerts with clear explanations of how each change affects you.',
    },
  ];

  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get set up in minutes and start receiving personalized immigration updates.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-border md:block" />
              )}
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="accentSolid" size="lg" asChild>
            <Link to="/onboarding">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-hero p-8 text-center shadow-elevated md:p-12">
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            Don't miss another policy change
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Join thousands of immigrants who stay informed and prepared.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/onboarding">
              Start Tracking Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
