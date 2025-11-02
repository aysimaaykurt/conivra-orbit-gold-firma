"use client";

import React from "react";
import type { ContactInfo } from "@/src/mocks/applicationDetail";

interface ContactInfoProps {
  contact: ContactInfo;
}

export default function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <div className="space-y-4">
      {/* Dashed Divider */}
      <div className="border-t border-dashed border-gray-300 mt-6 pt-6"></div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-6">
        {/* Address */}
        <div className="flex items-start gap-3">
          <i className="pi pi-map-marker text-xl mt-0.5 flex-shrink-0" style={{ color: "#4C226A" }} />
          <div>
            <p className="text-sm text-gray-600 mb-1">Adres</p>
            <p className="text-base text-dark font-medium">{contact.address}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <i className="pi pi-envelope text-xl mt-0.5 flex-shrink-0" style={{ color: "#4C226A" }} />
          <div>
            <p className="text-sm text-gray-600 mb-1">E-mail</p>
            <p className="text-base text-dark font-medium">{contact.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

