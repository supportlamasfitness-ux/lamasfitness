import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { IntroScreen } from "@/components/IntroScreen";
import { getTestimonials } from "@/lib/testimonials";

export default async function Home() {
  const hasTestimonials = (await getTestimonials()).length > 0;
  return (
    <>
      <IntroScreen />
      <Header showTestimonials={hasTestimonials} />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
