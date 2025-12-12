import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { User, Bell, Lock, Palette, Sliders, Mail } from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "scoring", label: "Scoring Criteria", icon: Sliders },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "emails", label: "Email Templates", icon: Mail },
  { id: "security", label: "Security", icon: Lock },
];

const scoringCriteria = [
  { id: "technical", label: "Technical Skills", weight: 35 },
  { id: "experience", label: "Experience Level", weight: 25 },
  { id: "cultural", label: "Cultural Fit", weight: 20 },
  { id: "education", label: "Education", weight: 10 },
  { id: "projects", label: "Projects & Portfolio", weight: 10 },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [weights, setWeights] = useState(
    scoringCriteria.reduce((acc, c) => ({ ...acc, [c.id]: c.weight }), {} as Record<string, number>)
  );

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateWeight = (id: string, value: number[]) => {
    setWeights(prev => ({ ...prev, [id]: value[0] }));
  };

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
                    SP
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
                      defaultValue="Sarah"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Park"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="sarah.park@company.com"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground block mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue="TechStartup Inc"
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
                Adjust how the AI weights different factors when scoring candidates.
              </p>
              <div className="space-y-6">
                {scoringCriteria.map((criteria) => (
                  <div key={criteria.id}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">{criteria.label}</label>
                      <span className="text-sm text-muted-foreground">{weights[criteria.id]}%</span>
                    </div>
                    <Slider
                      value={[weights[criteria.id]]}
                      onValueChange={(value) => updateWeight(criteria.id, value)}
                      max={50}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    <strong>Total:</strong> {Object.values(weights).reduce((a, b) => a + b, 0)}% 
                    {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                      <span className="text-amber-600 ml-2">(Should equal 100%)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "New applicant alerts", description: "Get notified when new candidates apply", enabled: true },
                  { label: "Screening complete", description: "Notification when AI screening finishes", enabled: true },
                  { label: "Interview reminders", description: "Reminders before scheduled interviews", enabled: true },
                  { label: "Weekly digest", description: "Summary of hiring activity each week", enabled: false },
                  { label: "Marketing updates", description: "News and tips from HirePilot", enabled: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
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
                    defaultValue={`Hi {{candidate_name}},

Thank you for applying for the {{job_title}} position at {{company_name}}. We were impressed with your background and would love to schedule an interview.

Please select a time that works for you: {{scheduling_link}}

Best regards,
{{your_name}}`}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Rejection Template
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={`Hi {{candidate_name}},

Thank you for your interest in {{company_name}}. After careful consideration, we've decided to move forward with other candidates.

We appreciate your time and wish you success in your job search.`}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Save Templates</Button>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-border">
                  <div>
                    <p className="font-medium text-foreground">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave}>Update Security</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
