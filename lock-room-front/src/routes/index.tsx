import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ArchitectureSection } from '@/components/landing/architecture-section'
import { SecuritySection } from '@/components/landing/security-section'
import { CtaSection } from '@/components/landing/cta-section'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <SecuritySection />
      <CtaSection />
    </main>
  )
}
