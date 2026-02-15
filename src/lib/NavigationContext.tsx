import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * Navigation context data that can be passed between sections
 */
export interface NavigationContextData {
  clientId?: string;
  programId?: string;
  sessionId?: string;
  userId?: string;
  sourceView?: string;
  returnPath?: string;
  [key: string]: any; // Allow additional custom data
}

interface NavigationContextValue {
  currentPath: string;
  contextData: NavigationContextData;
  navigateTo: (path: string, context?: NavigationContextData) => void;
  clearContext: () => void;
  updateContext: (updates: Partial<NavigationContextData>) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

interface NavigationProviderProps {
  children: ReactNode;
  initialPath?: string;
  onNavigate?: (path: string, context?: NavigationContextData) => void;
}

export function NavigationProvider({
  children,
  initialPath = "/",
  onNavigate,
}: NavigationProviderProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [contextData, setContextData] = useState<NavigationContextData>({});

  const navigateTo = (path: string, context?: NavigationContextData) => {
    setCurrentPath(path);
    if (context) {
      setContextData(context);
    }
    // Call external navigation handler if provided (e.g., to update App.tsx state)
    if (onNavigate) {
      onNavigate(path, context);
    }
  };

  const clearContext = () => {
    setContextData({});
  };

  const updateContext = (updates: Partial<NavigationContextData>) => {
    setContextData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        contextData,
        navigateTo,
        clearContext,
        updateContext,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation context
 * @throws Error if used outside NavigationProvider
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

/**
 * Helper to get navigation context safely (returns null if outside provider)
 */
export function useNavigationSafe() {
  return useContext(NavigationContext);
}
