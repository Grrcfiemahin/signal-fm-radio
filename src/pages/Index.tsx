import Hero from "@/components/Hero";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
