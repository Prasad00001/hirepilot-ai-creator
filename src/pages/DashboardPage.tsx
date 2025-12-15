import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Loader2
} from "lucide-react";

// Define interfaces for your data
interface DashboardStats {
  newApplicants: number;
  shortlisted: number;
  interviewsToday: number;
  avgHiringDays: number;
}

interface Job {
  id: number;
  title: string;
  applicants: number;
  shortlisted: number;
  status: string;
  postedAt: string;
}

interface Interview {
  id: number;
  candidateName: string;
  role: string;
  time: string;
  avatarInitials: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [userName, setUserName] = useState("Recruiter"); // Placeholder for auth user

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with real parallel API calls
        // const [statsRes, jobsRes, interviewsRes] = await Promise.all([
        //   fetch('/api/dashboard/stats'),
        //   fetch('/api/dashboard/jobs?limit=3'),
        //   fetch('/api/dashboard/interviews?date=today')
        // ]);
        
        // const statsData = await statsRes.json();
        // const jobsData = await jobsRes.json();
        // const interviewsData = await interviewsRes.json();

        // setStats(statsData);
        // setRecentJobs(jobsData);
        // setUpcomingInterviews(interviewsData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to map status to colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening': return 'bg-amber-100 text-amber-700';
      case 'interviewing': return 'bg-primary/10 text-primary';
      case 'new': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Construct stats array for rendering based on state
  const statsDisplay = [
    { 
      label: "New Applicants", 
      value: stats?.newApplicants ?? 0, 
      icon: Users, 
      trend: "+5 today" // This could also be dynamic
    },
    { 
      label: "Shortlisted", 
      value: stats?.shortlisted ?? 0, 
      icon: FileText, 
      trend: "Ready for review" 
    },
    { 
      label: "Interviews Today", 
      value: stats?.interviewsToday ?? 0, 
      icon: Calendar, 
      trend: "Next at 2:00 PM" 
    },
    { 
      label: "Avg. Time to Hire", 
      value: `${stats?.avgHiringDays ?? 0} days`, 
      icon: TrendingUp, 
      trend: "-2 days vs. last month" 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Good morning, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your hiring pipeline.
          </p>
        </div>
        <Button onClick={() => navigate("/jobs/new")} size="lg" className="gap-2">
          <Plus className="w-4 h-4" />
          New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsDisplay.map((stat) => (
          <div key={stat.label} className="stat-card card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Active Jobs</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")} className="gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{job.applicants} applicants</span>
                      <span>{job.shortlisted} shortlisted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No active jobs found.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Today's Interviews</h2>
            <Button variant="ghost" size="icon" onClick={() => navigate("/calendar")}>
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                    {interview.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {interview.candidateName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {interview.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {interview.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No interviews scheduled for today.
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-5"
            onClick={() => navigate("/calendar")}
          >
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}