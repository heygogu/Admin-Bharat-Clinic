"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

// Define the shape of our context
type UserRoleContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
  isLoading: boolean;
};

// Create the context with a default value
const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {},
  isLoading: true,
});

// Create a provider component
export function UserRoleProvider({
  children,
  initialRole = null,
}: {
  children: ReactNode;
  initialRole?: string | null;
}) {
  const [role, setRole] = useState<string | null>(() => {
    // Try to get the role from localStorage on initial render (client-side only)
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("userRole");
      return savedRole || initialRole;
    }
    return initialRole;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Save role to localStorage when it changes
 useEffect(() => {
   if (role !== null) {
     localStorage.setItem("userRole", role);
     setIsLoading(false);
   }
 }, [role]);

  // If we have an initialRole from props, use it and stop loading
  useEffect(() => {
    if (initialRole !== null) {
      setRole(initialRole);
      setIsLoading(false);
    }
  }, [initialRole]);

  return (
    <UserRoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
}

// Create a hook to use the context
export function useUserRole() {
  const context = useContext(UserRoleContext);

  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }

  return context;
}
