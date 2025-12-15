import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  score: number;
  status: string;
  avatar: string;
}

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch candidates from backend
    const fetchCandidates = async () => {
      try {
        // const res = await fetch('/api/candidates');
        // setCandidates(await res.json());
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "score-high";
    if (score >= 70) return "score-medium";
    return "score-low";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      screening: "bg-muted text-muted-foreground",
      shortlisted: "bg-amber-100 text-amber-700",
      interviewing: "bg-primary/10 text-primary",
      offer: "bg-emerald-100 text-emerald-700",
    };
    const labels: Record<string, string> = {
      screening: "Screening",
      shortlisted: "Shortlisted",
      interviewing: "Interviewing",
      offer: "Offer Sent",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.screening}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Shortlist</h1>
          <p className="text-muted-foreground mt-1">Review and manage your shortlisted candidates.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Candidates Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No candidates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id}
              onClick={() => navigate(`/candidates/${candidate.id}`)}
              className="bg-card rounded-xl border border-border p-5 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                    {candidate.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                </div>
                <div className={`score-badge ${getScoreColor(candidate.score)}`}>
                  {candidate.score}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{candidate.role}</p>
              <div className="flex items-center justify-between">
                {getStatusBadge(candidate.status)}
                <Button variant="ghost" size="sm">View Profile</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {candidates.length > 0 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}