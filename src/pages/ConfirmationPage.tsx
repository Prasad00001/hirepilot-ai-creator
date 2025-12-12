import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center fade-in">
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-primary/5 animate-ping" style={{ animationDuration: '2s' }} />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Interview Scheduled!
        </h1>
        <p className="text-muted-foreground mb-8">
          The interview with Alex Chen has been confirmed. A calendar invite has been sent to both parties.
        </p>

        {/* Interview details */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
              AC
            </div>
            <div>
              <p className="font-medium text-foreground">Alex Chen</p>
              <p className="text-sm text-muted-foreground">Senior Frontend Engineer</p>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Tomorrow, January 16th at 10:00 AM</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">30 minute video call via Google Meet</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={() => navigate("/dashboard")} size="lg" className="w-full gap-2">
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/calendar")} className="w-full">
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
