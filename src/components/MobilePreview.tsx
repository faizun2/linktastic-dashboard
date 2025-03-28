
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  active?: boolean;
}

export interface PreviewProps {
  profileName: string;
  profileImage: string;
  profileBio: string;
  links: BioLink[];
  backgroundColor: string;
  containerStyle: "default" | "rounded" | "pill" | "outline";
  accentColor: string;
  backgroundType?: "color" | "gradient" | "image";
  backgroundBlur?: boolean;
}

const MobilePreview: React.FC<PreviewProps> = ({
  profileName,
  profileImage,
  profileBio,
  links,
  backgroundColor,
  containerStyle,
  accentColor,
  backgroundType = "color",
  backgroundBlur = false,
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

  // Set background for the preview
  useEffect(() => {
    if (previewRef.current) {
      if (backgroundType === "image") {
        previewRef.current.style.backgroundImage = `url(${backgroundColor})`;
        previewRef.current.style.backgroundSize = "cover";
        previewRef.current.style.backgroundPosition = "center";
        previewRef.current.style.backgroundColor = "transparent";
      } else {
        previewRef.current.style.backgroundImage = "none";
        previewRef.current.style.backgroundColor = backgroundColor;
      }
    }
  }, [backgroundColor, backgroundType]);

  // Get container class based on selected style
  const containerClass = getContainerStyles(containerStyle);

  return (
    <div className="phone-frame w-[320px] h-[580px] mx-auto border-8 border-gray-800 rounded-[36px] shadow-xl overflow-hidden">
      <div 
        ref={previewRef}
        className={`w-full h-full overflow-y-auto py-8 px-6 ${backgroundBlur && backgroundType === "image" ? 'backdrop-blur-md' : ''}`}
      >
        <div className="flex flex-col items-center">
          {/* Using a wrapper div with borderColor instead of directly styling the Avatar */}
          <div className="mb-4">
            <Avatar className="h-24 w-24" style={{ border: `4px solid ${accentColor}`, borderRadius: '50%' }}>
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
            Powered by Mas Faiz
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
