
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Log the 404 error for potential analytics tracking
  useEffect(() => {
    console.error(`404 Error: User attempted to access non-existent route: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")}>
            Go to Homepage
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Looking for the short link? It might be a custom LinkCraft link.
          </p>
          <a 
            href="/"
            className="mt-2 text-sm text-primary flex items-center justify-center gap-1 hover:underline"
          >
            <span>Go to LinkCraft homepage</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
