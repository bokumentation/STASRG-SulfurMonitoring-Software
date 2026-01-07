import GasCard from "../GasCard";
import EnvironmentPanel from "../EnvironmentPanel";
import ActionCenter from "../ActionCenter";
import GpsDashboard from "../GpsDashboard";
import DeviceInfoPanel from "../DeviceInfoPanel";
import WindCard from "../WindCard";
import api from "@/lib/api";
import React, { useState, useEffect } from "react";

const SensorsPage = () => {

    const [position, setPosition] = useState([-6.973235, 107.632604])
    // 1. Centralized State
    const [sensorData, setSensorData] = useState({
        so2: 0,
        h2s: 0,
        wind_speed: 0,
        wind_dir: 0,
        bus_voltage: 0,
        current_ma: 0,
        battery_pct: 0,
        temp: 0,
        humidity: 0,
        timestamp: null
    });

    const getWindDirection = (deg) => {
        if (deg >= 337.5 || deg < 22.5) return "N";
        if (deg >= 22.5 && deg < 67.5) return "NE";
        if (deg >= 67.5 && deg < 112.5) return "E";
        if (deg >= 112.5 && deg < 157.5) return "SE";
        if (deg >= 157.5 && deg < 202.5) return "S";
        if (deg >= 202.5 && deg < 247.5) return "SW";
        if (deg >= 247.5 && deg < 292.5) return "W";
        if (deg >= 292.5 && deg < 337.5) return "NW";
        return deg; // Fallback to number
    };

    // 2. Fetching Logic
    useEffect(() => {
        // Connect to the FastAPI WebSocket
        const ws = new WebSocket("ws://127.0.0.1:8000/api/ws/sensors");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Real-time WS data:", data);

            // Update your centralized state
            setSensorData({
                so2: data.so2 || 0,
                h2s: data.h2s || 0,
                wind_speed: data.wind_speed || 0,
                wind_dir: data.wind_dir || 0,
                bus_voltage: data.bus_voltage || 0,
                current_ma: data.current_ma || 0,
                temp: data.temp || 0,
                humidity: data.humidity || 0,
                timestamp: data.timestamp
            });

            if (data.lat && data.lng) {
                setPosition([data.lat, data.lng]);
            }
        };

        ws.onerror = (err) => console.error("WebSocket Error:", err);
        ws.onclose = () => console.log("WebSocket Connection Closed");

        return () => ws.close(); // Cleanup on unmount
    }, []);

    console.log("DevicePanel received:", sensorData);

    return (
        <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
            <div className="border border-gray-300 rounded-2xl lg:col-span-4 flex flex-col min-h-0">
                <div className="p-5 flex flex-col justify-between shrink-0">
                    <h2 className="text-xl text-center font-bold text-gray-800 mb-3 items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        SENSOR NODE 1
                    </h2>
                    <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        SENSOR DATA
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <GasCard
                            type="SO2"
                            value={sensorData.so2.toFixed(2)}
                            unit="µg/m³"
                            period="Live"
                            status={sensorData.so2 > 50 ? "Danger" : "Normal"}
                        />
                        <GasCard
                            type="H2S"
                            value={sensorData.h2s.toFixed(3)}
                            unit="µg/m³"
                            period="Live"
                            status={sensorData.h2s > 50 ? "Caution" : "Normal"}
                        />
                        <GasCard
                            type="WIND SPEED"
                            value={sensorData.wind_speed.toFixed(1)}
                            unit="m/s"
                            period="Live"
                            status="Normal"
                        />
                        <WindCard
                            type="WIND DIRECTION"
                            value={getWindDirection(sensorData.wind_dir)}
                            unit="°"
                            period="Live"
                            status="Normal"
                        />
                    </div>
                </div>

                <div className="card-panel p-5 shrink-0">
                    <EnvironmentPanel sensorData={sensorData} />
                </div>

                <div className="card-panel p-5 shrink-0">
                    <DeviceInfoPanel
                        sensorData={sensorData}
                        position={position}
                    />
                </div>
            </div>

        </div>
    );
};

export default SensorsPage;
