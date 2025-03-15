
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Link2, LineChart, Shield, Smartphone } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-mono text-xl font-bold">
              Link<span className="text-accent">Craft</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-20 md:pt-32 md:pb-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="animate-fade-in space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your Digital Presence. <span className="text-accent">Simplified.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Craft beautiful bio links, shorten URLs, and track analytics with our intuitive platform.
                </p>
              </div>
              <div className="animate-slide-up space-x-4">
                <Button asChild size="lg">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers all the tools you need to create and manage your digital presence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="animate-fade-in dashboard-card flex flex-col items-center space-y-2 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-2">
                  <Link2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold">Link Shortening</h3>
                <p className="text-sm text-gray-500">
                  Create short, memorable links for your content that are easy to share and track.
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div className="animate-fade-in dashboard-card flex flex-col items-center space-y-2 p-6 text-center [animation-delay:200ms]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-2">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold">Bio Link Pages</h3>
                <p className="text-sm text-gray-500">
                  Create beautiful, customizable bio pages to showcase all your important links in one place.
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div className="animate-fade-in dashboard-card flex flex-col items-center space-y-2 p-6 text-center [animation-delay:400ms]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-2">
                  <LineChart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold">Advanced Analytics</h3>
                <p className="text-sm text-gray-500">
                  Track clicks, geographic data, and user behavior to optimize your content strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators, brands, and businesses optimizing their online presence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/login">
                    Create Your Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="inline-block font-mono text-xl font-bold">
                Link<span className="text-accent">Craft</span>
              </span>
            </Link>
            <p className="text-center text-sm text-gray-500 md:text-left">
              &copy; {new Date().getFullYear()} LinkCraft. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/terms" className="text-xs text-gray-500 hover:underline">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
