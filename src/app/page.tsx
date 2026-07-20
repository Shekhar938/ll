import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import PracticeAreas from '@/components/landing/PracticeAreas';
import WhyUs from '@/components/landing/WhyUs';
import FAQ from '@/components/landing/FAQ';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PracticeAreas />
        <WhyUs />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
