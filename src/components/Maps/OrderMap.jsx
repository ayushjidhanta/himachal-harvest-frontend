import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "./OrderMap.css";

const OSM_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const toLatLng = (loc) => {
  if (!loc) return null;
  const lat = Number(loc.lat);
  const lng = Number(loc.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return [lat, lng];
};

export default function OrderMap({ deliveryLocation, shipmentLocation, small = false }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  const delivery = useMemo(() => toLatLng(deliveryLocation), [deliveryLocation]);
  const shipment = useMemo(() => toLatLng(shipmentLocation), [shipmentLocation]);

  useEffect(() => {
    if (!mapEl.current) return;
    if (mapRef.current) return;

    const initialCenter = shipment || delivery || [31.1048, 77.1734]; // Shimla fallback

    const map = L.map(mapEl.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(initialCenter, 12);

    L.tileLayer(OSM_TILES, {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);

    mapRef.current = map;
    layerRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [delivery, shipment]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const bounds = [];

    if (delivery) {
      const c = L.circleMarker(delivery, {
        radius: 8,
        color: "#219653",
        weight: 3,
        fillColor: "#219653",
        fillOpacity: 0.6,
      }).bindPopup("Delivery location");
      c.addTo(layer);
      bounds.push(delivery);
    }

    if (shipment) {
      const c = L.circleMarker(shipment, {
        radius: 8,
        color: "#111",
        weight: 3,
        fillColor: "#111",
        fillOpacity: 0.6,
      }).bindPopup("Shipment last known location");
      c.addTo(layer);
      bounds.push(shipment);
    }

    if (bounds.length === 2) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [24, 24] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    }
  }, [delivery, shipment]);

  if (!delivery && !shipment) return null;

  return <div ref={mapEl} className={`orderMap ${small ? "orderMapSmall" : ""}`} />;
}
