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

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

const GpsDashboard = ({ position, setPosition }) => {
    useEffect(() => {
        console.log("Listening for GPS updates...");
    }, [setPosition]);

    return (
        <div className="w-full h-full min-h-125 z-0">
            <MapContainer
                center={position}
                zoom={18}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ChangeView center={position} />
                <Marker position={position}>
                    <Popup>
                        <div className="text-xs font-sans">
                            <strong>Sensor Node 1</strong>
                            <br />
                            Active Monitoring
                            <p>
                                {" "}
                                SO2: 00.00ugm <br /> H2S: 00.00ugm <br /> Wind
                                Speed: 00.00m/s <br /> Wind Direction: W{" "}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default GpsDashboard;
