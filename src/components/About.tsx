import { Card } from "@/components/ui/card";
import { Music, Globe, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Music,
      title: "Tuned In, Switched On",
      description: "From late-night lo-fi to daytime deep cuts, our programming is built for listeners who crave more than the mainstream."
    },
    {
      icon: Globe,
      title: "Designed for the Now",
      description: "Our sleek interface, fluid animations, and immersive audio blend seamlessly with a modern aesthetic that reflects the rhythm of life."
    },
    {
      icon: Sparkles,
      title: "Join the Frequency",
      description: "This isn't background noise. It's a movement. Plug in, vibe out, and be part of the next generation of sound."
    }
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Signal<span className="bg-gradient-primary bg-clip-text text-transparent">FM</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We amplify emerging talent, dive into subcultures, and bring stories to the surface — 
            always with clarity, edge, and purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6 inline-flex p-3 rounded-lg bg-gradient-primary">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
