
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface PreviewProps {
  profileName: string;
  profileImage: string;
  profileBio: string;
  links: BioLink[];
  backgroundColor: string;
  containerStyle: "default" | "rounded" | "pill" | "outline";
  accentColor: string;
}

const MobilePreview: React.FC<PreviewProps> = ({
  profileName,
  profileImage,
  profileBio,
  links,
  backgroundColor,
  containerStyle,
  accentColor,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Function to get container styles based on the selected style
  const getContainerStyles = (style: string) => {
    switch (style) {
      case "rounded":
        return "rounded-xl";
      case "pill":
        return "rounded-full";
      case "outline":
        return "border-2 bg-opacity-10";
      default:
        return "rounded-md";
    }
  };

  // Set background color for the preview
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);

  // Get container class based on selected style
  const containerClass = getContainerStyles(containerStyle);

  return (
    <div className="phone-frame w-[320px] h-[580px] mx-auto">
      <div 
        ref={previewRef}
        className="w-full h-full overflow-y-auto py-8 px-6"
        style={{ backgroundColor }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-4" style={{ borderRadius: "50%", padding: "4px", backgroundColor: accentColor }}>
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt={profileName} />
              <AvatarFallback className="text-2xl">{profileName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <h2 className="text-xl font-bold mb-1">{profileName}</h2>
          
          <p className="text-sm text-center mb-6 max-w-[250px]">{profileBio}</p>
          
          <div className="w-full max-w-[250px] space-y-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`block p-3 transition-all ${containerClass} link-card-hover`}
                style={{ 
                  backgroundColor: containerStyle === "outline" ? "transparent" : accentColor,
                  borderColor: accentColor,
                  color: containerStyle === "outline" ? "#000" : "#fff"
                }}
              >
                <div className="flex items-center justify-between text-center">
                  <span className="mx-auto font-medium">{link.title}</span>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-8 text-xs opacity-60 text-center">
            Powered by LinkCraft
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
