
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Edit, ExternalLink, Trash, MoveVertical } from "lucide-react";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface LinkItemProps {
  id: string;
  title: string;
  url: string;
  shortUrl: string;
  clickCount: number;
  createdAt: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({
  id,
  title,
  url,
  shortUrl,
  clickCount,
  createdAt,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="link-card mb-4 group"
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div 
            {...attributes} 
            {...listeners}
            className="mr-3 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity"
          >
            <MoveVertical size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="truncate">
                <h3 className="font-medium text-base truncate">{title}</h3>
                <a href={url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground truncate flex items-center">
                  <span className="truncate">{url}</span>
                  <ExternalLink className="ml-1 h-3 w-3 inline flex-shrink-0" />
                </a>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {clickCount} {clickCount === 1 ? "click" : "clicks"}
                </Badge>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Input 
                  value={shortUrl} 
                  readOnly 
                  className="pr-20 text-sm"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={copyToClipboard}
                >
                  <Copy size={16} className="mr-1" /> Copy
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onEdit(id)}
                className="h-10 w-10"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onDelete(id)}
                className="h-10 w-10 text-destructive hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkItem;
