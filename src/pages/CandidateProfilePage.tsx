import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
  XCircle,
  Briefcase,
  Loader2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define interface for proper type checking
interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  score: number;
  appliedFor: string;
  experience: string;
  education: string;
  summary: string;
  skills: Array<{ name: string; level: number }>;
  aiReasoning: Array<{ factor: string; score: number; note: string }>;
  experience_list: Array<{ title: string; company: string; duration: string }>;
}

export default function CandidateProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        // TODO: Replace with real API call
        // const res = await fetch(`/api/candidates/${id}`);
        // const data = await res.json();
        // setCandidate(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching candidate:", error);
        setIsLoading(false);
      }
    };

    if (id) fetchCandidate();
  }, [id]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-100";
    if (score >= 70) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Candidate not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {candidate.name}
            </h1>
            <p className="text-muted-foreground">
              Applied for {candidate.appliedFor}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Reject</span>
          </Button>
          <Button onClick={() => setIsScheduleOpen(true)} className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl text-3xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">AI Match Score</p>
            <p className="text-xs text-muted-foreground mt-1">Top 5% of applicants</p>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.location}</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Experience</h2>
            <div className="space-y-4">
              {candidate.experience_list.map((exp, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Reasoning */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">AI Reasoning</h2>
            </div>
            <div className="space-y-4">
              {candidate.aiReasoning.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`score-badge ${item.score >= 85 ? 'score-high' : item.score >= 70 ? 'score-medium' : 'score-low'}`}>
                    {item.score}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{item.factor}</p>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Skills Assessment</h2>
            <div className="space-y-4">
              {candidate.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Resume Summary</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                View Full Resume
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {candidate.summary}
            </p>
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-foreground font-medium">Education</p>
              <p className="text-sm text-muted-foreground">{candidate.education}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Sheet */}
      <Sheet open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Schedule Interview</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Suggested Times</h3>
              <div className="space-y-2">
                {["Tomorrow, 10:00 AM", "Tomorrow, 2:00 PM", "Friday, 11:00 AM"].map((time, index) => (
                  <button
                    key={index}
                    className="w-full p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                    onClick={() => navigate("/confirmation")}
                  >
                    <p className="font-medium text-foreground">{time}</p>
                    <p className="text-xs text-muted-foreground mt-1">30 min video call</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button className="text-sm text-primary hover:underline">
                Pick a different time
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}