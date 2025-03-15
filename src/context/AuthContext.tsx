
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, accept any non-empty email/password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    // Create a user object
    const newUser = {
      id: btoa(email).replace(/=/g, ""),
      email,
      name: email.split("@")[0]
    };
    
    // Save user data
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = async (email: string, password: string): Promise<void> => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    // Check if user already exists (for demo)
    const storedUsers = localStorage.getItem("users") || "[]";
    let users = [];
    
    try {
      users = JSON.parse(storedUsers);
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User already exists");
      }
    } catch (e) {
      console.error("Error checking existing users:", e);
      users = [];
    }
    
    // Create a new user
    const newUser = {
      id: btoa(email).replace(/=/g, ""),
      email,
      name: email.split("@")[0]
    };
    
    // Save the user to storage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
