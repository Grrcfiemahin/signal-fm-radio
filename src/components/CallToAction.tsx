import { Button } from "@/components/ui/button";
import { Radio, ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Broadcasting 24/7</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Join the Frequency
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SignalFM is broadcasting now — and we're just getting started. 
            Be part of the movement where sound meets soul.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="lg" className="group">
              Start Listening
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
              View Schedule
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
