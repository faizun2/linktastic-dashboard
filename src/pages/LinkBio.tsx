
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import MobilePreview, { BioLink } from "@/components/MobilePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Copy, Edit, Trash, MoveVertical, ExternalLink, Plus, Download, Palette } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Component for a sortable link item
const SortableBioLink: React.FC<{
  link: BioLink;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ link, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-2">
      <CardContent className="p-3 flex items-center">
        <div 
          {...attributes} 
          {...listeners}
          className="mr-3 cursor-grab active:cursor-grabbing touch-none opacity-50 hover:opacity-100 transition-opacity"
        >
          <MoveVertical size={18} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{link.title}</h3>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs text-muted-foreground hover:text-foreground truncate flex items-center"
          >
            <span className="truncate">{link.url}</span>
            <ExternalLink className="ml-1 h-3 w-3 inline flex-shrink-0" />
          </a>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(link.id)}
            className="h-8 w-8"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(link.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main LinkBio component
const LinkBio: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState<BioLink[]>([]);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [backgroundColor, setBackgroundColor] = useState("#f9fafb");
  const [containerStyle, setContainerStyle] = useState<"default" | "rounded" | "pill" | "outline">("default");
  const [bioUrl, setBioUrl] = useState("");
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Initialize profile data
  useEffect(() => {
    if (user) {
      // Load profile data
      const storedProfile = localStorage.getItem(`user_${user.id}_bio_profile`);
      if (storedProfile) {
        try {
          const { name, bio, image, accent, background, container } = JSON.parse(storedProfile);
          setProfileName(name || user.username);
          setProfileBio(bio || "");
          setProfileImage(image || user.avatar);
          setAccentColor(accent || "#3b82f6");
          setBackgroundColor(background || "#f9fafb");
          setContainerStyle(container || "default");
        } catch (e) {
          console.error("Error parsing stored profile:", e);
          setProfileDefaults();
        }
      } else {
        setProfileDefaults();
      }

      // Load links
      const storedLinks = localStorage.getItem(`user_${user.id}_bio_links`);
      if (storedLinks) {
        try {
          setLinks(JSON.parse(storedLinks));
        } catch (e) {
          console.error("Error parsing stored bio links:", e);
          setDemoLinks();
        }
      } else {
        setDemoLinks();
      }

      // Set bio URL
      setBioUrl(`${window.location.origin}/bio/${user.username.toLowerCase()}`);
    }
  }, [user]);

  // Set default profile values
  const setProfileDefaults = () => {
    if (user) {
      setProfileName(user.username);
      setProfileBio("Digital creator & web enthusiast");
      setProfileImage(user.avatar);
      setAccentColor("#3b82f6");
      setBackgroundColor("#f9fafb");
      setContainerStyle("default");
    }
  };

  // Set demo links
  const setDemoLinks = () => {
    const demoLinks: BioLink[] = [
      {
        id: "biolink-1",
        title: "My Website",
        url: "https://example.com",
      },
      {
        id: "biolink-2",
        title: "Follow me on Twitter",
        url: "https://twitter.com",
      },
      {
        id: "biolink-3",
        title: "Check out my YouTube",
        url: "https://youtube.com",
      }
    ];
    setLinks(demoLinks);
    
    if (user) {
      localStorage.setItem(`user_${user.id}_bio_links`, JSON.stringify(demoLinks));
    }
  };

  // Save profile data whenever it changes
  useEffect(() => {
    if (user) {
      const profileData = {
        name: profileName,
        bio: profileBio,
        image: profileImage,
        accent: accentColor,
        background: backgroundColor,
        container: containerStyle
      };
      
      localStorage.setItem(`user_${user.id}_bio_profile`, JSON.stringify(profileData));
    }
  }, [user, profileName, profileBio, profileImage, accentColor, backgroundColor, containerStyle]);

  // Save links whenever they change
  useEffect(() => {
    if (user && links.length > 0) {
      localStorage.setItem(`user_${user.id}_bio_links`, JSON.stringify(links));
    }
  }, [user, links]);

  // Handle link operations
  const handleAddLink = () => {
    const newLink: BioLink = {
      id: `biolink-${Date.now()}`,
      title: "New Link",
      url: "https://example.com"
    };
    
    setLinks([...links, newLink]);
    toast.success("Link added");
  };

  const handleEditLink = (id: string) => {
    // Mock implementation - in a real app, this would open a modal
    const linkTitle = prompt("Enter link title:", links.find(l => l.id === id)?.title);
    const linkUrl = prompt("Enter link URL:", links.find(l => l.id === id)?.url);
    
    if (linkTitle && linkUrl) {
      const updatedLinks = links.map(link => 
        link.id === id ? { ...link, title: linkTitle, url: linkUrl } : link
      );
      setLinks(updatedLinks);
      toast.success("Link updated");
    }
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    toast.success("Link removed");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Find the indices of the dragged item and the drop target
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);
      
      // Create a new array with the items reordered
      const newLinks = [...links];
      const [removed] = newLinks.splice(oldIndex, 1);
      newLinks.splice(newIndex, 0, removed);
      
      setLinks(newLinks);
      toast.success("Link order updated");
    }
  };

  const handleCopyBioUrl = () => {
    navigator.clipboard.writeText(bioUrl);
    toast.success("Bio URL copied to clipboard!");
  };

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Link Bio</h1>
            <p className="text-muted-foreground mt-1">
              Customize your bio page and manage your links
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={handleCopyBioUrl}>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            <Button onClick={handleSaveProfile}>
              <Check className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Editor */}
          <div>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Display Name</Label>
                      <Input
                        id="profileName"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Your Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileBio">Bio</Label>
                      <Textarea
                        id="profileBio"
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Tell visitors about yourself"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Keep it short and sweet. 150 characters or less.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the URL of your profile image
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bioUrl">Your Bio URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bioUrl"
                          value={bioUrl}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyBioUrl}
                          className="h-10 w-10"
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="links" className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Bio Links</CardTitle>
                      <Button size="sm" onClick={handleAddLink}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      Drag and drop to reorder your links
                    </div>
                    
                    {links.length > 0 ? (
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext 
                          items={links.map(link => link.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {links.map((link) => (
                            <SortableBioLink
                              key={link.id}
                              link={link}
                              onEdit={handleEditLink}
                              onDelete={handleDeleteLink}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You don't have any links yet</p>
                        <Button onClick={handleAddLink}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-10 rounded-md cursor-pointer border border-input"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-10 h-10 rounded-md cursor-pointer border border-input"
                        />
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label>Button Style</Label>
                      <RadioGroup
                        value={containerStyle}
                        onValueChange={(v) => setContainerStyle(v as any)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem
                            value="default"
                            id="container-default"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="container-default"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="w-full h-8 rounded-md bg-accent"></div>
                            <span className="mt-2">Default</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem
                            value="rounded"
                            id="container-rounded"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="container-rounded"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="w-full h-8 rounded-xl bg-accent"></div>
                            <span className="mt-2">Rounded</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem
                            value="pill"
                            id="container-pill"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="container-pill"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="w-full h-8 rounded-full bg-accent"></div>
                            <span className="mt-2">Pill</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem
                            value="outline"
                            id="container-outline"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="container-outline"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="w-full h-8 rounded-md border-2 border-accent bg-transparent"></div>
                            <span className="mt-2">Outline</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column: Preview */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <h2 className="text-lg font-medium">Mobile Preview</h2>
              <p className="text-sm text-muted-foreground">
                See how your profile looks on mobile devices
              </p>
            </div>
            
            <MobilePreview
              profileName={profileName}
              profileImage={profileImage}
              profileBio={profileBio}
              links={links}
              backgroundColor={backgroundColor}
              containerStyle={containerStyle}
              accentColor={accentColor}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkBio;
