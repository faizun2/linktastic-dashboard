
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import MobilePreview, { BioLink } from "@/components/MobilePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash, GripVertical, ImageIcon, Edit, Pen, Settings, Image, ImagePlus, Upload, ExternalLink, Share2, Globe, LinkIcon, EyeOff, Eye, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";

interface SortableLinkItemProps {
  link: BioLink;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const SortableLinkItem: React.FC<SortableLinkItemProps> = ({ link, onEdit, onDelete, onToggleActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-gray-800 rounded-md border mb-3 p-3">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="cursor-grab mr-2">
          <GripVertical size={20} className="text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className={`font-medium ${!link.active ? "text-gray-400" : ""}`}>{link.title}</h3>
            {!link.active && (
              <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
        <div className="flex space-x-2 items-center">
          <Switch 
            checked={link.active !== false}
            onCheckedChange={() => onToggleActive(link.id)}
            aria-label={link.active !== false ? "Deactivate link" : "Activate link"}
          />
          <Button variant="ghost" size="icon" onClick={() => onEdit(link.id)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(link.id)}>
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Background presets for the link bio
const backgroundPresets = [
  { id: 'preset1', name: 'Sunset Gradient', value: 'linear-gradient(108deg, rgba(242,245,139,1) 17.7%, rgba(148,197,20,0.68) 91.2%)' },
  { id: 'preset2', name: 'Cool Blue', value: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)' },
  { id: 'preset3', name: 'Warm Orange', value: 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)' },
  { id: 'preset4', name: 'Soft Lavender', value: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)' },
  { id: 'preset5', name: 'Forest Green', value: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)' },
];

// Container style previews
const containerStyles = [
  { id: 'default', name: 'Default', preview: 'rounded-md border border-gray-300' },
  { id: 'rounded', name: 'Rounded', preview: 'rounded-xl border border-gray-300' },
  { id: 'pill', name: 'Pill', preview: 'rounded-full border border-gray-300' },
  { id: 'outline', name: 'Outline', preview: 'rounded-md border-2 border-gray-400 bg-opacity-10' },
];

const LinkBio: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("John Doe");
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [profileBio, setProfileBio] = useState("Digital creator & web developer");
  const [links, setLinks] = useState<BioLink[]>([
    { id: "1", title: "My Portfolio", url: "https://example.com/portfolio", active: true },
    { id: "2", title: "GitHub", url: "https://github.com", active: true },
    { id: "3", title: "Twitter", url: "https://twitter.com", active: true },
  ]);
  
  const [backgroundColor, setBackgroundColor] = useState("#f0f4f8");
  const [backgroundType, setBackgroundType] = useState<"color" | "gradient" | "image">("color");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [containerStyle, setContainerStyle] = useState<"default" | "rounded" | "pill" | "outline">("default");
  const [customBaseUrl, setCustomBaseUrl] = useState("https://masfaiz.com");
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [customDomainModalOpen, setCustomDomainModalOpen] = useState(false);

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

  // Load saved data from localStorage
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`user_${user.id}_bio`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setProfileName(data.profileName || "John Doe");
          setProfileImage(data.profileImage || "/placeholder.svg");
          setProfileBio(data.profileBio || "Digital creator & web developer");
          setLinks(data.links || []);
          setBackgroundColor(data.backgroundColor || "#f0f4f8");
          setBackgroundType(data.backgroundType || "color");
          setBackgroundImage(data.backgroundImage || "");
          setBackgroundBlur(data.backgroundBlur || false);
          setAccentColor(data.accentColor || "#4f46e5");
          setContainerStyle(data.containerStyle || "default");
          setCustomBaseUrl(data.customBaseUrl || "https://masfaiz.com");
        } catch (e) {
          console.error("Error parsing saved data:", e);
        }
      }
    }
  }, [user]);

  // Save data to localStorage
  const saveData = () => {
    if (user) {
      const dataToSave = {
        profileName,
        profileImage,
        profileBio,
        links,
        backgroundColor,
        backgroundType,
        backgroundImage,
        backgroundBlur,
        accentColor,
        containerStyle,
        customBaseUrl,
      };
      localStorage.setItem(`user_${user.id}_bio`, JSON.stringify(dataToSave));
      toast.success("Changes saved successfully");
    }
  };

  const handleAddLink = () => {
    setEditingLink(null);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setEditModalOpen(true);
  };

  const handleEditLink = (id: string) => {
    const link = links.find((link) => link.id === id);
    if (link) {
      setEditingLink(link);
      setNewLinkTitle(link.title);
      setNewLinkUrl(link.url);
      setEditModalOpen(true);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
    toast.success("Link deleted");
  };

  const handleToggleLinkActive = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, active: link.active === false ? true : false } : link
      )
    );
    toast.success("Link status updated");
  };

  const handleSaveLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error("Please enter both title and URL");
      return;
    }

    try {
      // Validate URL
      new URL(newLinkUrl);
      
      if (editingLink) {
        // Update existing link
        setLinks(
          links.map((link) =>
            link.id === editingLink.id
              ? { ...link, title: newLinkTitle, url: newLinkUrl }
              : link
          )
        );
        toast.success("Link updated");
      } else {
        // Add new link
        const newLink: BioLink = {
          id: Date.now().toString(),
          title: newLinkTitle,
          url: newLinkUrl,
          active: true,
        };
        setLinks([...links, newLink]);
        toast.success("Link added");
      }
      
      setEditModalOpen(false);
    } catch (e) {
      toast.error("Please enter a valid URL");
    }
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
      toast.success("Links reordered");
    }
  };

  const handleCustomDomain = () => {
    setCustomDomainModalOpen(true);
  };

  const handleSaveCustomDomain = () => {
    toast.success("Custom domain updated");
    setCustomDomainModalOpen(false);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(`${customBaseUrl}/${user?.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleSelectBackgroundPreset = (preset: string) => {
    setBackgroundType("gradient");
    setBackgroundColor(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBackgroundImage(e.target.result as string);
          setBackgroundType("image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Link Bio Editor</h1>
            <p className="text-muted-foreground mt-1">
              Customize your link bio page
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline" onClick={handleCustomDomain}>
              <Globe className="mr-2 h-4 w-4" />
              Custom Domain
            </Button>
            <Button variant="outline" onClick={handleShareLink}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={saveData}>Save Changes</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div>
            <Tabs defaultValue="links" className="space-y-6">
              <TabsList>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="links" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>My Links</CardTitle>
                      <Button onClick={handleAddLink} size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                    <CardDescription>
                      Add, edit, or rearrange your bio links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                            <SortableLinkItem
                              key={link.id}
                              link={link}
                              onEdit={handleEditLink}
                              onDelete={handleDeleteLink}
                              onToggleActive={handleToggleLinkActive}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          You don't have any links yet
                        </p>
                        <Button onClick={handleAddLink}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your name, bio, and profile image
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Name</Label>
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
                        placeholder="Write a short bio"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <div className="mt-2 flex items-center">
                        <div className="h-16 w-16 rounded-full overflow-hidden border">
                          <img 
                            src={profileImage} 
                            alt="Profile Preview" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground ml-3">
                          Enter the URL of your profile image. For best results, use a square image.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Background Settings</CardTitle>
                    <CardDescription>
                      Choose a background for your link bio page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Background Type</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={backgroundType === "color" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setBackgroundType("color")}
                        >
                          Color
                        </Button>
                        <Button 
                          variant={backgroundType === "gradient" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setBackgroundType("gradient")}
                        >
                          Gradient
                        </Button>
                        <Button 
                          variant={backgroundType === "image" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setBackgroundType("image")}
                        >
                          Image
                        </Button>
                      </div>
                    </div>
                    
                    {backgroundType === "color" && (
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center">
                          <Input
                            id="backgroundColor"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1"
                          />
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="ml-2 h-10 w-10 rounded border cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                    
                    {backgroundType === "gradient" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Gradient Presets</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {backgroundPresets.map(preset => (
                              <button
                                key={preset.id}
                                className="h-12 rounded-md border overflow-hidden cursor-pointer"
                                style={{ background: preset.value }}
                                onClick={() => handleSelectBackgroundPreset(preset.value)}
                                title={preset.name}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customGradient">Custom Gradient</Label>
                          <Input
                            id="customGradient"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%)"
                          />
                        </div>
                      </div>
                    )}
                    
                    {backgroundType === "image" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="backgroundImage">Background Image URL</Label>
                          <Input
                            id="backgroundImage"
                            value={backgroundImage}
                            onChange={(e) => setBackgroundImage(e.target.value)}
                            placeholder="https://example.com/background.jpg"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Upload Image</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleFileUpload}
                              className="flex-1"
                            />
                            <Button variant="outline" size="icon">
                              <Upload size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="backgroundBlur" 
                            checked={backgroundBlur}
                            onCheckedChange={setBackgroundBlur}
                          />
                          <Label htmlFor="backgroundBlur">Apply Blur Effect</Label>
                        </div>
                        
                        {backgroundImage && (
                          <div className="mt-2 rounded-md overflow-hidden border h-32">
                            <img 
                              src={backgroundImage} 
                              alt="Background Preview" 
                              className={`h-full w-full object-cover ${backgroundBlur ? 'blur-sm' : ''}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                                toast.error("Failed to load image");
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center">
                          <Input
                            id="accentColor"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="flex-1"
                          />
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="ml-2 h-10 w-10 rounded border cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Label>Container Style</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {containerStyles.map(style => (
                          <div 
                            key={style.id}
                            className={`cursor-pointer p-4 flex flex-col items-center ${containerStyle === style.id ? 'ring-2 ring-primary' : 'border'} rounded-md`}
                            onClick={() => setContainerStyle(style.id as any)}
                          >
                            <div className={`w-full mb-2 h-8 ${style.preview}`}></div>
                            <span className="text-sm">{style.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Preview Section */}
          <div className="flex justify-center">
            <div className="sticky top-24">
              <h3 className="text-center font-medium mb-4">Mobile Preview</h3>
              <MobilePreview
                profileName={profileName}
                profileImage={profileImage}
                profileBio={profileBio}
                links={links.filter(link => link.active !== false)}
                backgroundColor={backgroundType === "image" ? backgroundImage : backgroundColor}
                accentColor={accentColor}
                containerStyle={containerStyle}
                backgroundType={backgroundType}
                backgroundBlur={backgroundBlur}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Edit Link Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link" : "Add New Link"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkTitle">Link Title</Label>
              <Input
                id="linkTitle"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="e.g. My Portfolio"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLink}>
              {editingLink ? "Save Changes" : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Custom Domain Modal */}
      <Dialog open={customDomainModalOpen} onOpenChange={setCustomDomainModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Custom Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customBaseUrl">Base URL</Label>
              <Input
                id="customBaseUrl"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
              <p className="text-xs text-muted-foreground">
                Your short links will use this base URL.
              </p>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <p className="text-sm">Your current short link: <span className="font-medium">{customBaseUrl}/{user?.id}</span></p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomDomainModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomDomain}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkBio;
