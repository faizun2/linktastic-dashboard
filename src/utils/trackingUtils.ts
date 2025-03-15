
// Types for link analytics
export type LinkVisit = {
  id: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  referrer: string | null;
};

export type LinkStats = {
  totalClicks: number;
  uniqueVisitors: number;
  lastClicked: Date | null;
  visits: LinkVisit[];
};

// Mock function to get visitor's IP
export const getVisitorIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to get IP:", error);
    return "Unknown";
  }
};

// Track a link visit
export const trackLinkVisit = async (shortId: string): Promise<LinkVisit> => {
  // Get visitor's IP
  const ipAddress = await getVisitorIP();
  
  // Create visit record
  const visit: LinkVisit = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    ipAddress,
    userAgent: navigator.userAgent,
    referrer: document.referrer || null
  };
  
  // In a real app, this would send the data to a backend
  // For now, we'll store it in localStorage
  saveVisit(shortId, visit);
  
  return visit;
};

// Save visit to localStorage
const saveVisit = (shortId: string, visit: LinkVisit): void => {
  const storageKey = `link_${shortId}_visits`;
  const existingVisitsJSON = localStorage.getItem(storageKey);
  const existingVisits: LinkVisit[] = existingVisitsJSON ? JSON.parse(existingVisitsJSON) : [];
  
  // Add the new visit
  existingVisits.push(visit);
  
  // Save back to localStorage
  localStorage.setItem(storageKey, JSON.stringify(existingVisits));
  
  // Update the link stats
  updateLinkStats(shortId, existingVisits);
};

// Update link statistics
const updateLinkStats = (shortId: string, visits: LinkVisit[]): void => {
  const statsKey = `link_${shortId}_stats`;
  
  const uniqueIPs = new Set(visits.map(visit => visit.ipAddress)).size;
  
  const stats: LinkStats = {
    totalClicks: visits.length,
    uniqueVisitors: uniqueIPs,
    lastClicked: visits.length > 0 ? new Date(visits[visits.length - 1].timestamp) : null,
    visits: visits
  };
  
  localStorage.setItem(statsKey, JSON.stringify(stats));
};

// Get link statistics
export const getLinkStats = (shortId: string): LinkStats => {
  const statsKey = `link_${shortId}_stats`;
  const statsJSON = localStorage.getItem(statsKey);
  
  if (!statsJSON) {
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      lastClicked: null,
      visits: []
    };
  }
  
  const stats = JSON.parse(statsJSON);
  
  // Convert string dates back to Date objects
  if (stats.lastClicked) {
    stats.lastClicked = new Date(stats.lastClicked);
  }
  
  stats.visits = stats.visits.map((visit: any) => ({
    ...visit,
    timestamp: new Date(visit.timestamp)
  }));
  
  return stats;
};
