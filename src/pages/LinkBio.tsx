
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import MobilePreview, { BioLink } from "@/components/MobilePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash, GripVertical, ImageIcon, Edit, Pen, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableLinkItemProps {
  link: BioLink;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableLinkItem: React.FC<SortableLinkItemProps> = ({ link, onEdit, onDelete }) => {
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
          <h3 className="font-medium">{link.title}</h3>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
        <div className="flex space-x-2">
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

const LinkBio: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("John Doe");
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [profileBio, setProfileBio] = useState("Digital creator & web developer");
  const [links, setLinks] = useState<BioLink[]>([
    { id: "1", title: "My Portfolio", url: "https://example.com/portfolio" },
    { id: "2", title: "GitHub", url: "https://github.com" },
    { id: "3", title: "Twitter", url: "https://twitter.com" },
  ]);
  
  const [backgroundColor, setBackgroundColor] = useState("#f0f4f8");
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [containerStyle, setContainerStyle] = useState<"default" | "rounded" | "pill" | "outline">("default");
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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
          setAccentColor(data.accentColor || "#4f46e5");
          setContainerStyle(data.containerStyle || "default");
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
        accentColor,
        containerStyle,
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
          
          <div className="mt-4 md:mt-0">
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
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your link bio page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="containerStyle">Container Style</Label>
                      <Select 
                        value={containerStyle} 
                        onValueChange={(value) => setContainerStyle(value as any)}
                      >
                        <SelectTrigger id="containerStyle">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
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
                links={links}
                backgroundColor={backgroundColor}
                accentColor={accentColor}
                containerStyle={containerStyle}
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
    </div>
  );
};

export default LinkBio;
