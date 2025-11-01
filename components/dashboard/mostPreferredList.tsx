"use client";

import { mostPreferred } from "@/src/mocks/dashboard";
import MostPreferredItemComponent from "./mostPreferredItem";

export default function MostPreferredList() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark mb-1">En çok tercih edilenler</h2>
        <p className="text-sm text-lightGray">En çok tercih edilen influencerlar</p>
      </div>
      <div>
        {mostPreferred.map((item) => (
          <MostPreferredItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

