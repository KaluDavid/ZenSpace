/**
 * AuthContext — Global authentication state management
 * Persists user session via AsyncStorage.
 */

import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "@zenspace_user";
const ALL_USERS_KEY = "@zenspace_all_users";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getInitials(username: string): string {
  return username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // no session
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signup = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if email already registered
      const allUsersRaw = await AsyncStorage.getItem(ALL_USERS_KEY);
      const allUsers: User[] = allUsersRaw ? JSON.parse(allUsersRaw) : [];

      if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      }

      const newUser: User = {
        id: generateId(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password, // In production: use a proper hashing lib
        createdAt: new Date().toISOString(),
        avatarInitials: getInitials(username),
      };

      // Persist to all-users list
      allUsers.push(newUser);
      await AsyncStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));

      // Set as current session
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const allUsersRaw = await AsyncStorage.getItem(ALL_USERS_KEY);
      const allUsers: User[] = allUsersRaw ? JSON.parse(allUsersRaw) : [];

      const found = allUsers.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password,
      );

      if (!found) {
        return {
          success: false,
          error: "Incorrect email or password. Please try again.",
        };
      }

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
      setUser(found);
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
