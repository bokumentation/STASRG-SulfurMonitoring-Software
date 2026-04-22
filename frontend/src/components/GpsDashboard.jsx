import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ─── Marker icons ───────────────────────────────────────────────────────────
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const SelectedIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    className: "selected-marker",
});

L.Marker.prototype.options.icon = DefaultIcon;

// ─── Map view updater ───────────────────────────────────────────────────────
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

// ─── Component ──────────────────────────────────────────────────────────────
const GpsDashboard = ({
    nodesData = {},
    sensorNodes = [],
    selectedNodeId = null,
    onNodeSelect,
}) => {
    // Center the map on the middle of all sensor nodes
    const mapCenter =
        sensorNodes.length > 0
            ? [
                  sensorNodes.reduce((sum, n) => sum + n.lat, 0) / sensorNodes.length,
                  sensorNodes.reduce((sum, n) => sum + n.lng, 0) / sensorNodes.length,
              ]
            : [-7.167, 107.403];

    // Determine marker color based on gas levels
    const getStatusColor = (data) => {
        if (!data) return "text-gray-400";
        if (data.so2 > 50 || data.h2s > 50) return "text-red-500";
        if (data.so2 > 30 || data.h2s > 30) return "text-amber-500";
        return "text-emerald-500";
    };

    const getStatusLabel = (data) => {
        if (!data) return "No Data";
        if (data.so2 > 50 || data.h2s > 50) return "Danger";
        if (data.so2 > 30 || data.h2s > 30) return "Caution";
        return "Safe";
    };

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

                {sensorNodes.map((node) => {
                    const nodeData = nodesData[node.id];
                    const isSelected = String(selectedNodeId) === String(node.id);

                    return (
                        <Marker
                            key={node.id}
                            position={[node.lat, node.lng]}
                            icon={isSelected ? SelectedIcon : DefaultIcon}
                            eventHandlers={{
                                click: () => {
                                    if (onNodeSelect) onNodeSelect(node.id);
                                },
                            }}
                        >
                            <Popup>
                                <div className="text-sm font-sans min-w-44">
                                    <strong className="text-black text-center block mb-0.5">
                                        Sensor Node {node.label}
                                    </strong>
                                    <p className="text-[10px] text-gray-400 text-center mb-1 font-mono">
                                        {node.lat.toFixed(6)}°S, {node.lng.toFixed(6)}°E
                                    </p>

                                    {/* Status badge */}
                                    <div className="flex justify-center mb-1.5">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            getStatusColor(nodeData)
                                        } ${
                                            getStatusLabel(nodeData) === "Danger"
                                                ? "bg-red-50"
                                                : getStatusLabel(nodeData) === "Caution"
                                                ? "bg-amber-50"
                                                : "bg-emerald-50"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                getStatusLabel(nodeData) === "Danger"
                                                    ? "bg-red-500"
                                                    : getStatusLabel(nodeData) === "Caution"
                                                    ? "bg-amber-500"
                                                    : "bg-emerald-500"
                                            }`} />
                                            {getStatusLabel(nodeData)}
                                        </span>
                                    </div>

                                    {nodeData ? (
                                        <div className="border-t border-gray-100 pt-1 space-y-1">
                                            <p className="flex justify-between">
                                                <span className="text-gray-500">SO₂:</span>
                                                <span className="font-mono font-bold">{Number(nodeData.so2).toFixed(2)} µg/m³</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-gray-500">H₂S:</span>
                                                <span className="font-mono font-bold">{Number(nodeData.h2s).toFixed(3)} µg/m³</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-gray-500">Temp:</span>
                                                <span className="font-mono">{Number(nodeData.temp).toFixed(1)}°C</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-gray-500">Hum:</span>
                                                <span className="font-mono">{Number(nodeData.humidity).toFixed(1)}%</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-gray-500">Wind:</span>
                                                <span className="font-mono">{Number(nodeData.wind_speed).toFixed(1)} m/s</span>
                                            </p>
                                            <p className="flex justify-between border-t border-dashed pt-1 mt-1 text-[10px]">
                                                <span className="text-gray-400 uppercase">Power:</span>
                                                <span className="text-emerald-600 font-bold">{Number(nodeData.bus_voltage).toFixed(2)}V</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center border-t border-gray-100 pt-2">
                                            No data available
                                        </p>
                                    )}

                                    {/* Click hint */}
                                    <p className="text-[9px] text-gray-300 text-center mt-2 italic">
                                        Click marker to view in detail panel →
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default GpsDashboard;
