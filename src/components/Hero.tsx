import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import AudioPlayer from "./AudioPlayer";
import MessageForm from "./MessageForm";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial z-0" />

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Signal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm animate-pulse-glow">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Broadcasting Live</span>
          </div>

          {/* Audio Player */}
          <AudioPlayer />

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Where Sound
            </span>
            <br />
            <span className="text-foreground">Meets Soul</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Broadcasting fresh beats, underground gems, and essential voices. 
            We're more than just a station — we're a signal in the noise.
          </p>

          {/* Message Form */}
          <div className="max-w-xl mx-auto pt-8">
            <MessageForm />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
