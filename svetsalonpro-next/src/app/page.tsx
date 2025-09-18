import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { MastersSection } from '@/components/sections/masters-section';
import { PortfolioSection } from '@/components/sections/portfolio-section';
import { ReviewsSection } from '@/components/sections/reviews-section';
import { BookingSection } from '@/components/sections/booking-section';
import { ContactsSection } from '@/components/sections/contacts-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <MastersSection />
      <PortfolioSection />
      <ReviewsSection />
      <BookingSection />
      <ContactsSection />
    </>
  );
}
