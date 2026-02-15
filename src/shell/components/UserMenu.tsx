import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "BCBA" | "RBT" | "Caregiver";

interface UserMenuProps {
  userName?: string;
  role?: Role;
  collapsed?: boolean;
}

const roleBadgeColors = {
  BCBA: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  RBT: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Caregiver:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

export default function UserMenu({
  userName = "John Doe",
  role = "BCBA",
  collapsed = false,
}: UserMenuProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Use Firebase user email if available, otherwise use prop
  const displayName = user?.displayName || userName;
  const userEmail = user?.email || "user@example.com";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-2 lg:p-4 group-hover/sidebar:p-4 border-t border-stone-200 dark:border-stone-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full h-auto py-3 px-2 ${collapsed ? "justify-center lg:justify-start group-hover/sidebar:justify-start" : "justify-start"} gap-3`}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex flex-col items-start text-left ${collapsed ? "hidden lg:flex group-hover/sidebar:flex" : ""}`}
            >
              <span className="text-sm font-semibold">{displayName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleBadgeColors[role]}`}
              >
                {role}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // TODO: Navigate to profile page/modal
              // Recommended: Show user profile with editable fields:
              // - Name, email, avatar
              // - Credentials and certifications
              // - Notification preferences
              console.log("Profile clicked");
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // TODO: Navigate to billing page
              // Show subscription details, payment methods, invoices
              console.log("Billing clicked");
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // TODO: Navigate to settings page
              // Application preferences, security settings, integrations
              console.log("Settings clicked");
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              toggleTheme();
            }}
          >
            {isDark ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
