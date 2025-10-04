import { Radio } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">
              Signal<span className="bg-gradient-primary bg-clip-text text-transparent">FM</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 SignalFM. Broadcasting a high-fidelity experience worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
