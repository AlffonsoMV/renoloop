// PropertyMap.jsx
import React from "react";
import { MapPin } from "lucide-react";

interface Property {
  address: string;
  city: string;
  country: string;
}

export const PropertyMap: React.FC<{ property: Property }> = ({ property }) => {
  // Construct the map URL properly
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
    property.address + "," + property.city + "," + property.country
  )}&zoom=15&size=800x300&maptype=roadmap&markers=color:orange%7C${encodeURIComponent(
    property.address + "," + property.city + "," + property.country
  )}&key=AIzaSyAS-uGZnG1Ix0wf1qLwzn4hF2livGHB7hU`;

  return (
    <div className="relative h-[300px] bg-slate-800">
      <img
        src={mapUrl}
        alt={`Map of ${property.address}`}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg border border-white/20">
        <div className="flex items-center text-white">
          <MapPin size={16} className="mr-2 text-orange-500" />
          <span>
            {property.address}, {property.city}
          </span>
        </div>
      </div>
    </div>
  );
};
