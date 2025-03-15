
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditLinkModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (linkData: { id?: string; title: string; url: string; shortUrl?: string }) => void;
  linkData?: { id: string; title: string; url: string; shortUrl: string } | null;
  isCreating?: boolean;
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({
  open,
  onClose,
  onSave,
  linkData,
  isCreating = false,
}) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  // Initialize form when link data changes
  useEffect(() => {
    if (linkData) {
      setTitle(linkData.title);
      setUrl(linkData.url);
      setShortCode(linkData.shortUrl.split("/").pop() || "");
    } else {
      setTitle("");
      setUrl("");
      setShortCode("");
    }
  }, [linkData, open]);

  // Validate URL format
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setIsValidUrl(true);
      return true;
    } catch (e) {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (newUrl) {
      validateUrl(newUrl);
    } else {
      setIsValidUrl(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    // Generate a base URL and add the short code or generate a random one
    const baseUrl = window.location.origin;
    const finalShortCode = shortCode || Math.random().toString(36).substring(2, 8);
    
    onSave({
      id: linkData?.id,
      title: title.trim(),
      url: url.trim(),
      shortUrl: `${baseUrl}/${finalShortCode}`
    });
    
    // Reset form
    setTitle("");
    setUrl("");
    setShortCode("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Create New Link" : "Edit Link"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Link"
              className="subtle-ring-focus"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              className={`subtle-ring-focus ${!isValidUrl && url ? "border-destructive" : ""}`}
            />
            {!isValidUrl && url && (
              <p className="text-destructive text-sm">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortCode">Custom Short Code (optional)</Label>
            <div className="flex items-center">
              <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-sm text-muted-foreground">
                {window.location.origin}/
              </div>
              <Input
                id="shortCode"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.replace(/\s+/g, ""))}
                placeholder="custom-code"
                className="rounded-l-none subtle-ring-focus"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to generate a random code
            </p>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isCreating ? "Create Link" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLinkModal;
