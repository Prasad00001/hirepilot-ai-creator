import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from "lucide-react";

const stats = [
  { label: "New Applicants", value: "23", icon: Users, trend: "+5 today" },
  { label: "Shortlisted", value: "12", icon: FileText, trend: "Ready for review" },
  { label: "Interviews Today", value: "3", icon: Calendar, trend: "Next at 2:00 PM" },
  { label: "Avg. Time to Hire", value: "8 days", icon: TrendingUp, trend: "-2 days vs. last month" },
];

const recentJobs = [
  { 
    id: 1, 
    title: "Senior Frontend Engineer", 
    applicants: 45, 
    shortlisted: 8, 
    status: "screening",
    posted: "3 days ago"
  },
  { 
    id: 2, 
    title: "Product Designer", 
    applicants: 32, 
    shortlisted: 5, 
    status: "interviewing",
    posted: "1 week ago"
  },
  { 
    id: 3, 
    title: "Backend Engineer", 
    applicants: 28, 
    shortlisted: 4, 
    status: "new",
    posted: "Today"
  },
];

const upcomingInterviews = [
  { id: 1, candidate: "Alex Chen", role: "Senior Frontend Engineer", time: "2:00 PM", avatar: "AC" },
  { id: 2, candidate: "Maria Garcia", role: "Product Designer", time: "3:30 PM", avatar: "MG" },
  { id: 3, candidate: "James Wilson", role: "Senior Frontend Engineer", time: "4:45 PM", avatar: "JW" },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Good morning, Sarah
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
        {stats.map((stat) => (
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
            {recentJobs.map((job) => (
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
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    job.status === 'screening' ? 'bg-amber-100 text-amber-700' :
                    job.status === 'interviewing' ? 'bg-primary/10 text-primary' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {job.status === 'screening' ? 'Screening' :
                     job.status === 'interviewing' ? 'Interviewing' : 'New'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
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
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                  {interview.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {interview.candidate}
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
            ))}
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
