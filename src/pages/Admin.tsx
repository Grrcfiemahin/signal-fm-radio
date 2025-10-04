import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Radio, Trash2, CheckCircle, Archive } from "lucide-react";

type Message = {
  id: string;
  name: string;
  message_type: string;
  message: string;
  status: string;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndFetchMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel('listener_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listener_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAdminAndFetchMessages = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await fetchMessages();
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("listener_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("listener_messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("listener_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "request": return "bg-primary/20 text-primary";
      case "shoutout": return "bg-secondary/20 text-secondary";
      case "dedication": return "bg-accent/20 text-accent-foreground";
      default: return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "read": return "bg-green-500/20 text-green-500";
      case "archived": return "bg-gray-500/20 text-gray-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">
              Signal<span className="bg-gradient-primary bg-clip-text text-transparent">FM</span>
            </span>
            <Badge variant="outline" className="ml-2">Admin</Badge>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Listener Messages</h1>

        {messages.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
            <p className="text-muted-foreground">No messages yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      <Badge className={getTypeColor(message.message_type)}>
                        {message.message_type}
                      </Badge>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-foreground">{message.message}</p>
                  </div>

                  <div className="flex gap-2">
                    {message.status === "pending" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateMessageStatus(message.id, "read")}
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    {message.status !== "archived" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateMessageStatus(message.id, "archived")}
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteMessage(message.id)}
                      title="Delete"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
