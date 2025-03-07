import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Loader2, Send, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "assistant" | "user";
  content: string;
};

// Mock conversation flow based on the diagram
const INITIAL_MESSAGE = `Hi! I'll help you add your song to CreateBase. Let's start with some basic information. What's the name of your song?`;

export default function AddSongPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const mockAIResponse = async (userMessage: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    let response = "";
    switch (currentStep) {
      case 1:
        response = `Great! And who are the artists performing "${userMessage}"?`;
        setCurrentStep(2);
        break;
      case 2:
        response = "Does this song contain any samples or interpolations from other songs?";
        setCurrentStep(3);
        break;
      case 3:
        response = "Let's specify the splits. Who are the writers of this song?";
        setCurrentStep(4);
        break;
      case 4:
        response = "Would you like to add any additional contributors (producers, engineers, etc.)?";
        setCurrentStep(5);
        break;
      case 5:
        response = `I've prepared a split sheet based on our conversation. Would you like to review it before adding to your catalog?`;
        setCurrentStep(6);
        break;
      default:
        response = "Great! I'll add this to your catalog now.";
        // Here we would normally save the song data
        setLocation("/catalog");
    }

    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: response }
    ]);
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input;
    setInput("");
    await mockAIResponse(userMessage);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Add New Song
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto p-4 rounded-lg bg-muted">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                disabled={isProcessing}
              />
              <Button type="submit" disabled={isProcessing}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
