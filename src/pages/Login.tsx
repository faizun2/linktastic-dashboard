
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
        toast.success("Account created successfully! You can now log in.");
        setIsRegister(false);
      } else {
        await login(email, password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(isRegister ? "Failed to create account" : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">
              {isRegister ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegister 
                ? "Enter your email and create a password to get started" 
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegister && (
                    <a 
                      href="#" 
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Password reset functionality coming soon");
                      }}
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                className="w-full mb-4" 
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                {" "}
                <a
                  href="#"
                  className="text-primary font-medium hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegister(!isRegister);
                  }}
                >
                  {isRegister ? "Sign in" : "Create one"}
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
