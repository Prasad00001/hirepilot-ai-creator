import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    // Expecting state to be passed from the previous page
    if (location.state) {
      setDetails(location.state);
    }
  }, [location]);

  if (!details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
            <h2 className="text-lg font-semibold">No booking details found</h2>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

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
          The interview with {details.candidateName} has been confirmed.
        </p>

        {/* Interview details */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
              {details.candidateInitials || "C"}
            </div>
            <div>
              <p className="font-medium text-foreground">{details.candidateName}</p>
              <p className="text-sm text-muted-foreground">{details.role}</p>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{details.date} at {details.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{details.duration || "30"} minute video call</span>
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