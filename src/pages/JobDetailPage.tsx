import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Sparkles,
  X,
  Check,
  Loader2
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

const mockCandidates: Candidate[] = [
  { 
    id: 1, 
    name: "Alex Chen", 
    email: "alex@email.com",
    score: 94, 
    matchReason: "Strong React experience with 5+ years in similar startup environments",
    skills: ["React", "TypeScript", "Node.js", "AWS"]
  },
  { 
    id: 2, 
    name: "Sarah Kim", 
    email: "sarah@email.com",
    score: 88, 
    matchReason: "Excellent frontend skills, contributed to open-source design systems",
    skills: ["React", "Vue", "CSS", "Figma"]
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael@email.com",
    score: 82, 
    matchReason: "Full-stack capabilities with strong problem-solving background",
    skills: ["React", "Python", "PostgreSQL", "Docker"]
  },
  { 
    id: 4, 
    name: "Emily Davis", 
    email: "emily@email.com",
    score: 75, 
    matchReason: "Good foundation with growth potential, eager learner",
    skills: ["JavaScript", "React", "Git", "Agile"]
  },
];

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFiles(prev => [...prev, `Resume_${prev.length + 1}.pdf`]);
    toast({
      title: "Resume uploaded",
      description: "File added successfully.",
    });
  };

  const handleRunScreening = () => {
    setIsScreening(true);
    // Simulate AI screening
    setTimeout(() => {
      setIsScreening(false);
      setScreeningComplete(true);
      setCandidates(mockCandidates);
      toast({
        title: "Screening complete!",
        description: `Found ${mockCandidates.length} qualified candidates.`,
      });
    }, 3000);
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
            Senior Frontend Engineer
          </h1>
          <p className="text-muted-foreground">Posted 3 days ago • 45 applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Upload & JD */}
        <div className="space-y-6">
          {/* Job Description */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Job Description</h2>
            <div className="prose prose-sm text-muted-foreground">
              <p>We're looking for a Senior Frontend Engineer to join our growing team. You'll be working on our core product, building beautiful and performant user interfaces.</p>
              <p className="mt-3"><strong className="text-foreground">Requirements:</strong></p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>5+ years of React experience</li>
                <li>TypeScript proficiency</li>
                <li>Experience with modern CSS</li>
                <li>Strong problem-solving skills</li>
              </ul>
            </div>
          </div>

          {/* Upload Resumes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Upload Resumes</h2>
            
            {/* Drop zone */}
            <div 
              onClick={handleFileUpload}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all"
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX up to 10MB each
              </p>
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                    <button 
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={handleRunScreening}
              disabled={uploadedFiles.length === 0 || isScreening}
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
                  Run AI Screening
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right column - Results */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6 min-h-[400px]">
            <h2 className="font-semibold text-foreground mb-4">
              {screeningComplete ? "Screening Results" : "Shortlisted Candidates"}
            </h2>

            {!screeningComplete && candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  No candidates yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload resumes or paste a job description to get started with AI screening.
                </p>
              </div>
            ) : isScreening ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Running AI screening
                </h3>
                <p className="text-sm text-muted-foreground pulse-subtle">
                  Analyzing resumes and matching candidates — one moment...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((candidate, index) => (
                  <div 
                    key={candidate.id}
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
                        {candidate.skills.map((skill) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
