import { Layout } from '@/components/layout/Layout';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
} from '@/components/landing/LandingSections';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
