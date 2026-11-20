import About from "@/components/About";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Hiring from "@/components/Hiring";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import Story from "@/components/Story";
import Team from "@/components/Team";
import Technologies from "@/components/Technologies";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import { jsonLd } from "@/lib/seo";
import Work from "@/components/Work";

/**
 * Page order follows what buyers look for: what you do and proof (hero, why, services, work),
 * then how it works (hiring, process and prices, team), then reassurance (tech, FAQ) and contact.
 */
export default function Home() {
  return (
    <>
      {/* structured data for search engines and AI assistants (see lib/seo.ts); "<" escaped so the JSON can't close the tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
      <div className="backdrop" aria-hidden />
      <SmoothScroll />
      <Nav />
      <main id="top" className="main">
        <About />
        <Story />
        <WhyUs />
        <Services />
        <Work />
        <Testimonials />
        <Hiring />
        <Process />
        <Team />
        <Technologies />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
