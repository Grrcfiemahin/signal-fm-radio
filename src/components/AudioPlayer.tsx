import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Example stream URL - replace with your actual stream URL
  const streamUrl = "https://stream.signalfm.com/live"; // Replace with actual URL

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue);
    if (isMuted && newValue[0] > 0) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg border border-primary/30 bg-card/50 backdrop-blur-sm shadow-glow">
      <audio
        ref={audioRef}
        src={streamUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <Button
          variant="hero"
          size="icon"
          onClick={togglePlay}
          className="h-12 w-12 rounded-full"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        {/* Volume Controls */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-10 w-10"
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Volume2 className="h-5 w-5 text-primary" />
            )}
          </Button>

          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />

          <span className="text-sm text-muted-foreground w-12 text-right">
            {volume[0]}%
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm text-muted-foreground">
          {isPlaying ? "Now Playing: SignalFM Live" : "Press play to start listening"}
        </p>
      </div>
    </div>
  );
};

export default AudioPlayer;
