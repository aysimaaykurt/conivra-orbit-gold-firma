import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";

interface LocationPickerModalProps {
  visible: boolean;
  onHide: () => void;
  onSelect: (lat: string, lng: string, address?: string, city?: string, district?: string) => void;
  initialLat?: string;
  initialLng?: string;
  initialAddress?: string;
}

const cleanCityName = (city: string) => {
  if (!city) return "";
  return city.replace(/\s+ili$/i, "").replace(/\s+il$/i, "").trim();
};

const cleanDistrictName = (district: string) => {
  if (!district) return "";
  return district.replace(/\s+ilçesi$/i, "").replace(/\s+ilçe$/i, "").trim();
};

const extractCityAndDistrict = (addressObj: any) => {
  const addr = addressObj || {};
  
  // Try to find city
  let rawCity = addr.province || addr.city || addr.state || "";
  let city = cleanCityName(rawCity);
  
  // Try to find district
  let rawDistrict = addr.town || addr.suburb || addr.city_district || addr.district || addr.county || "";
  let district = cleanDistrictName(rawDistrict);
  
  return { city, district };
};

export default function LocationPickerModal({
  visible,
  onHide,
  onSelect,
  initialLat,
  initialLng,
  initialAddress,
}: LocationPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || "");
  const [detectedCity, setDetectedCity] = useState("");
  const [detectedDistrict, setDetectedDistrict] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Load Leaflet assets dynamically once
  useEffect(() => {
    const loadLeaflet = async () => {
      // Check if Leaflet CSS is loaded
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Check if Leaflet JS is loaded
      if (!(window as any).L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Leaflet load error"));
          document.body.appendChild(script);
        });
      }
      setMapReady(true);
    };

    loadLeaflet().catch(err => console.error("Failed to load Leaflet:", err));
  }, []);

  // Initialize Map when modal is visible and assets are loaded
  useEffect(() => {
    if (!visible || !mapReady) return;

    let timer: any;

    const initializeMap = () => {
      if (!mapContainerRef.current) return;

      const L = (window as any).L;
      if (!L) return;

      // Clean up previous map if exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      const parsedLat = initialLat ? parseFloat(initialLat) : NaN;
      const parsedLng = initialLng ? parseFloat(initialLng) : NaN;
      
      const isInvalid = isNaN(parsedLat) || isNaN(parsedLng) || parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180;
      
      const defaultLat = isInvalid ? 39.92077 : parsedLat;
      const defaultLng = isInvalid ? 32.85411 : parsedLng;
      const zoomLevel = !isInvalid ? 15 : 6;

      setSelectedLocation({
        lat: defaultLat.toString(),
        lng: defaultLng.toString(),
      });

      // Create map
      const map = L.map(mapContainerRef.current, {
        attributionControl: false
      }).setView([defaultLat, defaultLng], zoomLevel);
      mapRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create marker
      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Reverse geocode default position if we don't have initial address and coordinates are valid
      if (!isInvalid && !initialAddress) {
        reverseGeocode(defaultLat, defaultLng);
      }

      // Handle marker drag end
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        setSelectedLocation({
          lat: position.lat.toString(),
          lng: position.lng.toString(),
        });
        reverseGeocode(position.lat, position.lng);
      });

      // Handle map click
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedLocation({
          lat: lat.toString(),
          lng: lng.toString(),
        });
        reverseGeocode(lat, lng);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      // Fix Leaflet marker icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Force size update
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    // We wait 300ms for PrimeReact Dialog animation to finish so the map container is fully rendered and sized
    timer = setTimeout(initializeMap, 300);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [visible, mapReady, initialLat, initialLng]);

  // Autocomplete Search with Debounce
  useEffect(() => {
    if (!visible || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=tr&accept-language=tr`
        );
        const data = await res.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error("Map auto-search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, visible]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=tr`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setSelectedAddress(data.display_name);
        
        const { city, district } = extractCityAndDistrict(data.address);
        setDetectedCity(city);
        setDetectedDistrict(district);
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=tr&accept-language=tr`
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Map search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    setSelectedLocation({ lat: result.lat, lng: result.lon });
    setSelectedAddress(result.display_name);

    const { city, district } = extractCityAndDistrict(result.address);
    setDetectedCity(city);
    setDetectedDistrict(district);

    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo([lat, lon], 16, {
        animate: true,
        duration: 1.5
      });
      markerRef.current.setLatLng([lat, lon]);
      
      // Force invalidateSize after view update
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 50);
    }
  };

  const handleSave = () => {
    if (selectedLocation) {
      onSelect(selectedLocation.lat, selectedLocation.lng, selectedAddress, detectedCity, detectedDistrict);
      onHide();
    }
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-lg font-bold" style={{ color: "#4C226A" }}>
          <i className="pi pi-map-marker text-xl" />
          Haritadan Konum Seç
        </div>
      }
      visible={visible}
      style={{ width: "90vw", maxWidth: "800px" }}
      onHide={onHide}
      modal
      dismissableMask
      className="rounded-lg overflow-hidden"
      footer={
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onHide}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedLocation}
            className="px-4 py-2 bg-[#4C226A] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "#4C226A" }}
          >
            Konumu Seç ve Kaydet
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Search Bar with Results Dropdown */}
        <div className="relative">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Adres, şehir veya mekan ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4C226A]"
              />
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: "#4C226A" }}
            >
              {isSearching && <i className="pi pi-spin pi-spinner text-sm" />}
              Ara
            </button>
          </form>

          {/* Search Options Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[9999] divide-y">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    selectSearchResult(result);
                    setSearchResults([]); // close options dropdown after selection
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-xs text-gray-700 transition-colors flex items-start gap-2 focus:outline-none cursor-pointer"
                >
                  <i className="pi pi-map-marker text-[#4C226A] mt-0.5 flex-shrink-0" />
                  <span>{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Address Info */}
        {selectedAddress && (
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-950 line-clamp-2">
            <span className="font-semibold">Seçilen Adres: </span>
            {selectedAddress}
          </div>
        )}

        {/* Map Container */}
        <div 
          ref={mapContainerRef} 
          className="w-full rounded-lg border bg-gray-50 overflow-hidden relative z-0" 
          style={{ height: "350px", minHeight: "350px" }}
        />
        <div className="text-xs text-gray-500 italic">
          * Haritada istediğiniz konuma tıklayarak veya pini sürükleyerek konumu ayarlayabilirsiniz.
        </div>
      </div>
    </Dialog>
  );
}
