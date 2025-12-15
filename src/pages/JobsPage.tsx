import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  applicants: number;
  shortlisted: number;
  status: string;
  posted: string;
}

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch jobs from your backend
    const fetchJobs = async () => {
      try {
        // const res = await fetch('/api/jobs');
        // const data = await res.json();
        // setJobs(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-emerald-100 text-emerald-700",
      screening: "bg-amber-100 text-amber-700",
      interviewing: "bg-primary/10 text-primary",
      closed: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = {
      new: "New",
      screening: "Screening",
      interviewing: "Interviewing",
      closed: "Closed",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.closed}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and track applicants.</p>
        </div>
        <Button onClick={() => navigate("/jobs/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Jobs List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-6 gap-4 p-4 bg-secondary/50 text-sm font-medium text-muted-foreground border-b border-border">
          <div className="col-span-2">Job Title</div>
          <div>Location</div>
          <div className="text-center">Applicants</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No jobs found. Create a new job to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="sm:col-span-2">
                  <h3 className="font-medium text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {job.location}
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-foreground font-medium">{job.applicants}</span>
                  <span className="text-sm text-muted-foreground ml-1">/ {job.shortlisted} shortlisted</span>
                </div>
                <div className="flex items-center justify-center">
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                        Close Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}