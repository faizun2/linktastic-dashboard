import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  User, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertTriangle, 
  Shield, 
  Smartphone, 
  Copy, 
  Check, 
  RefreshCw,
  LogOut,
  Globe
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Settings: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] = useState("");
  
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user) {
      setCurrentEmail(user.email);
      const savedSettings = localStorage.getItem(`user_${user.id}_settings`);
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setTwoFactorEnabled(settings.twoFactorEnabled || false);
          setGoogleConnected(settings.googleConnected || false);
        } catch (e) {
          console.error("Error parsing saved settings:", e);
        }
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }
    
    if (!currentPassword) {
      toast.error("Please enter your current password to confirm");
      return;
    }
    
    setTimeout(() => {
      toast.success("Email updated successfully");
      setCurrentEmail(newEmail);
      setNewEmail("");
      setCurrentPassword("");
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setTimeout(() => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleToggleTwoFactor = () => {
    if (!twoFactorEnabled) {
      setTwoFactorSetupOpen(true);
      setTwoFactorCode(Math.random().toString(36).substring(2, 10).toUpperCase());
    } else {
      setTwoFactorEnabled(false);
      saveSecuritySettings(false, googleConnected);
      toast.success("Two-factor authentication disabled");
    }
  };

  const handleVerifyTwoFactor = () => {
    if (twoFactorVerificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setTwoFactorSetupOpen(false);
      setTwoFactorVerificationCode("");
      saveSecuritySettings(true, googleConnected);
      toast.success("Two-factor authentication enabled");
    } else {
      toast.error("Invalid verification code");
    }
  };

  const handleConnectGoogle = () => {
    setTimeout(() => {
      setGoogleConnected(true);
      saveSecuritySettings(twoFactorEnabled, true);
      toast.success("Google account connected successfully");
    }, 1500);
  };

  const handleDisconnectGoogle = () => {
    setGoogleConnected(false);
    saveSecuritySettings(twoFactorEnabled, false);
    toast.success("Google account disconnected");
  };

  const saveSecuritySettings = (twoFactor: boolean, google: boolean) => {
    if (user) {
      const settings = {
        twoFactorEnabled: twoFactor,
        googleConnected: google
      };
      localStorage.setItem(`user_${user.id}_settings`, JSON.stringify(settings));
    }
  };

  const copyTwoFactorCode = () => {
    navigator.clipboard.writeText(twoFactorCode);
    toast.success("Code copied to clipboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and security preferences
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{currentEmail}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                      Update your email address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEmailChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentEmail">Current Email</Label>
                        <Input
                          id="currentEmail"
                          value={currentEmail}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">New Email</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPasswordEmail">Current Password</Label>
                        <Input
                          id="confirmPasswordEmail"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your password to confirm"
                        />
                      </div>
                      
                      <Button type="submit">
                        Update Email
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      
                      <Button type="submit">
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            {twoFactorEnabled ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                      </div>
                      
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={handleToggleTwoFactor}
                      />
                    </div>
                    
                    {twoFactorEnabled && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-950 rounded-md">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                              Two-factor authentication is enabled
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                              You'll be asked for a verification code sent via Telegram when logging in from an unrecognized device.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>
                      Manage accounts you've connected for easier login
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">
                            {googleConnected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      
                      {googleConnected ? (
                        <Button variant="outline" size="sm" onClick={handleDisconnectGoogle}>
                          Disconnect
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleConnectGoogle}>
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security Log</CardTitle>
                    <CardDescription>
                      Recent security activity on your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Password changed</p>
                          <p className="text-sm text-muted-foreground">
                            IP: 192.168.1.1
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Successful login</p>
                          <p className="text-sm text-muted-foreground">
                            IP: 192.168.1.1
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Dialog open={twoFactorSetupOpen} onOpenChange={setTwoFactorSetupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Two-factor authentication adds an extra layer of security to your account. 
                You'll need to enter a verification code when logging in.
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Label>Your 2FA Code</Label>
                <Button variant="ghost" size="sm" onClick={copyTwoFactorCode}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <div className="bg-background p-3 rounded font-mono text-center">
                {twoFactorCode}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter this code in your Telegram bot to link your account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={twoFactorVerificationCode}
                onChange={(e) => setTwoFactorVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Enter the verification code from your Telegram bot
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwoFactorSetupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyTwoFactor}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
