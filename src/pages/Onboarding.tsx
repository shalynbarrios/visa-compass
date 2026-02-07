import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { countries, visaStatuses } from '@/lib/mockData';
import { saveOnboardingData, type OnboardingData } from '@/lib/api';

const steps = [
  { id: 1, title: 'Citizenship', description: 'Where are you from?' },
  { id: 2, title: 'Visa Status', description: 'Your current U.S. status' },
  { id: 3, title: 'Affiliation', description: 'School or employer' },
  { id: 4, title: 'Travel Plans', description: 'Upcoming travel' },
  { id: 5, title: 'Notifications', description: 'Stay informed' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    citizenship: '',
    visaStatus: '',
    affiliationType: 'school',
    affiliation: '',
    hasTravelPlans: false,
    travelDestination: '',
    travelDepartureDate: '',
    travelReturnDate: '',
    notificationEmail: true,
    notificationSms: false,
    notificationPush: true,
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveOnboardingData(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.citizenship !== '';
      case 2:
        return formData.visaStatus !== '';
      case 3:
        return formData.affiliation !== '';
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-card py-8 md:py-16">
        <div className="container mx-auto max-w-2xl px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-muted-foreground">{steps[currentStep - 1].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="mb-8 flex justify-center gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  step.id < currentStep
                    ? 'bg-accent text-accent-foreground'
                    : step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="rounded-xl border bg-card p-6 shadow-card md:p-8">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[200px]">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label htmlFor="citizenship">Country of Citizenship</Label>
                  <Select
                    value={formData.citizenship}
                    onValueChange={(value) =>
                      setFormData({ ...formData, citizenship: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label htmlFor="visaStatus">Current U.S. Visa Status</Label>
                  <Select
                    value={formData.visaStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, visaStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your visa status" />
                    </SelectTrigger>
                    <SelectContent>
                      {visaStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This helps us filter updates relevant to your immigration category.
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>I am affiliated with a:</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={formData.affiliationType === 'school' ? 'accentSolid' : 'outline'}
                        onClick={() => setFormData({ ...formData, affiliationType: 'school' })}
                      >
                        School / University
                      </Button>
                      <Button
                        type="button"
                        variant={formData.affiliationType === 'employer' ? 'accentSolid' : 'outline'}
                        onClick={() => setFormData({ ...formData, affiliationType: 'employer' })}
                      >
                        Employer
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliation">
                      {formData.affiliationType === 'school' ? 'School Name' : 'Employer Name'}
                    </Label>
                    <Input
                      id="affiliation"
                      placeholder={
                        formData.affiliationType === 'school'
                          ? 'e.g., Stanford University'
                          : 'e.g., Google Inc.'
                      }
                      value={formData.affiliation}
                      onChange={(e) =>
                        setFormData({ ...formData, affiliation: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Do you have upcoming travel plans?</Label>
                      <p className="text-sm text-muted-foreground">
                        We'll alert you to travel advisories
                      </p>
                    </div>
                    <Switch
                      checked={formData.hasTravelPlans}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasTravelPlans: checked })
                      }
                    />
                  </div>

                  {formData.hasTravelPlans && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Select
                          value={formData.travelDestination}
                          onValueChange={(value) =>
                            setFormData({ ...formData, travelDestination: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="departure">Departure Date</Label>
                          <Input
                            id="departure"
                            type="date"
                            value={formData.travelDepartureDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                travelDepartureDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="return">Return Date</Label>
                          <Input
                            id="return"
                            type="date"
                            value={formData.travelReturnDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                travelReturnDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Choose how you'd like to receive updates about policy changes.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates in your inbox
                        </p>
                      </div>
                      <Switch
                        checked={formData.notificationEmail}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, notificationEmail: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Urgent alerts via text message
                        </p>
                      </div>
                      <Switch
                        checked={formData.notificationSms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, notificationSms: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Browser push notifications
                        </p>
                      </div>
                      <Switch
                        checked={formData.notificationPush}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, notificationPush: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < steps.length ? (
                <Button
                  variant="accentSolid"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
