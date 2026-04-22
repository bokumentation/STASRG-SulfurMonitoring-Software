import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sensor node coordinates (shared with SensorsPage)
const SENSOR_NODES = [
    { id: 1, label: "1", lat: -7.166870, lng: 107.401387 },
    { id: 2, label: "2", lat: -7.167397, lng: 107.401775 },
    { id: 3, label: "3", lat: -7.167415, lng: 107.402914 },
    { id: 4, label: "4", lat: -7.166614, lng: 107.403483 },
    { id: 5, label: "5", lat: -7.166418, lng: 107.404100 },
    { id: 6, label: "6", lat: -7.166833, lng: 107.404111 },
    { id: "r", label: "R", lat: -7.167099, lng: 107.404272 },
];

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

const GpsDashboard = ({ sensorData, position, setPosition }) => {
    useEffect(() => {
        console.log("Listening for GPS updates...");
    }, [setPosition]);

    const { so2, h2s, temp, humidity, bus_voltage } = sensorData;

    // Center the map on the middle of all sensor nodes
    const mapCenter = [
        SENSOR_NODES.reduce((sum, n) => sum + n.lat, 0) / SENSOR_NODES.length,
        SENSOR_NODES.reduce((sum, n) => sum + n.lng, 0) / SENSOR_NODES.length,
    ];

    return (
        <div className="w-full h-full min-h-125 z-0">
            <MapContainer
                center={mapCenter}
                zoom={17}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ChangeView center={mapCenter} />

                {SENSOR_NODES.map((node) => (
                    <Marker key={node.id} position={[node.lat, node.lng]}>
                        <Popup>
                            <div className="text-sm font-sans min-w-37.5">
                                <strong className="text-black text-center block mb-1">
                                    Sensor Node {node.label}
                                </strong>
                                <p className="text-[10px] text-gray-400 text-center mb-1 font-mono">
                                    {node.lat.toFixed(6)}°S, {node.lng.toFixed(6)}°E
                                </p>
                                <div className="border-t border-gray-100 pt-1 space-y-1">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">SO₂:</span> 
                                        <span className="font-mono font-bold">{so2.toFixed(2)} µg/m³</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">H₂S:</span> 
                                        <span className="font-mono font-bold">{h2s.toFixed(3)} µg/m³</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Temp:</span> 
                                        <span className="font-mono">{temp.toFixed(1)}°C</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Hum:</span> 
                                        <span className="font-mono">{humidity.toFixed(1)}%</span>
                                    </p>
                                    <p className="flex justify-between border-t border-dashed pt-1 mt-1 text-[10px]">
                                        <span className="text-gray-400 uppercase">Power:</span> 
                                        <span className="text-emerald-600 font-bold">{bus_voltage.toFixed(2)}V</span>
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default GpsDashboard;
