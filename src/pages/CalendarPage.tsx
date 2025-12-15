import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";

// Types definition
interface Interview {
  id: number;
  candidateName: string;
  role: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person";
  avatarInitials: string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API calls
      // const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // const res = await fetch(`/api/calendar?start=${startOfMonth}&end=${endOfMonth}`);
      // const data = await res.json();
      
      // setInterviews(data.monthInterviews);
      // setUpcomingInterviews(data.upcoming);
      
      // Temporary empty state until API is connected
      setInterviews([]); 
      setUpcomingInterviews([]);
      
    } catch (error) {
      console.error("Failed to fetch calendar data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasInterview = (day: number | null) => {
    if (!day) return false;
    // Check if any interview exists on this day
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    return interviews.some(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate.getDate() === day && 
             interviewDate.getMonth() === currentMonth && 
             interviewDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Calendar</h1>
        <p className="text-muted-foreground mt-1">Manage your interview schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {formatMonth(currentDate)}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => (
              <div 
                key={index}
                className={`aspect-square p-2 rounded-lg text-center relative ${
                  day ? 'hover:bg-accent cursor-pointer' : ''
                } ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {day && (
                  <>
                    <span className="text-sm">{day}</span>
                    {hasInterview(day) && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Interviews</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingInterviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div 
                  key={interview.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground flex-shrink-0">
                    {interview.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {interview.candidateName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {interview.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {interview.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No upcoming interviews scheduled.
            </div>
          )}
          
          <Button variant="outline" className="w-full mt-4" disabled={upcomingInterviews.length === 0}>
            View All Scheduled
          </Button>
        </div>
      </div>
    </div>
  );
}