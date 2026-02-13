import {
  Users,
  User,
  FolderOpen,
  Eye,
  Activity,
  ChartColumn,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface MainNavProps {
  collapsed?: boolean;
}

const navItems: NavItem[] = [
  { name: "Accounts", icon: Users, path: "/accounts" },
  { name: "Clients", icon: User, path: "/clients" },
  { name: "Programs", icon: FolderOpen, path: "/programs" },
  { name: "Review", icon: Eye, path: "/review" },
  { name: "Sessions", icon: Activity, path: "/sessions" },
  { name: "Reporting", icon: ChartColumn, path: "/reporting" },
];

export default function MainNav({ collapsed = false }: MainNavProps) {
  const [activePath, setActivePath] = useState("/");

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePath === item.path;

        return (
          <Button
            key={item.path}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full gap-3",
              collapsed
                ? "justify-center lg:justify-start group-hover/sidebar:justify-start"
                : "justify-start",
              isActive && "bg-primary/10 text-primary hover:bg-primary/20",
            )}
            onClick={() => setActivePath(item.path)}
            title={collapsed ? item.name : undefined}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span
              className={cn(
                collapsed && "hidden lg:inline group-hover/sidebar:inline",
              )}
            >
              {item.name}
            </span>
          </Button>
        );
      })}
    </nav>
  );
}
