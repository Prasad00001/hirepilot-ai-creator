import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Candidate {
  id: number;
  name: string;
  email: string;
  score: number;
  matchReason: string;
  skills: string[];
}

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for Job Details
  const [jobTitle, setJobTitle] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");

  // State for Resume Input
  const [resumeText, setResumeText] = useState("");

  // State for Screening Process
  const [isScreening, setIsScreening] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Note: Since dummy data is removed, existing jobs won't auto-populate.
  // You would typically fetch real job data here if 'id' exists.
  useEffect(() => {
    if (id && id !== "new") {
      // TODO: Fetch actual job details from your backend API
      console.log("Should fetch details for job ID:", id);
    }
  }, [id]);

  const handleRunScreening = async () => {
    if (!jobTitle || !resumeText) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both Job Details and Resume text.",
      });
      return;
    }

    setIsScreening(true);

    // Prepare data for the webhook
    const payload = {
      jobDescription: {
        role: jobTitle,
        summary: jobSummary,
        requirements: jobRequirements.split('\n').filter(line => line.trim() !== '')
      },
      resumes: [resumeText] // Sending as an array to match previous structure
    };

    try {
      const response = await fetch('http://localhost:5678/webhook-test/9a35b42b-45cc-499b-8fb2-958bc09ab4d6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the REAL data from the webhook
      const data = await response.json();
      
      // Assumes your webhook returns an object with a 'candidates' array
      // Example structure: { candidates: [{ name: "...", score: 90, ... }] }
      if (data && data.candidates) {
        setCandidates(data.candidates);
        setScreeningComplete(true);
        toast({
          title: "Screening complete!",
          description: `Found ${data.candidates.length} candidates.`,
        });
      } else {
        // Fallback if structure is different
        console.warn("Unexpected response structure:", data);
        setCandidates([]);
        setScreeningComplete(true);
        toast({
          variant: "destructive",
          title: "Format Error",
          description: "Received data format was not as expected.",
        });
      }

    } catch (error) {
      console.error("Error running screening:", error);
      toast({
        variant: "destructive",
        title: "Screening failed",
        description: "There was an error connecting to the screening service.",
      });
    } finally {
      setIsScreening(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "score-high";
    if (score >= 70) return "score-medium";
    return "score-low";
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/jobs")}
          aria-label="Go back to jobs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {id === "new" ? "New Job Posting" : jobTitle || "Job Details"}
          </h1>
          <p className="text-muted-foreground">
            {id === "new" ? "Create a new job and screen candidates" : "Manage job details and screening"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Job Details & Resume Input */}
        <div className="space-y-6">
          
          {/* Job Details Form */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground mb-2">Job Description</h2>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input 
                id="jobTitle" 
                placeholder="e.g. Senior Frontend Engineer" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobSummary">Summary</Label>
              <Textarea 
                id="jobSummary" 
                placeholder="Brief overview of the role..." 
                className="min-h-[100px]"
                value={jobSummary}
                onChange={(e) => setJobSummary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobRequirements">Requirements (one per line)</Label>
              <Textarea 
                id="jobRequirements" 
                placeholder="- React Experience&#10;- TypeScript&#10;- Team player" 
                className="min-h-[120px]"
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
              />
            </div>
          </div>

          {/* Paste Resume Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Candidate Resume</h2>
            
            <div className="space-y-2">
              <Label htmlFor="resumeText">Paste Resume Text</Label>
              <Textarea 
                id="resumeText" 
                placeholder="Paste the full text of the candidate's resume here..."
                className="min-h-[200px] font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleRunScreening}
              disabled={!resumeText || !jobTitle || isScreening}
              className="w-full mt-4 gap-2"
              size="lg"
            >
              {isScreening ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running AI screening...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Compare with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right column - Results */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6 min-h-[600px]">
            <h2 className="font-semibold text-foreground mb-4">
              {screeningComplete ? "Screening Results" : "Analysis Output"}
            </h2>

            {!screeningComplete && candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center h-full">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Ready to Screen
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Enter the job details and paste a resume to start the AI comparison.
                </p>
              </div>
            ) : isScreening ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Running AI Analysis
                </h3>
                <p className="text-sm text-muted-foreground pulse-subtle">
                  Comparing resume against job requirements...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div 
                      key={candidate.id || index}
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                      className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`score-badge ${getScoreColor(candidate.score)}`}>
                        {candidate.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground">{candidate.name}</h3>
                          <span className="text-xs text-muted-foreground">{candidate.email}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {candidate.matchReason}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {candidate.skills && candidate.skills.map((skill) => (
                            <span 
                              key={skill}
                              className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No matching candidates found in the response.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}