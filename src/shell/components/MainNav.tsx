import { Users, User, FolderOpen, Eye, Activity, ChartColumn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Accounts', icon: Users, path: '/accounts' },
  { name: 'Clients', icon: User, path: '/clients' },
  { name: 'Programs', icon: FolderOpen, path: '/programs' },
  { name: 'Review', icon: Eye, path: '/review' },
  { name: 'Sessions', icon: Activity, path: '/sessions' },
  { name: 'Reporting', icon: ChartColumn, path: '/reporting' },
];

export default function MainNav() {
  const [activePath, setActivePath] = useState('/');

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
              "w-full justify-start gap-3",
              isActive && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            onClick={() => setActivePath(item.path)}
          >
            <Icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Button>
        );
      })}
    </nav>
  );
}
