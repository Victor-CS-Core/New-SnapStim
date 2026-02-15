import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import MainNav from "./MainNav";
import UserMenu from "./UserMenu";

interface AppShellProps {
  children?: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function AppShell({
  children,
  currentPath,
  onNavigate,
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-900">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="p-6 border-b border-stone-200 dark:border-stone-800">
            <h1 className="text-2xl font-bold text-primary">SnapStim</h1>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <MainNav currentPath={currentPath} onNavigate={onNavigate} />
          </div>
          <UserMenu />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-[240px] hover:w-[240px] bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 transition-all duration-300 group/sidebar">
        <div className="p-3 lg:p-6 border-b border-stone-200 dark:border-stone-800">
          <h1 className="text-2xl font-bold text-primary truncate lg:block group-hover/sidebar:block hidden">
            SnapStim
          </h1>
          <h1 className="text-2xl font-bold text-primary lg:hidden group-hover/sidebar:hidden block">
            S
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <MainNav
            collapsed
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        </div>
        <UserMenu collapsed />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>

      {/* Offline/Sync Indicator */}
      <OfflineIndicator />
    </div>
  );
}
