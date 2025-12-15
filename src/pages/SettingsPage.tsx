import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { User, Bell, Lock, Sliders, Mail, Loader2 } from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "scoring", label: "Scoring Criteria", icon: Sliders },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "emails", label: "Email Templates", icon: Mail },
  { id: "security", label: "Security", icon: Lock },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  
  // State for form data
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    avatarInitials: ""
  });
  
  const [scoringWeights, setScoringWeights] = useState<Record<string, number>>({});
  const [emailTemplates, setEmailTemplates] = useState({
    invitation: "",
    rejection: ""
  });

  useEffect(() => {
    // Simulate fetching user settings
    const fetchSettings = async () => {
      try {
        // const res = await fetch('/api/settings');
        // const data = await res.json();
        // setProfile(data.profile);
        // setScoringWeights(data.scoring);
        // setEmailTemplates(data.emails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    toast({
      title: "Saving...",
      description: "Updating your preferences.",
    });
    // TODO: POST to API
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 500);
  };

  const updateWeight = (id: string, value: number[]) => {
    setScoringWeights(prev => ({ ...prev, [id]: value[0] }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-card rounded-xl border border-border p-2 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === section.id 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-xl font-semibold text-accent-foreground">
                    {profile.avatarInitials || "?"}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      placeholder="Enter first name"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      placeholder="Enter last name"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="name@company.com"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground block mb-2">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="Company Name"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}

          {activeSection === "scoring" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Scoring Criteria</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Adjust how the AI weights different factors.
              </p>
              <div className="space-y-6">
                {Object.keys(scoringWeights).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No scoring criteria loaded.</p>
                ) : (
                    Object.entries(scoringWeights).map(([key, weight]) => (
                    <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                        <span className="text-sm text-muted-foreground">{weight}%</span>
                        </div>
                        <Slider
                        value={[weight]}
                        onValueChange={(value) => updateWeight(key, value)}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                        />
                    </div>
                    ))
                )}
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeSection === "emails" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Email Templates</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Interview Invitation Template
                  </label>
                  <textarea
                    rows={6}
                    value={emailTemplates.invitation}
                    onChange={(e) => setEmailTemplates({...emailTemplates, invitation: e.target.value})}
                    placeholder="Enter invitation template..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Rejection Template
                  </label>
                  <textarea
                    rows={4}
                    value={emailTemplates.rejection}
                    onChange={(e) => setEmailTemplates({...emailTemplates, rejection: e.target.value})}
                    placeholder="Enter rejection template..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Save Templates</Button>
              </div>
            </div>
          )}
          
          {/* Other sections can remain static UI structure but without dummy data content */}
        </div>
      </div>
    </div>
  );
}