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
  Loader2,
  Sparkles 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// 1. Define Interface (Updated to handle both formats)
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
  
  // 2. State Management
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Controls the "Analyzing" spinner
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // 3. YOUR N8N URL (Copied from your chat)
  const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/9a35b42b-45cc-499b-8fb2-958bc09ab4d6";

  // 4. Initial Dummy Data (So page is not empty at start)
  useEffect(() => {
    // In a real app, you would fetch this from your backend based on ID
    setCandidate({
      id: 1,
      name: "Prasad Joshi", // This will update after AI analysis
      email: "pj160420@gmail.com",
      phone: "+91 98765 43210",
      location: "Mumbai, India",
      score: 0, 
      appliedFor: "Senior Frontend Engineer",
      experience: "3 Years",
      education: "B.Tech in Computer Science",
      summary: "Waiting for AI analysis...",
      skills: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "TypeScript", level: 80 }
      ],
      aiReasoning: [], // Empty initially
      experience_list: [
        { title: "Frontend Developer", company: "Tech Corp", duration: "2021 - Present" },
        { title: "Jr. Developer", company: "Startup Inc", duration: "2019 - 2021" }
      ]
    });
  }, [id]);

  // 5. Function to Call n8n
  const handleAnalyzeProfile = async () => {
    if (!candidate) return;
    
    setIsLoading(true);
    try {
      // Data to send to AI
      const payload = {
        resume: "Candidate demonstrates strong experience in Node.js, Express.js, MongoDB...", // Replace with actual resume text
        jd: "Senior Frontend Engineer with 3+ years experience in React..." // Replace with actual JD
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("n8n Response:", data);

      // Update UI with new data
      setCandidate(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: data.name || prev.name,
          score: parseInt(data.score) || 0,
          aiReasoning: [
            {
              factor: "Overall Match Analysis",
              score: parseInt(data.score) || 0,
              note: data.matchReason || "No reasoning provided."
            }
          ]
        };
      });

    } catch (error) {
      console.error("Error connecting to n8n:", error);
      alert("Connection Failed! Is your n8n workflow active?");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-100";
    if (score >= 70) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  if (!candidate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="content-container fade-in p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
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
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* AI Button */}
          <Button 
            onClick={handleAnalyzeProfile} 
            disabled={isLoading}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? "Analyzing..." : "Analyze with AI"}
          </Button>

          <Button variant="outline" className="gap-2 hidden sm:flex">
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button onClick={() => setIsScheduleOpen(true)} className="gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl text-4xl font-bold transition-all duration-500 ${getScoreColor(candidate.score)}`}>
              {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : candidate.score}
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">AI Match Score</p>
            {candidate.score > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Based on Resume & JD</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
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

          {/* Experience List */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Experience</h2>
            <div className="space-y-4">
              {candidate.experience_list.map((exp, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-foreground" />
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
          {/* AI Reasoning Section */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-foreground">AI Analysis Report</h2>
            </div>
            <div className="space-y-4">
              {candidate.aiReasoning.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-lg">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Click "Analyze with AI" to generate a detailed report.</p>
                </div>
              ) : (
                candidate.aiReasoning.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg border border-border/50">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0 ${getScoreColor(item.score)}`}>
                      {item.score}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground mb-1">{item.factor}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
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

          {/* Resume Summary */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Resume Summary</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                View PDF
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {candidate.summary}
            </p>
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}