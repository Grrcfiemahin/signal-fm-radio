import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const messageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  message_type: z.enum(["request", "shoutout", "dedication"]),
  message: z.string().trim().min(1, "Message is required").max(500, "Message must be less than 500 characters")
});

const MessageForm = () => {
  const [name, setName] = useState("");
  const [messageType, setMessageType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate input
      const validatedData = messageSchema.parse({
        name,
        message_type: messageType,
        message
      });

      setIsSubmitting(true);

      const { error } = await supabase
        .from("listener_messages")
        .insert([{
          name: validatedData.name,
          message_type: validatedData.message_type,
          message: validatedData.message
        }]);

      if (error) throw error;

      toast.success("Your message has been sent! We'll get to it soon.");
      
      // Reset form
      setName("");
      setMessageType("");
      setMessage("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error submitting message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        Send Us a Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={100}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="message-type">Message Type</Label>
          <Select value={messageType} onValueChange={setMessageType} required>
            <SelectTrigger id="message-type" className="mt-1.5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="request">Song Request</SelectItem>
              <SelectItem value="shoutout">Shoutout</SelectItem>
              <SelectItem value="dedication">Dedication</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            maxLength={500}
            rows={4}
            required
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {message.length}/500 characters
          </p>
        </div>

        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={isSubmitting || !name || !messageType || !message}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
};

export default MessageForm;
