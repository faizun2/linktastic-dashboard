
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Home, LineChart, Layout, LogOut, User } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Function to get initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Check if path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-mono text-xl font-bold">
              Link<span className="text-accent">Craft</span>
            </span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex md:items-center md:space-x-2 ml-6">
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm rounded-md ${
                  isActive("/dashboard")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                } transition-colors`}
              >
                <span className="flex items-center gap-1.5">
                  <Home size={16} />
                  Dashboard
                </span>
              </Link>
              <Link
                to="/analytics"
                className={`px-3 py-2 text-sm rounded-md ${
                  isActive("/analytics")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                } transition-colors`}
              >
                <span className="flex items-center gap-1.5">
                  <LineChart size={16} />
                  Analytics
                </span>
              </Link>
              <Link
                to="/linkbio"
                className={`px-3 py-2 text-sm rounded-md ${
                  isActive("/linkbio")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                } transition-colors`}
              >
                <span className="flex items-center gap-1.5">
                  <Layout size={16} />
                  Link Bio
                </span>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback>{user?.username ? getInitials(user.username) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
