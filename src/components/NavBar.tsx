import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, Shield, Plus, Menu, X } from "lucide-react";
import { AddZoneModal } from "@/components/AddZoneModal";
import { useEffect, useMemo, useState } from "react";
import { subscribeActivity } from "@/types/activity";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { loadSettings, onSettingsUpdated, saveSettings } from "@/lib/settings";
import About from "@/pages/About";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activity, setActivity] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings());
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeActivity((items) => setActivity(items));
    const off = onSettingsUpdated((s) => setSettings(s));
    return () => {
      unsub?.();
      off?.();
    };
  }, []);

  const unreadCount = useMemo(() => Math.min(activity.length, 9), [activity]);

  return (
    <>
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  MyG
                </h1>
                <p className="text-xs text-muted-foreground">
                  Family Safety Monitor
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <AddZoneModal onZoneAdded={() => { window.dispatchEvent(new Event("zone:refresh")); }} buttonLabel="New Zone" />
              {/* Insert About Button */}
              <About />
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {activity.slice(0, 8).map((a) => (
                      <DropdownMenuItem key={a.id} className="flex-col items-start whitespace-normal">
                        <span className="text-sm font-medium">{a.message}</span>
                        <span className="text-xs text-muted-foreground">{a.type} • {a.severity}</span>
                      </DropdownMenuItem>
                    ))}
                    {activity.length === 0 && (
                      <DropdownMenuItem disabled>No recent activity</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {unreadCount > 0 && (
                  <Badge>
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
