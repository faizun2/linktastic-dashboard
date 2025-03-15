
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage and Share Your Links{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Create your personalized link bio page, shorten URLs, and track engagement with LinkCraft - your all-in-one link management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/link-bio")}
              >
                Create Link Bio
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                    <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Link Shortening</h3>
                <p className="text-muted-foreground">
                  Create short, memorable links that redirect to your long URLs. Perfect for social media and marketing.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-accent"
                  >
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
                    <line x1="8" y1="16" x2="8.01" y2="16"></line>
                    <line x1="8" y1="20" x2="8.01" y2="20"></line>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    <line x1="12" y1="22" x2="12.01" y2="22"></line>
                    <line x1="16" y1="16" x2="16.01" y2="16"></line>
                    <line x1="16" y1="20" x2="16.01" y2="20"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Customizable Bio Page</h3>
                <p className="text-muted-foreground">
                  Create a personalized bio page with all your important links in one place. Customize colors, styles, and more.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-green-500"
                  >
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Track clicks, geographic data, referrers, and more for all your links. Make data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to take control of your links?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of creators, marketers, and businesses who use LinkCraft to manage their online presence.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign Up Now"}
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">LinkCraft</h3>
              <p className="text-muted-foreground">Your link management platform</p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Product</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Features</a></li>
                  <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground">Roadmap</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">About Us</a></li>
                  <li><a href="#" className="hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LinkCraft. All rights reserved.
            </p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
