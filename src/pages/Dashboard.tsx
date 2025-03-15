
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import LinkItem, { LinkItemProps } from "@/components/LinkItem";
import EditLinkModal from "@/components/EditLinkModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Link, Search, LineChart, Calendar, BarChart } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

type Link = Omit<LinkItemProps, "onEdit" | "onDelete">;

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
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

  // Load links from localStorage on component mount
  useEffect(() => {
    if (user) {
      const storedLinks = localStorage.getItem(`user_${user.id}_links`);
      if (storedLinks) {
        try {
          const parsedLinks = JSON.parse(storedLinks).map((link: any) => ({
            ...link,
            createdAt: new Date(link.createdAt)
          }));
          setLinks(parsedLinks);
          setFilteredLinks(parsedLinks);
        } catch (e) {
          console.error("Error parsing stored links:", e);
          setLinks([]);
          setFilteredLinks([]);
        }
      } else {
        // Set some demo links for first-time users
        const demoLinks = [
          {
            id: "link-1",
            title: "My Portfolio",
            url: "https://example.com/portfolio",
            shortUrl: `${window.location.origin}/port123`,
            clickCount: 42,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            id: "link-2",
            title: "GitHub Profile",
            url: "https://github.com",
            shortUrl: `${window.location.origin}/github`,
            clickCount: 17,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: "link-3",
            title: "LinkedIn",
            url: "https://linkedin.com",
            shortUrl: `${window.location.origin}/linkedin`,
            clickCount: 8,
            createdAt: new Date()
          }
        ];
        setLinks(demoLinks);
        setFilteredLinks(demoLinks);
        localStorage.setItem(`user_${user.id}_links`, JSON.stringify(demoLinks));
      }
    }
  }, [user]);

  // Filter links whenever search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLinks(links);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = links.filter(
        (link) =>
          link.title.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query) ||
          link.shortUrl.toLowerCase().includes(query)
      );
      setFilteredLinks(filtered);
    }
  }, [searchQuery, links]);

  // Save links to localStorage whenever they change
  useEffect(() => {
    if (user && links.length > 0) {
      localStorage.setItem(`user_${user.id}_links`, JSON.stringify(links));
    }
  }, [links, user]);

  const handleCreateLink = () => {
    setEditingLink(null);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEditLink = (id: string) => {
    const link = links.find((link) => link.id === id);
    if (link) {
      setEditingLink(link);
      setIsCreating(false);
      setModalOpen(true);
    }
  };

  const handleDeleteLink = (id: string) => {
    const newLinks = links.filter((link) => link.id !== id);
    setLinks(newLinks);
    toast.success("Link deleted successfully");
  };

  const handleSaveLink = (linkData: { id?: string; title: string; url: string; shortUrl?: string }) => {
    if (isCreating) {
      // Create new link
      const newLink: Link = {
        id: `link-${Date.now()}`,
        title: linkData.title,
        url: linkData.url,
        shortUrl: linkData.shortUrl || `${window.location.origin}/${Math.random().toString(36).substring(2, 8)}`,
        clickCount: 0,
        createdAt: new Date()
      };
      setLinks([newLink, ...links]);
      toast.success("Link created successfully");
    } else if (linkData.id) {
      // Update existing link
      const updatedLinks = links.map((link) =>
        link.id === linkData.id
          ? {
              ...link,
              title: linkData.title,
              url: linkData.url,
              shortUrl: linkData.shortUrl || link.shortUrl
            }
          : link
      );
      setLinks(updatedLinks);
      toast.success("Link updated successfully");
    }
    
    setModalOpen(false);
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

  // Render dashboard statistics
  const renderStats = () => {
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
    const totalLinks = links.length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Links</p>
                <h3 className="text-2xl font-bold mt-1">{totalLinks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Link className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <h3 className="text-2xl font-bold mt-1">{totalClicks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Clicks Per Link</p>
                <h3 className="text-2xl font-bold mt-1">
                  {totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your links and track their performance
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={handleCreateLink}>
              <Plus className="mr-2 h-4 w-4" />
              Create Link
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList>
            <TabsTrigger value="links">All Links</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-6">
            {/* Search and filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Link list */}
            <div className="space-y-1">
              {filteredLinks.length > 0 ? (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext 
                    items={filteredLinks.map(link => link.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredLinks.map((link) => (
                      <LinkItem
                        key={link.id}
                        {...link}
                        onEdit={handleEditLink}
                        onDelete={handleDeleteLink}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No links found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any links yet</p>
                  <Button onClick={handleCreateLink}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Link
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            {renderStats()}
            
            <Card>
              <CardHeader>
                <CardTitle>Link Analytics</CardTitle>
                <CardDescription>
                  Click performance of your links over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <EditLinkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLink}
        linkData={editingLink}
        isCreating={isCreating}
      />
    </div>
  );
};

export default Dashboard;
