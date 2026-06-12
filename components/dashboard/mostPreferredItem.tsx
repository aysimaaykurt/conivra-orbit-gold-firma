"use client";

import type { MostPreferredItem } from "@/src/api/company/dashboard/mostPreferred.models";

  
interface MostPreferredItemProps {
  item: MostPreferredItem;
}

export default function MostPreferredItemComponent({ item }: MostPreferredItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      {/* Left: Avatar / Image */}
      <div className="flex-shrink-0 mr-4">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/images/') ? item.imageUrl : `https://complexity-cloud-awarded-mug.trycloudflare.com/${item.imageUrl.replace(/^\//, '')}`}
            alt={item.title || item.name || 'Ad image'}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <i className="pi pi-image text-gray-400"></i>
          </div>
        )}
      </div>

      {/* Middle: Title and Type */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold text-dark truncate">{item.title || item.name}</h4>
        <p className="text-sm text-lightGray truncate">{item.type || item.status}</p>
      </div>

      {/* Right: Message Icon */}
      <div className="flex-shrink-0 ml-4">
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
          <i 
            className="pi pi-send text-lg" 
            style={{ color: "#17A2B8" }}
          ></i>
        </button>
      </div>
    </div>
  );
}

